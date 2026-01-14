import type { Protocol } from '../enums/protocol';

/**
 * Represents connection credentials for external services (MQTT brokers, etc.)
 */
export interface ConnectionCredential {
    id: number;
    organizationId: string;
    name: string;
    protocol: Protocol;
    endpointUri: string;
    username: string;
    encryptedPassword: string;
    encryptionIV: string;
    clientId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, string>;
}

/**
 * Input type for creating connection credentials
 */
export interface CreateCredentialInput {
    organizationId: string;
    name: string;
    protocol: Protocol;
    endpointUri: string;
    username: string;
    password: string; // Plain text, will be encrypted
    clientId?: string | null;
    metadata?: Record<string, string>;
}

/**
 * Input type for updating connection credentials
 */
export interface UpdateCredentialInput {
    name?: string;
    endpointUri?: string;
    username?: string;
    password?: string; // Plain text, will be encrypted
    clientId?: string | null;
    isActive?: boolean;
    metadata?: Record<string, string>;
}
