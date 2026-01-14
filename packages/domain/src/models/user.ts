import type { OrganizationMembership } from "./organization";

/**
 * Represents a user in the system (synced from Clerk)
 */
export interface User {
  id: string; // Clerk user ID
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Navigation property
  memberships?: OrganizationMembership[];
}

/**
 * Input type for creating/updating a user (from Clerk webhook)
 */
export interface UpsertUserInput {
  id: string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}
