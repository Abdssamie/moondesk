import { eq, and, desc } from "drizzle-orm";
import type {
  Asset,
  CreateAssetInput,
  UpdateAssetInput,
} from "@moondesk/domain";
import type { IAssetRepository } from "@moondesk/domain";
import { getDb } from "../client";
import { assets, sensors } from "../schema/index";
import { AssetStatus } from "@moondesk/domain";

/**
 * Asset repository implementation using Drizzle ORM
 */
export class AssetRepository implements IAssetRepository {
  private db = getDb();

  async getAll(organizationId: string): Promise<Asset[]> {
    const results = await this.db
      .select()
      .from(assets)
      .where(eq(assets.organizationId, organizationId))
      .orderBy(desc(assets.createdAt));

    return results.map(this.mapToAsset);
  }

  async getById(id: number, organizationId: string): Promise<Asset | null> {
    const results = await this.db
      .select()
      .from(assets)
      .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)))
      .limit(1);

    return results[0] ? this.mapToAsset(results[0]) : null;
  }

  async getByIdWithSensors(
    id: number,
    organizationId: string,
  ): Promise<Asset | null> {
    const asset = await this.getById(id, organizationId);
    if (!asset) return null;

    const sensorResults = await this.db
      .select()
      .from(sensors)
      .where(eq(sensors.assetId, id));

    return {
      ...asset,
      sensors: sensorResults.map((s) => ({
        id: s.id,
        assetId: s.assetId,
        organizationId,
        name: s.name,
        type: s.type as import("@moondesk/domain").SensorType,
        parameter: s.parameter as import("@moondesk/domain").Parameter,
        unit: s.unit,
        thresholdLow: s.thresholdLow,
        thresholdHigh: s.thresholdHigh,
        minValue: s.minValue,
        maxValue: s.maxValue,
        samplingIntervalMs: s.samplingIntervalMs,
        isActive: s.isActive,
        protocol: s.protocol as import("@moondesk/domain").Protocol,
        description: s.description,
        metadata: s.metadata ?? {},
      })),
    };
  }

  async create(input: CreateAssetInput): Promise<Asset> {
    const results = await this.db
      .insert(assets)
      .values({
        organizationId: input.organizationId,
        name: input.name,
        type: input.type,
        location: input.location,
        status: input.status ?? AssetStatus.Unknown,
        description: input.description,
        manufacturer: input.manufacturer,
        modelNumber: input.modelNumber,
        installationDate: input.installationDate,
        metadata: input.metadata ?? {},
      })
      .returning();

    return this.mapToAsset(results[0]!);
  }

  async update(
    id: number,
    organizationId: string,
    input: UpdateAssetInput,
  ): Promise<Asset | null> {
    const results = await this.db
      .update(assets)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)))
      .returning();

    return results[0] ? this.mapToAsset(results[0]) : null;
  }

  async delete(id: number, organizationId: string): Promise<boolean> {
    const result = await this.db
      .delete(assets)
      .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)))
      .returning({ id: assets.id });

    return result.length > 0;
  }

  async updateLastSeen(id: number, organizationId: string): Promise<void> {
    await this.db
      .update(assets)
      .set({
        lastSeen: new Date(),
        status: AssetStatus.Online,
        updatedAt: new Date(),
      })
      .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)));
  }

  private mapToAsset(record: typeof assets.$inferSelect): Asset {
    return {
      id: record.id,
      organizationId: record.organizationId,
      name: record.name,
      type: record.type,
      location: record.location,
      status: record.status as import("@moondesk/domain").AssetStatus,
      lastSeen: record.lastSeen,
      description: record.description,
      manufacturer: record.manufacturer,
      modelNumber: record.modelNumber,
      installationDate: record.installationDate,
      metadata: record.metadata ?? {},
    };
  }
}
