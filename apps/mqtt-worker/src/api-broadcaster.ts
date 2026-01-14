import { io, Socket } from 'socket.io-client';
import { createLogger } from '@moondesk/logger';
import { getEnv } from '@moondesk/config';

const logger = createLogger('api-broadcaster');

let socket: Socket | null = null;

interface ReadingPayload {
    sensorId: number;
    assetId: number;
    organizationId: string;
    timestamp: Date;
    value: number;
    parameter: string;
    quality: string;
}

interface AlertPayload {
    id: number;
    sensorId: number;
    assetId: number;
    organizationId: string;
    severity: string;
    message: string;
    value: number;
    threshold: number;
    createdAt: Date;
}

interface CommandStatusPayload {
    id: number;
    sensorId: number;
    organizationId: string;
    status: string;
    result: string | null;
    completedAt: Date;
}

type BroadcastType = 'reading' | 'reading-batch' | 'alert' | 'command-status';
type BroadcastPayload = ReadingPayload | ReadingPayload[] | AlertPayload | CommandStatusPayload;

/**
 * Connect to the API's internal broadcast endpoint
 * In production, this would use Redis pub/sub for horizontal scaling
 */
export async function connectToApi(): Promise<void> {
    const env = getEnv();
    const apiUrl = process.env['API_URL'] || `http://${env.HOST}:${env.PORT}`;

    return new Promise((resolve, reject) => {
        logger.info({ apiUrl }, 'Connecting to API for broadcasting');

        socket = io(apiUrl, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10,
            // Use internal service token for worker-to-API communication
            auth: {
                token: process.env['INTERNAL_SERVICE_TOKEN'] ?? '',
                isWorker: true,
            },
        });

        socket.on('connect', () => {
            logger.info('Connected to API for broadcasting');
            resolve();
        });

        socket.on('connect_error', (error) => {
            logger.error({ error: error.message }, 'Failed to connect to API');
            // Don't reject - we can operate without broadcasting
            resolve();
        });

        socket.on('disconnect', (reason) => {
            logger.warn({ reason }, 'Disconnected from API');
        });
    });
}

/**
 * Broadcast an event to the API server
 * The API server will then broadcast to connected clients
 */
export async function broadcastToApi(
    type: BroadcastType,
    payload: BroadcastPayload
): Promise<void> {
    if (!socket?.connected) {
        logger.debug({ type }, 'Cannot broadcast - not connected to API');
        return;
    }

    try {
        socket.emit(`worker:${type}`, payload);
        logger.debug({ type }, 'Broadcasted event to API');
    } catch (error) {
        logger.error({ error, type }, 'Failed to broadcast to API');
    }
}

/**
 * Disconnect from API
 */
export function disconnectFromApi(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
        logger.info('Disconnected from API broadcaster');
    }
}
