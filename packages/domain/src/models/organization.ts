import type { UserRole } from "../enums/user-role";
import type { User } from "./user";

/**
 * Represents an organization (synced from Clerk)
 */
export interface Organization {
  id: string; // Clerk organization ID
  name: string;
  slug: string | null;
  imageUrl: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;

  // Navigation property
  memberships?: OrganizationMembership[];
}

/**
 * Represents a user's membership in an organization
 */
export interface OrganizationMembership {
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: Date;

  // Navigation properties
  user?: User;
  organization?: Organization;
}

/**
 * Input type for creating/updating an organization (from Clerk webhook)
 */
export interface UpsertOrganizationInput {
  id: string;
  name: string;
  slug?: string | null;
  imageUrl?: string | null;
  ownerId: string;
}

/**
 * Input type for managing organization membership
 */
export interface UpsertMembershipInput {
  userId: string;
  organizationId: string;
  role: UserRole;
}
