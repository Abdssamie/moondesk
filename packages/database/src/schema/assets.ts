import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sensors } from "./sensors";

/**
 * Assets table - represents industrial equipment being monitored
 */
export const assets = pgTable(
  "assets",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    location: text("location").notNull().default(""),
    status: text("status").notNull().default("unknown"),
    lastSeen: timestamp("last_seen", { withTimezone: true }),
    description: text("description"),
    manufacturer: text("manufacturer"),
    modelNumber: text("model_number"),
    installationDate: timestamp("installation_date", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, string>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_assets_organization_id").on(table.organizationId),
    index("idx_assets_status").on(table.organizationId, table.status),
  ],
);

/**
 * Asset relations
 */
export const assetsRelations = relations(assets, ({ many }) => ({
  sensors: many(sensors),
}));

export type AssetRecord = typeof assets.$inferSelect;
export type NewAssetRecord = typeof assets.$inferInsert;
