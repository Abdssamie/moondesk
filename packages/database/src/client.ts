import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Get or create the database connection pool
 */
export function getPool(): pg.Pool {
    if (!pool) {
        const connectionString = process.env['DATABASE_URL'];
        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is required');
        }

        pool = new Pool({
            connectionString,
            max: 20, // Maximum connections in pool
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        pool.on('error', (err) => {
            console.error('Unexpected database pool error:', err);
        });
    }

    return pool;
}

/**
 * Get or create the Drizzle database instance
 */
export function getDb() {
    if (!db) {
        db = drizzle(getPool(), { schema });
    }
    return db;
}

/**
 * Close the database connection pool
 */
export async function closeDb(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
        db = null;
    }
}

// Export schema and types
export * from './schema/index';
export { schema };
