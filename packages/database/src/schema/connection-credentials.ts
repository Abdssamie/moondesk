import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    jsonb,
    index,
} from 'drizzle-orm/pg-core';

/**
 * Connection credentials table - secure storage for MQTT/OPC-UA credentials
 */
export const connectionCredentials = pgTable(
    'connection_credentials',
    {
        id: serial('id').primaryKey(),
        organizationId: text('organization_id').notNull(),
        name: text('name').notNull(),
        protocol: text('protocol').notNull(),
        endpointUri: text('endpoint_uri').notNull(),
        username: text('username').notNull(),
        encryptedPassword: text('encrypted_password').notNull(),
        encryptionIV: text('encryption_iv').notNull(),
        clientId: text('client_id'),
        isActive: boolean('is_active').notNull().default(true),
        metadata: jsonb('metadata').$type<Record<string, string>>().default({}),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
        index('idx_credentials_org_protocol').on(table.organizationId, table.protocol),
        index('idx_credentials_org_active').on(table.organizationId, table.isActive),
    ]
);

export type ConnectionCredentialRecord = typeof connectionCredentials.$inferSelect;
export type NewConnectionCredentialRecord = typeof connectionCredentials.$inferInsert;
