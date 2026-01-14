import { eq, and, desc, getTableColumns } from 'drizzle-orm';
import type { Sensor, CreateSensorInput, UpdateSensorInput, ISensorRepository } from '@moondesk/domain';
import { getDb } from '../client';
import { assets, sensors } from '../schema/index';
import type { SensorType, Parameter, Protocol } from '@moondesk/domain';

/**
 * Sensor repository implementation using Drizzle ORM
 */
export class SensorRepository implements ISensorRepository {
    private db = getDb();
    private fullSensor = { ...getTableColumns(sensors), organizationId: assets.organizationId };

    async getAll(organizationId: string): Promise<Sensor[]> {
        const results = await this.db
            .select(this.fullSensor)
            .from(sensors)
            .innerJoin(assets, eq(sensors.assetId, assets.id))
            .where(eq(assets.organizationId, organizationId))
            .orderBy(desc(sensors.createdAt));

        return results.map(this.mapToSensor);
    }

    async getByAssetId(assetId: number, organizationId: string): Promise<Sensor[]> {
        const results = await this.db
            .select(this.fullSensor)
            .from(sensors)
            .innerJoin(assets, eq(sensors.assetId, assets.id))
            .where(and(eq(sensors.assetId, assetId), eq(assets.organizationId, organizationId)))
            .orderBy(desc(sensors.createdAt));

        return results.map(this.mapToSensor);
    }

    async getById(id: number, organizationId: string): Promise<Sensor | null> {
        const results = await this.db
            .select(this.fullSensor)
            .from(sensors)
            .innerJoin(assets, eq(sensors.assetId, assets.id))
            .where(and(eq(sensors.id, id), eq(assets.organizationId, organizationId)))
            .limit(1);

        return results[0] ? this.mapToSensor(results[0]) : null;
    }

    async getActive(organizationId: string): Promise<Sensor[]> {
        const results = await this.db
            .select(this.fullSensor)
            .from(sensors)
            .innerJoin(assets, eq(sensors.assetId, assets.id))
            .where(and(eq(assets.organizationId, organizationId), eq(sensors.isActive, true)))
            .orderBy(desc(sensors.createdAt));

        return results.map(this.mapToSensor);
    }

    async create(input: CreateSensorInput): Promise<Sensor> {
        const asset = await this.db.query.assets.findFirst({
            where: and(eq(assets.id, input.assetId), eq(assets.organizationId, input.organizationId)),
        });

        if (!asset) {
            throw new Error('Asset not found or does not belong to the organization');
        }

        const results = await this.db
            .insert(sensors)
            .values({
                assetId: input.assetId,
                name: input.name,
                type: input.type,
                parameter: input.parameter,
                unit: input.unit,
                thresholdLow: input.thresholdLow,
                thresholdHigh: input.thresholdHigh,
                minValue: input.minValue,
                maxValue: input.maxValue,
                samplingIntervalMs: input.samplingIntervalMs ?? 1000,
                isActive: true,
                protocol: input.protocol,
                description: input.description,
                metadata: input.metadata ?? {},
            })
            .returning({ id: sensors.id });

        const newSensor = await this.getById(results[0]!.id, input.organizationId);
        return newSensor!;
    }

    async update(id: number, organizationId: string, input: UpdateSensorInput): Promise<Sensor | null> {
        const sensor = await this.getById(id, organizationId);

        if (!sensor) {
            return null;
        }

        await this.db
            .update(sensors)
            .set({
                ...input,
                updatedAt: new Date(),
            })
            .where(eq(sensors.id, id));

        return this.getById(id, organizationId);
    }

    async delete(id: number, organizationId: string): Promise<boolean> {
        const sensor = await this.getById(id, organizationId);

        if (!sensor) {
            return false;
        }

        const result = await this.db.delete(sensors).where(eq(sensors.id, id)).returning({ id: sensors.id });

        return result.length > 0;
    }

    private mapToSensor(
        record: Omit<typeof sensors.$inferSelect, 'organizationId'> & { organizationId: string }
    ): Sensor {
        return {
            id: record.id,
            assetId: record.assetId,
            organizationId: record.organizationId,
            name: record.name,
            type: record.type as SensorType,
            parameter: record.parameter as Parameter,
            unit: record.unit,
            thresholdLow: record.thresholdLow,
            thresholdHigh: record.thresholdHigh,
            minValue: record.minValue,
            maxValue: record.maxValue,
            samplingIntervalMs: record.samplingIntervalMs,
            isActive: record.isActive,
            protocol: record.protocol as Protocol,
            description: record.description,
            metadata: record.metadata ?? {},
        };
    }
}
