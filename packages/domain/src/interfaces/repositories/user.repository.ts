import type { User, UpsertUserInput } from '../../models/user';

/**
 * Repository interface for User operations
 */
export interface IUserRepository {
    /**
     * Get a user by ID
     */
    getById(id: string): Promise<User | null>;

    /**
     * Get a user by email
     */
    getByEmail(email: string): Promise<User | null>;

    /**
     * Upsert a user (from Clerk webhook)
     */
    upsert(input: UpsertUserInput): Promise<User>;

    /**
     * Delete a user
     */
    delete(id: string): Promise<boolean>;
}
