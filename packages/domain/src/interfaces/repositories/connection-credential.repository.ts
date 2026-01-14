import type {
  ConnectionCredential,
  CreateCredentialInput,
  UpdateCredentialInput,
} from "../../models/connection-credential";
import type { Protocol } from "../../enums/protocol";

/**
 * Repository interface for ConnectionCredential operations
 */
export interface IConnectionCredentialRepository {
  /**
   * Get all credentials for an organization
   */
  getAll(organizationId: string): Promise<ConnectionCredential[]>;

  /**
   * Get credentials by protocol
   */
  getByProtocol(
    protocol: Protocol,
    organizationId: string,
  ): Promise<ConnectionCredential[]>;

  /**
   * Get a single credential by ID
   */
  getById(
    id: number,
    organizationId: string,
  ): Promise<ConnectionCredential | null>;

  /**
   * Get active credentials
   */
  getActive(organizationId: string): Promise<ConnectionCredential[]>;

  /**
   * Create a new credential
   */
  create(input: CreateCredentialInput): Promise<ConnectionCredential>;

  /**
   * Update an existing credential
   */
  update(
    id: number,
    organizationId: string,
    input: UpdateCredentialInput,
  ): Promise<ConnectionCredential | null>;

  /**
   * Delete a credential
   */
  delete(id: number, organizationId: string): Promise<boolean>;
}
