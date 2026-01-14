import { createLogger } from '@moondesk/logger';
import { MqttPublisher } from './mqtt-publisher';
import { generateValue } from './generators';
import { SimulatedSensorConfig, SimulationScenario } from './types';
import { ReadingQuality } from '@moondesk/domain';

const logger = createLogger('simulation-engine');

export class SimulationEngine {
    private sensors: Map<number, NodeJS.Timeout> = new Map();
    private configs: Map<number, SimulatedSensorConfig> = new Map();
    private publisher: MqttPublisher;

    constructor(publisher: MqttPublisher) {
        this.publisher = publisher;
    }

    startScenario(scenario: SimulationScenario) {
        logger.info({ scenario: scenario.name }, 'Starting scenario');
        this.stopAll();

        for (const sensorConfig of scenario.sensors) {
            this.addSensor(sensorConfig);
        }
    }

    addSensor(config: SimulatedSensorConfig) {
        if (this.configs.has(config.id)) {
            this.removeSensor(config.id);
        }
        this.configs.set(config.id, config);

        if (config.enabled) {
            this.startSensor(config.id);
        }
    }

    private startSensor(id: number) {
        const config = this.configs.get(id);
        if (!config) return;

        logger.info({ sensorId: id, type: config.type }, 'Starting sensor simulation');

        // Initial reading
        this.emitReading(config);

        const interval = setInterval(() => {
            this.emitReading(config);
        }, config.intervalMs);

        this.sensors.set(id, interval);
    }

    private emitReading(config: SimulatedSensorConfig) {
        const value = generateValue(config.profile, Date.now());
        const topic = `moondesk/${config.organizationId}/sensors/${config.id}/readings`;

        const payload = {
            sensorId: config.id,
            value: value,
            timestamp: new Date().toISOString(),
            parameter: config.profile.parameter,
            quality: ReadingQuality.Good,
            metadata: {
                generator: 'edge-simulator',
                waveform: config.profile.waveform
            }
        };

        this.publisher.publish(topic, payload);
    }

    removeSensor(id: number) {
        const interval = this.sensors.get(id);
        if (interval) {
            clearInterval(interval);
            this.sensors.delete(id);
        }
        this.configs.delete(id);
    }

    stopAll() {
        for (const interval of this.sensors.values()) {
            clearInterval(interval);
        }
        this.sensors.clear();
        this.configs.clear();
        logger.info('Stopped all simulations');
    }
}
