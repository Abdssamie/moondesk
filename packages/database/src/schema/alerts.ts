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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sensors } from "./sensors";

/**
 * Alerts table - threshold violation notifications
 */
export const alerts = pgTable(
  "alerts",
  {
    id: serial("id").primaryKey(),
    sensorId: integer("sensor_id")
      .notNull()
      .references(() => sensors.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .notNull()
      .defaultNow(),
    severity: text("severity").notNull().default("info"),
    message: text("message").notNull(),
    triggerValue: doublePrecision("trigger_value").notNull(),
    thresholdValue: doublePrecision("threshold_value"),
    acknowledged: boolean("acknowledged").notNull().default(false),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
    acknowledgedBy: text("acknowledged_by"),
    notes: text("notes"),
    protocol: text("protocol").notNull().default("mqtt"),
    metadata: jsonb("metadata").$type<Record<string, string>>().default({}),
  },
  (table) => [
    index("idx_alerts_org_acknowledged_time").on(
      table.organizationId,
      table.acknowledged,
      table.timestamp,
    ),
    index("idx_alerts_org_sensor").on(table.organizationId, table.sensorId),
  ],
);

/**
 * Alert relations
 */
export const alertsRelations = relations(alerts, ({ one }) => ({
  sensor: one(sensors, {
    fields: [alerts.sensorId],
    references: [sensors.id],
  }),
}));

export type AlertRecord = typeof alerts.$inferSelect;
export type NewAlertRecord = typeof alerts.$inferInsert;
