import { eq, and, desc } from "drizzle-orm";
import type {
  Command,
  CreateCommandInput,
  UpdateCommandStatusInput,
  ICommandRepository,
} from "@moondesk/domain";
import { CommandStatus } from "@moondesk/domain";
import { getDb } from "../client";
import { commands } from "../schema/index";
import type { Protocol } from "@moondesk/domain";

/**
 * Command repository implementation using Drizzle ORM
 */
export class CommandRepository implements ICommandRepository {
  private db = getDb();

  async getAll(organizationId: string, limit = 100): Promise<Command[]> {
    const results = await this.db
      .select()
      .from(commands)
      .where(eq(commands.organizationId, organizationId))
      .orderBy(desc(commands.createdAt))
      .limit(limit);

    return results.map(this.mapToCommand);
  }

  async getBySensorId(
    sensorId: number,
    organizationId: string,
  ): Promise<Command[]> {
    const results = await this.db
      .select()
      .from(commands)
      .where(
        and(
          eq(commands.sensorId, sensorId),
          eq(commands.organizationId, organizationId),
        ),
      )
      .orderBy(desc(commands.createdAt));

    return results.map(this.mapToCommand);
  }

  async getById(id: number, organizationId: string): Promise<Command | null> {
    const results = await this.db
      .select()
      .from(commands)
      .where(
        and(eq(commands.id, id), eq(commands.organizationId, organizationId)),
      )
      .limit(1);

    return results[0] ? this.mapToCommand(results[0]) : null;
  }

  async getPending(organizationId: string): Promise<Command[]> {
    const results = await this.db
      .select()
      .from(commands)
      .where(
        and(
          eq(commands.organizationId, organizationId),
          eq(commands.status, CommandStatus.Pending),
        ),
      )
      .orderBy(desc(commands.createdAt));

    return results.map(this.mapToCommand);
  }

  async create(input: CreateCommandInput): Promise<Command> {
    const results = await this.db
      .insert(commands)
      .values({
        sensorId: input.sensorId,
        organizationId: input.organizationId,
        userId: input.userId,
        action: input.action,
        parameters: input.parameters ?? {},
        status: CommandStatus.Pending,
        protocol: input.protocol,
        metadata: input.metadata ?? {},
      })
      .returning();

    return this.mapToCommand(results[0]!);
  }

  async updateStatus(
    id: number,
    organizationId: string,
    input: UpdateCommandStatusInput,
  ): Promise<Command | null> {
    const updateData: Record<string, unknown> = {
      status: input.status,
    };

    if (input.status === CommandStatus.Sent) {
      updateData["sentAt"] = new Date();
    } else if (
      input.status === CommandStatus.Completed ||
      input.status === CommandStatus.Failed
    ) {
      updateData["completedAt"] = new Date();
      if (input.errorMessage) {
        updateData["errorMessage"] = input.errorMessage;
      }
    }

    const results = await this.db
      .update(commands)
      .set(updateData)
      .where(
        and(eq(commands.id, id), eq(commands.organizationId, organizationId)),
      )
      .returning();

    return results[0] ? this.mapToCommand(results[0]) : null;
  }

  private mapToCommand(record: typeof commands.$inferSelect): Command {
    return {
      id: record.id,
      sensorId: record.sensorId,
      organizationId: record.organizationId,
      userId: record.userId,
      action: record.action,
      parameters: (record.parameters as Record<string, unknown>) ?? {},
      status: record.status as import("@moondesk/domain").CommandStatus,
      protocol: record.protocol as Protocol,
      createdAt: record.createdAt,
      sentAt: record.sentAt,
      completedAt: record.completedAt,
      errorMessage: record.errorMessage,
      metadata: record.metadata ?? {},
    };
  }
}
