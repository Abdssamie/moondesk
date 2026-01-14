import {
    pgTable,
    text,
    timestamp,
    primaryKey,
    index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

/**
 * Organizations table - synced from Clerk
 */
export const organizations = pgTable(
    'organizations',
    {
        id: text('id').primaryKey(), // Clerk organization ID
        name: text('name').notNull(),
        slug: text('slug').unique(),
        imageUrl: text('image_url'),
        ownerId: text('owner_id').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
        index('idx_organizations_owner').on(table.ownerId),
    ]
);

/**
 * Organization memberships - many-to-many between users and organizations
 */
export const organizationMemberships = pgTable(
    'organization_memberships',
    {
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        organizationId: text('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        role: text('role').notNull().default('member'),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
        primaryKey({ columns: [table.userId, table.organizationId] }),
    ]
);

/**
 * Organization relations
 */
export const organizationsRelations = relations(organizations, ({ many }) => ({
    memberships: many(organizationMemberships),
}));

/**
 * Membership relations
 */
export const organizationMembershipsRelations = relations(
    organizationMemberships,
    ({ one }) => ({
        user: one(users, {
            fields: [organizationMemberships.userId],
            references: [users.id],
        }),
        organization: one(organizations, {
            fields: [organizationMemberships.organizationId],
            references: [organizations.id],
        }),
    })
);

export type OrganizationRecord = typeof organizations.$inferSelect;
export type NewOrganizationRecord = typeof organizations.$inferInsert;
export type OrganizationMembershipRecord = typeof organizationMemberships.$inferSelect;
export type NewOrganizationMembershipRecord = typeof organizationMemberships.$inferInsert;
