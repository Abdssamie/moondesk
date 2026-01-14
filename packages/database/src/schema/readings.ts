import {
    pgTable,
    text,
    timestamp,
    doublePrecision,
    jsonb,
    index,
    integer,
    primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sensors } from './sensors';

/**
 * Readings table - time-series sensor data
 * Optimized for TimescaleDB hypertable (composite primary key on sensorId + timestamp)
 */
export const readings = pgTable(
    'readings',
    {
        sensorId: integer('sensor_id')
            .notNull()
            .references(() => sensors.id, { onDelete: 'cascade' }),
        organizationId: text('organization_id').notNull(),
        timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
        value: doublePrecision('value').notNull(),
        parameter: text('parameter').notNull().default('none'),
        protocol: text('protocol').notNull().default('mqtt'),
        quality: text('quality').notNull().default('good'),
        notes: text('notes'),
        metadata: jsonb('metadata').$type<Record<string, string>>().default({}),
    },
    (table) => [
        // Composite primary key for TimescaleDB
        primaryKey({ columns: [table.sensorId, table.timestamp] }),
        // Critical indexes for time-series queries
        index('idx_readings_org_sensor_time').on(
            table.organizationId,
            table.sensorId,
            table.timestamp
        ),
        index('idx_readings_org_time').on(table.organizationId, table.timestamp),
    ]
);

/**
 * Reading relations
 */
export const readingsRelations = relations(readings, ({ one }) => ({
    sensor: one(sensors, {
        fields: [readings.sensorId],
        references: [sensors.id],
    }),
}));

export type ReadingRecord = typeof readings.$inferSelect;
export type NewReadingRecord = typeof readings.$inferInsert;
