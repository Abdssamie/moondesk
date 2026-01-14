import { z } from 'zod';
import { Parameter, Protocol, ReadingQuality } from '@moondesk/domain';

/**
 * Expected MQTT message format from edge devices
 * Topic format: moondesk/{organizationId}/sensors/{sensorId}/readings
 */
export const mqttReadingSchema = z.object({
    // Sensor identification
    sensorId: z.number(),

    // Reading data
    value: z.number(),
    timestamp: z.string().datetime().optional(),

    // Optional metadata
    parameter: z.nativeEnum(Parameter).optional(),
    quality: z.nativeEnum(ReadingQuality).optional(),
    metadata: z.record(z.string()).optional(),
});

export type MqttReading = z.infer<typeof mqttReadingSchema>;

/**
 * Batch message for multiple readings
 */
export const mqttBatchSchema = z.object({
    readings: z.array(mqttReadingSchema),
});

export type MqttBatch = z.infer<typeof mqttBatchSchema>;

/**
 * Alert threshold configuration message
 */
export const mqttAlertConfigSchema = z.object({
    sensorId: z.number(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    enabled: z.boolean().default(true),
});

export type MqttAlertConfig = z.infer<typeof mqttAlertConfigSchema>;

/**
 * Command response from edge device
 */
export const mqttCommandResponseSchema = z.object({
    commandId: z.number(),
    status: z.enum(['completed', 'failed', 'timeout']),
    result: z.string().optional(),
    error: z.string().optional(),
});

export type MqttCommandResponse = z.infer<typeof mqttCommandResponseSchema>;

/**
 * Parse topic to extract organization and sensor IDs
 * Format: moondesk/{organizationId}/sensors/{sensorId}/{action}
 */
export interface ParsedTopic {
    organizationId: string;
    sensorId: number;
    action: 'readings' | 'batch' | 'status' | 'command-response';
}

export function parseTopic(topic: string): ParsedTopic | null {
    const parts = topic.split('/');

    // Expected: moondesk/{orgId}/sensors/{sensorId}/{action}
    if (parts.length < 5 || parts[0] !== 'moondesk' || parts[2] !== 'sensors') {
        return null;
    }

    const organizationId = parts[1];
    const sensorId = parseInt(parts[3] ?? '', 10);
    const action = parts[4] as ParsedTopic['action'];

    if (!organizationId || isNaN(sensorId)) {
        return null;
    }

    const validActions = ['readings', 'batch', 'status', 'command-response'];
    if (!validActions.includes(action)) {
        return null;
    }

    return { organizationId, sensorId, action };
}

/**
 * Parse and validate MQTT message payload
 */
export function parseMessage(
    payload: Buffer,
    action: ParsedTopic['action']
): MqttReading | MqttBatch | MqttCommandResponse | null {
    try {
        const data = JSON.parse(payload.toString());

        switch (action) {
            case 'readings':
                return mqttReadingSchema.parse(data);
            case 'batch':
                return mqttBatchSchema.parse(data);
            case 'command-response':
                return mqttCommandResponseSchema.parse(data);
            default:
                return null;
        }
    } catch (error) {
        return null;
    }
}
