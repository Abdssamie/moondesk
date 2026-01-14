import { getEnv } from './env';

/**
 * Database configuration
 */
export function getDatabaseConfig() {
    const env = getEnv();

    return {
        connectionString: env.DATABASE_URL,
        pool: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        },
    };
}
