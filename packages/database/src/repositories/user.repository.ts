import { eq } from 'drizzle-orm';
import type { User, UpsertUserInput, IUserRepository } from '@moondesk/domain';
import { getDb } from '../client';
import { users } from '../schema/index';

/**
 * User repository implementation using Drizzle ORM
 */
export class UserRepository implements IUserRepository {
    private db = getDb();

    async getById(id: string): Promise<User | null> {
        const results = await this.db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        return results[0] ? this.mapToUser(results[0]) : null;
    }

    async getByEmail(email: string): Promise<User | null> {
        const results = await this.db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        return results[0] ? this.mapToUser(results[0]) : null;
    }

    async upsert(input: UpsertUserInput): Promise<User> {
        const results = await this.db
            .insert(users)
            .values({
                id: input.id,
                email: input.email,
                username: input.username,
                firstName: input.firstName,
                lastName: input.lastName,
                imageUrl: input.imageUrl,
            })
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    email: input.email,
                    username: input.username,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    imageUrl: input.imageUrl,
                    updatedAt: new Date(),
                },
            })
            .returning();

        return this.mapToUser(results[0]!);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db
            .delete(users)
            .where(eq(users.id, id))
            .returning({ id: users.id });

        return result.length > 0;
    }

    private mapToUser(record: typeof users.$inferSelect): User {
        return {
            id: record.id,
            email: record.email,
            username: record.username,
            firstName: record.firstName,
            lastName: record.lastName,
            imageUrl: record.imageUrl,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }
}
