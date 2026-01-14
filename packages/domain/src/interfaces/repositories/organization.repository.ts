import type {
    Organization,
    OrganizationMembership,
    UpsertOrganizationInput,
    UpsertMembershipInput,
} from '../../models/organization';

/**
 * Repository interface for Organization operations
 */
export interface IOrganizationRepository {
    /**
     * Get an organization by ID
     */
    getById(id: string): Promise<Organization | null>;

    /**
     * Get all organizations
     */
    getAll(): Promise<Organization[]>;

    /**
     * Upsert an organization (from Clerk webhook)
     */
    upsert(input: UpsertOrganizationInput): Promise<Organization>;

    /**
     * Delete an organization
     */
    delete(id: string): Promise<boolean>;
}

/**
 * Repository interface for OrganizationMembership operations
 */
export interface IOrganizationMembershipRepository {
    /**
     * Get all memberships for a user
     */
    getByUserId(userId: string): Promise<OrganizationMembership[]>;

    /**
     * Get all memberships for an organization
     */
    getByOrganizationId(organizationId: string): Promise<OrganizationMembership[]>;

    /**
     * Check if user is member of organization
     */
    isMember(userId: string, organizationId: string): Promise<boolean>;

    /**
     * Upsert a membership
     */
    upsert(input: UpsertMembershipInput): Promise<OrganizationMembership>;

    /**
     * Delete a membership
     */
    delete(userId: string, organizationId: string): Promise<boolean>;
}
