import { eq, and } from "drizzle-orm";
import type {
  Organization,
  OrganizationMembership,
  UpsertOrganizationInput,
  UpsertMembershipInput,
  IOrganizationRepository,
  IOrganizationMembershipRepository,
} from "@moondesk/domain";
import type { UserRole } from "@moondesk/domain";
import { getDb } from "../client";
import { organizations, organizationMemberships } from "../schema/index";

/**
 * Organization repository implementation using Drizzle ORM
 */
export class OrganizationRepository implements IOrganizationRepository {
  private db = getDb();

  async getById(id: string): Promise<Organization | null> {
    const results = await this.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1);

    return results[0] ? this.mapToOrganization(results[0]) : null;
  }

  async getAll(): Promise<Organization[]> {
    const results = await this.db.select().from(organizations);

    return results.map(this.mapToOrganization);
  }

  async upsert(input: UpsertOrganizationInput): Promise<Organization> {
    const results = await this.db
      .insert(organizations)
      .values({
        id: input.id,
        name: input.name,
        slug: input.slug,
        imageUrl: input.imageUrl,
        ownerId: input.ownerId,
      })
      .onConflictDoUpdate({
        target: organizations.id,
        set: {
          name: input.name,
          slug: input.slug,
          imageUrl: input.imageUrl,
          ownerId: input.ownerId,
          updatedAt: new Date(),
        },
      })
      .returning();

    return this.mapToOrganization(results[0]!);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(organizations)
      .where(eq(organizations.id, id))
      .returning({ id: organizations.id });

    return result.length > 0;
  }

  private mapToOrganization(
    record: typeof organizations.$inferSelect,
  ): Organization {
    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      imageUrl: record.imageUrl,
      ownerId: record.ownerId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}

/**
 * OrganizationMembership repository implementation using Drizzle ORM
 */
export class OrganizationMembershipRepository implements IOrganizationMembershipRepository {
  private db = getDb();

  async getByUserId(userId: string): Promise<OrganizationMembership[]> {
    const results = await this.db
      .select()
      .from(organizationMemberships)
      .where(eq(organizationMemberships.userId, userId));

    return results.map(this.mapToMembership);
  }

  async getByOrganizationId(
    organizationId: string,
  ): Promise<OrganizationMembership[]> {
    const results = await this.db
      .select()
      .from(organizationMemberships)
      .where(eq(organizationMemberships.organizationId, organizationId));

    return results.map(this.mapToMembership);
  }

  async isMember(userId: string, organizationId: string): Promise<boolean> {
    const results = await this.db
      .select()
      .from(organizationMemberships)
      .where(
        and(
          eq(organizationMemberships.userId, userId),
          eq(organizationMemberships.organizationId, organizationId),
        ),
      )
      .limit(1);

    return results.length > 0;
  }

  async getByUserAndOrg(
    userId: string,
    organizationId: string,
  ): Promise<OrganizationMembership | null> {
    const results = await this.db
      .select()
      .from(organizationMemberships)
      .where(
        and(
          eq(organizationMemberships.userId, userId),
          eq(organizationMemberships.organizationId, organizationId),
        ),
      )
      .limit(1);

    return results[0] ? this.mapToMembership(results[0]) : null;
  }

  async upsert(input: UpsertMembershipInput): Promise<OrganizationMembership> {
    const results = await this.db
      .insert(organizationMemberships)
      .values({
        userId: input.userId,
        organizationId: input.organizationId,
        role: input.role,
      })
      .onConflictDoUpdate({
        target: [
          organizationMemberships.userId,
          organizationMemberships.organizationId,
        ],
        set: {
          role: input.role,
        },
      })
      .returning();

    return this.mapToMembership(results[0]!);
  }

  async delete(userId: string, organizationId: string): Promise<boolean> {
    const result = await this.db
      .delete(organizationMemberships)
      .where(
        and(
          eq(organizationMemberships.userId, userId),
          eq(organizationMemberships.organizationId, organizationId),
        ),
      )
      .returning({
        userId: organizationMemberships.userId,
      });

    return result.length > 0;
  }

  private mapToMembership(
    record: typeof organizationMemberships.$inferSelect,
  ): OrganizationMembership {
    return {
      userId: record.userId,
      organizationId: record.organizationId,
      role: record.role as UserRole,
      createdAt: record.createdAt,
    };
  }
}
