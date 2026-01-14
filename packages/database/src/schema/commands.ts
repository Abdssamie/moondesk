import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sensors } from "./sensors";

/**
 * Commands table - device control commands
 */
export const commands = pgTable(
  "commands",
  {
    id: serial("id").primaryKey(),
    sensorId: integer("sensor_id")
      .notNull()
      .references(() => sensors.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").notNull(),
    userId: text("user_id").notNull(),
    action: text("action").notNull(),
    parameters: jsonb("parameters")
      .$type<Record<string, unknown>>()
      .default({}),
    status: text("status").notNull().default("pending"),
    protocol: text("protocol").notNull().default("mqtt"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    errorMessage: text("error_message"),
    metadata: jsonb("metadata").$type<Record<string, string>>().default({}),
  },
  (table) => [
    index("idx_commands_org_status_time").on(
      table.organizationId,
      table.status,
      table.createdAt,
    ),
    index("idx_commands_org_user").on(table.organizationId, table.userId),
  ],
);

/**
 * Command relations
 */
export const commandsRelations = relations(commands, ({ one }) => ({
  sensor: one(sensors, {
    fields: [commands.sensorId],
    references: [sensors.id],
  }),
}));

export type CommandRecord = typeof commands.$inferSelect;
export type NewCommandRecord = typeof commands.$inferInsert;
