import { createLogger } from '@moondesk/logger';
import { ReadingRepository, SensorRepository, AlertRepository } from '@moondesk/database';
import { AlertSeverity, Parameter, Protocol, ReadingQuality } from '@moondesk/domain';
import type { CreateReadingInput, CreateAlertInput } from '@moondesk/domain';
import { parseTopic, parseMessage, type MqttReading, type MqttBatch, type MqttCommandResponse } from './parser';
import { broadcastToApi } from './api-broadcaster';

const logger = createLogger('ingestion');

const readingRepository = new ReadingRepository();
const sensorRepository = new SensorRepository();
const alertRepository = new AlertRepository();

// Cache for sensor thresholds (refreshed periodically)
const sensorThresholdCache = new Map<number, { min: number | null; max: number | null }>();

/**
 * Main message handler for incoming MQTT messages
 */
export async function handleMessage(topic: string, payload: Buffer): Promise<void> {
    const parsed = parseTopic(topic);
    if (!parsed) {
        logger.warn({ topic }, 'Unable to parse topic');
        return;
    }

    const { organizationId, sensorId, action } = parsed;

    switch (action) {
        case 'readings':
            try {
                await handleSingleReading(organizationId, sensorId, payload);
            } catch (error) {
                logger.error({ error, topic, organizationId, sensorId }, 'Error processing single reading');
            }
            break;
        case 'batch':
            try {
                await handleBatchReadings(organizationId, sensorId, payload);
            } catch (error) {
                logger.error({ error, topic, organizationId, sensorId }, 'Error processing batch readings');
            }
            break;
        case 'command-response':
            try {
                await handleCommandResponse(organizationId, sensorId, payload);
            } catch (error) {
                logger.error({ error, topic, organizationId, sensorId }, 'Error processing command response');
            }
            break;
        default:
            logger.debug({ topic, action }, 'Unhandled action type');
    }
}

/**
 * Handle a single reading message
 */
async function handleSingleReading(
    organizationId: string,
    sensorId: number,
    payload: Buffer
): Promise<void> {
    const message = parseMessage(payload, 'readings') as MqttReading | null;

    if (!message) {
        logger.warn({ organizationId, sensorId }, 'Invalid reading message');
        return;
    }

    const input: CreateReadingInput = {
        sensorId,
        organizationId,
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
        value: message.value,
        parameter: message.parameter ?? Parameter.None,
        protocol: Protocol.Mqtt,
        quality: message.quality ?? ReadingQuality.Good,
        metadata: message.metadata ?? {},
    };

    // Insert reading
    const reading = await readingRepository.insert(input);

    logger.debug({ sensorId, value: reading.value }, 'Reading ingested');

    // Check for alert thresholds
    await checkThresholds(organizationId, sensorId, message.value);

    // Broadcast to API via Socket.io
    await broadcastToApi('reading', {
        sensorId,
        assetId: 0, // Would need to lookup
        organizationId,
        timestamp: reading.timestamp,
        value: reading.value,
        parameter: reading.parameter,
        quality: reading.quality,
    });
}

/**
 * Handle a batch of readings
 */
async function handleBatchReadings(
    organizationId: string,
    sensorId: number,
    payload: Buffer
): Promise<void> {
    const message = parseMessage(payload, 'batch') as MqttBatch | null;

    if (!message || !message.readings.length) {
        logger.warn({ organizationId, sensorId }, 'Invalid or empty batch message');
        return;
    }

    const inputs: CreateReadingInput[] = message.readings.map((r: MqttReading) => ({
        sensorId: r.sensorId || sensorId,
        organizationId,
        timestamp: r.timestamp ? new Date(r.timestamp) : new Date(),
        value: r.value,
        parameter: r.parameter ?? Parameter.None,
        protocol: Protocol.Mqtt,
        quality: r.quality ?? ReadingQuality.Good,
        metadata: r.metadata ?? {},
    }));

    // Bulk insert readings
    await readingRepository.bulkInsert(inputs);

    logger.info({ sensorId, count: inputs.length }, 'Batch readings ingested');

    // Check thresholds for each reading
    for (const input of inputs) {
        await checkThresholds(organizationId, input.sensorId, input.value);
    }

    // Broadcast batch to API
    await broadcastToApi('reading-batch', inputs.map(r => ({
        sensorId: r.sensorId,
        assetId: 0,
        organizationId,
        timestamp: r.timestamp ?? new Date(),
        value: r.value,
        parameter: r.parameter ?? Parameter.None,
        quality: r.quality ?? ReadingQuality.Good,
    })));
}

/**
 * Handle command response from edge device
 */
async function handleCommandResponse(
    organizationId: string,
    sensorId: number,
    payload: Buffer
): Promise<void> {
    const message = parseMessage(payload, 'command-response') as MqttCommandResponse | null;

    if (!message) {
        logger.warn({ organizationId, sensorId }, 'Invalid command response');
        return;
    }

    // Would update command status in database
    logger.info({ sensorId, commandId: message.commandId, status: message.status }, 'Command response received');

    // Broadcast command status update
    await broadcastToApi('command-status', {
        id: message.commandId,
        sensorId,
        organizationId,
        status: message.status,
        result: message.result ?? null,
        completedAt: new Date(),
    });
}

/**
 * Check reading value against thresholds and create alerts if needed
 */
async function checkThresholds(
    organizationId: string,
    sensorId: number,
    value: number
): Promise<void> {
    // Get cached thresholds or fetch from database
    let thresholds = sensorThresholdCache.get(sensorId);

    if (!thresholds) {
        const sensor = await sensorRepository.getById(sensorId, organizationId);
        if (sensor) {
            thresholds = { min: sensor.thresholdLow, max: sensor.thresholdHigh };
            sensorThresholdCache.set(sensorId, thresholds);
        } else {
            return;
        }
    }

    let alertSeverity: AlertSeverity | null = null;
    let alertMessage = '';
    let thresholdValue: number | null = null;

    if (thresholds.max !== null && value > thresholds.max) {
        alertSeverity = AlertSeverity.Critical;
        alertMessage = `Value ${value} exceeds maximum threshold ${thresholds.max}`;
        thresholdValue = thresholds.max;
    } else if (thresholds.min !== null && value < thresholds.min) {
        alertSeverity = AlertSeverity.Warning;
        alertMessage = `Value ${value} below minimum threshold ${thresholds.min}`;
        thresholdValue = thresholds.min;
    }

    if (alertSeverity) {
        const alertInput: CreateAlertInput = {
            sensorId,
            organizationId,
            severity: alertSeverity,
            message: alertMessage,
            triggerValue: value,
            thresholdValue,
            protocol: Protocol.Mqtt,
            metadata: {},
        };

        const alert = await alertRepository.create(alertInput);

        logger.info({ sensorId, alertId: alert.id, severity: alertSeverity }, 'Alert created');

        // Broadcast alert
        await broadcastToApi('alert', {
            id: alert.id,
            sensorId,
            assetId: 0,
            organizationId,
            severity: alert.severity,
            message: alert.message,
            value: alert.triggerValue,
            threshold: alert.thresholdValue ?? 0,
            createdAt: alert.timestamp,
        });
    }
}

/**
 * Refresh threshold cache for all sensors in the system.
 * This should be called periodically.
 */
export async function refreshAllSensorThresholds(): Promise<void> {
    const sensors = await sensorRepository.getAll();
    for (const sensor of sensors) {
        sensorThresholdCache.set(sensor.id, {
            min: sensor.thresholdLow,
            max: sensor.thresholdHigh,
        });
    }
    logger.info({ count: sensors.length }, 'Refreshed sensor threshold cache');
}

/**
 * Clear threshold cache
 */
export function clearThresholdCache(): void {
    sensorThresholdCache.clear();
}
