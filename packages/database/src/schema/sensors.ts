import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    integer,
    doublePrecision,
    jsonb,
    index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { assets } from './assets';
import { readings } from './readings';
import { alerts } from './alerts';
import { commands } from './commands';

/**
 * Sensors table - represents measurement devices attached to assets
 */
export const sensors = pgTable(
    'sensors',
    {
        id: serial('id').primaryKey(),
        assetId: integer('asset_id')
            .notNull()
            .references(() => assets.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        type: text('type').notNull(),
        parameter: text('parameter').notNull().default('none'),
        unit: text('unit').notNull(),
        thresholdLow: doublePrecision('threshold_low'),
        thresholdHigh: doublePrecision('threshold_high'),
        minValue: doublePrecision('min_value'),
        maxValue: doublePrecision('max_value'),
        samplingIntervalMs: integer('sampling_interval_ms').notNull().default(1000),
        isActive: boolean('is_active').notNull().default(true),
        protocol: text('protocol').notNull().default('mqtt'),
        description: text('description'),
        metadata: jsonb('metadata').$type<Record<string, string>>().default({}),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [index('idx_sensors_asset_id').on(table.assetId)]
);

/**
 * Sensor relations
 */
export const sensorsRelations = relations(sensors, ({ one, many }) => ({
    asset: one(assets, {
        fields: [sensors.assetId],
        references: [assets.id],
    }),
    readings: many(readings),
    alerts: many(alerts),
    commands: many(commands),
}));

export type SensorRecord = typeof sensors.$inferSelect;
export type NewSensorRecord = typeof sensors.$inferInsert;
