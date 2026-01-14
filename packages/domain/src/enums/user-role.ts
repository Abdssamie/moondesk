/**
 * Represents the role of a user within an organization
 */
export const UserRole = {
    Admin: 'admin',
    Member: 'member',
    Viewer: 'viewer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
