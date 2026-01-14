import { eq, and, desc } from 'drizzle-orm';
import type {
    ConnectionCredential,
    UpdateCredentialInput,
    IConnectionCredentialRepository
} from '@moondesk/domain';
import type { Protocol } from '@moondesk/domain';
import { getDb } from '../client';
import { connectionCredentials } from '../schema/index';

/**
 * Internal create input type with already-encrypted password
 * The encryption is handled by the service layer before calling the repository
 */
export interface CreateCredentialDbInput {
    organizationId: string;
    name: string;
    protocol: Protocol;
    endpointUri: string;
    username: string;
    encryptedPassword: string;
    encryptionIV: string;
    clientId?: string | null;
    metadata?: Record<string, string>;
}

/**
 * Internal update input type with optional encrypted password
 */
export interface UpdateCredentialDbInput {
    name?: string;
    endpointUri?: string;
    username?: string;
    encryptedPassword?: string;
    encryptionIV?: string;
    clientId?: string | null;
    isActive?: boolean;
    metadata?: Record<string, string>;
}

/**
 * ConnectionCredential repository implementation using Drizzle ORM
 * Note: This repository expects already-encrypted password data.
 * Use the CredentialService to handle encryption before calling create/update.
 */
export class ConnectionCredentialRepository implements Omit<IConnectionCredentialRepository, 'create' | 'update'> {
    private db = getDb();

    async getAll(organizationId: string): Promise<ConnectionCredential[]> {
        const results = await this.db
            .select()
            .from(connectionCredentials)
            .where(eq(connectionCredentials.organizationId, organizationId))
            .orderBy(desc(connectionCredentials.createdAt));

        return results.map(this.mapToCredential);
    }

    async getByProtocol(protocol: Protocol, organizationId: string): Promise<ConnectionCredential[]> {
        const results = await this.db
            .select()
            .from(connectionCredentials)
            .where(
                and(
                    eq(connectionCredentials.organizationId, organizationId),
                    eq(connectionCredentials.protocol, protocol)
                )
            )
            .orderBy(desc(connectionCredentials.createdAt));

        return results.map(this.mapToCredential);
    }

    async getById(id: number, organizationId: string): Promise<ConnectionCredential | null> {
        const results = await this.db
            .select()
            .from(connectionCredentials)
            .where(
                and(
                    eq(connectionCredentials.id, id),
                    eq(connectionCredentials.organizationId, organizationId)
                )
            )
            .limit(1);

        return results[0] ? this.mapToCredential(results[0]) : null;
    }

    async getActive(organizationId: string): Promise<ConnectionCredential[]> {
        const results = await this.db
            .select()
            .from(connectionCredentials)
            .where(
                and(
                    eq(connectionCredentials.organizationId, organizationId),
                    eq(connectionCredentials.isActive, true)
                )
            )
            .orderBy(desc(connectionCredentials.createdAt));

        return results.map(this.mapToCredential);
    }

    async create(input: CreateCredentialDbInput): Promise<ConnectionCredential> {
        const results = await this.db
            .insert(connectionCredentials)
            .values({
                organizationId: input.organizationId,
                name: input.name,
                protocol: input.protocol,
                endpointUri: input.endpointUri,
                username: input.username,
                encryptedPassword: input.encryptedPassword,
                encryptionIV: input.encryptionIV,
                clientId: input.clientId,
                isActive: true,
                metadata: input.metadata ?? {},
            })
            .returning();

        return this.mapToCredential(results[0]!);
    }

    async update(id: number, organizationId: string, input: UpdateCredentialDbInput): Promise<ConnectionCredential | null> {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        if (input.name !== undefined) updateData['name'] = input.name;
        if (input.endpointUri !== undefined) updateData['endpointUri'] = input.endpointUri;
        if (input.username !== undefined) updateData['username'] = input.username;
        if (input.encryptedPassword !== undefined) updateData['encryptedPassword'] = input.encryptedPassword;
        if (input.encryptionIV !== undefined) updateData['encryptionIV'] = input.encryptionIV;
        if (input.clientId !== undefined) updateData['clientId'] = input.clientId;
        if (input.isActive !== undefined) updateData['isActive'] = input.isActive;
        if (input.metadata !== undefined) updateData['metadata'] = input.metadata;

        const results = await this.db
            .update(connectionCredentials)
            .set(updateData)
            .where(
                and(
                    eq(connectionCredentials.id, id),
                    eq(connectionCredentials.organizationId, organizationId)
                )
            )
            .returning();

        return results[0] ? this.mapToCredential(results[0]) : null;
    }

    async delete(id: number, organizationId: string): Promise<boolean> {
        const result = await this.db
            .delete(connectionCredentials)
            .where(
                and(
                    eq(connectionCredentials.id, id),
                    eq(connectionCredentials.organizationId, organizationId)
                )
            )
            .returning({ id: connectionCredentials.id });

        return result.length > 0;
    }

    private mapToCredential(record: typeof connectionCredentials.$inferSelect): ConnectionCredential {
        return {
            id: record.id,
            organizationId: record.organizationId,
            name: record.name,
            protocol: record.protocol as Protocol,
            endpointUri: record.endpointUri,
            username: record.username,
            encryptedPassword: record.encryptedPassword,
            encryptionIV: record.encryptionIV,
            clientId: record.clientId,
            isActive: record.isActive,
            metadata: record.metadata ?? {},
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }
}
