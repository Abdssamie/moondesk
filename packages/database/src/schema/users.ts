import {
    pgTable,
    text,
    timestamp,
    index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizationMemberships } from './organizations';

/**
 * Users table - synced from Clerk
 */
export const users = pgTable(
    'users',
    {
        id: text('id').primaryKey(), // Clerk user ID
        email: text('email').notNull().unique(),
        username: text('username').unique(),
        firstName: text('first_name'),
        lastName: text('last_name'),
        imageUrl: text('image_url'),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
        index('idx_users_email').on(table.email),
    ]
);

/**
 * User relations
 */
export const usersRelations = relations(users, ({ many }) => ({
    memberships: many(organizationMemberships),
}));

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;
