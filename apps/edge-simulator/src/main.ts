import { createLogger } from '@moondesk/logger';
import { MqttPublisher } from './mqtt-publisher';
import { SimulationEngine } from './simulation-engine';
import { SimulationScenario } from './types';
import { Parameter, SensorType } from '@moondesk/domain';

const logger = createLogger('simulator-main');

const DEFAULT_SCENARIO: SimulationScenario = {
    id: 'default-factory',
    name: 'Default Smart Factory',
    description: 'A basic factory setup with various sensors',
    sensors: [
        {
            id: 101, // Temperature Sensor
            organizationId: 'org_1',
            type: SensorType.Temperature,
            enabled: true,
            intervalMs: 2000,
            profile: {
                waveform: 'sine',
                parameter: Parameter.Temperature,
                min: 20,
                max: 80,
                frequency: 0.1, // Slow cycle
                noise: 1.5
            }
        },
        {
            id: 102, // Vibration Sensor (High frequency)
            organizationId: 'org_1',
            type: SensorType.Vibration,
            enabled: true,
            intervalMs: 500, // Fast sampling
            profile: {
                waveform: 'random', // Noisy
                parameter: Parameter.Vibration,
                min: 0,
                max: 5,
                frequency: 1,
                noise: 0.5
            }
        },
        {
            id: 103, // Pressure Sensor (Sawtooth - building up then release)
            organizationId: 'org_1',
            type: SensorType.Pressure,
            enabled: true,
            intervalMs: 1000,
            profile: {
                waveform: 'sawtooth',
                parameter: Parameter.Pressure,
                min: 100,
                max: 500,
                frequency: 0.05,
                noise: 5
            }
        }
    ]
};

async function main() {
    logger.info('Starting Edge Simulator...');

    const publisher = new MqttPublisher();
    const engine = new SimulationEngine(publisher);

    try {
        await publisher.connect();

        // Load default scenario
        engine.startScenario(DEFAULT_SCENARIO);

        // Keep process alive
        process.stdin.resume();

        // Handle shutdown
        const shutdown = async () => {
            logger.info('Shutting down...');
            engine.stopAll();
            await publisher.disconnect();
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        logger.error({ error }, 'Failed to start simulator');
        process.exit(1);
    }
}

main();
