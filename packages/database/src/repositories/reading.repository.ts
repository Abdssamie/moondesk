import { eq, and, desc, sql } from "drizzle-orm";
import type {
  Reading,
  CreateReadingInput,
  ReadingQueryParams,
  AggregatedReading,
} from "@moondesk/domain";
import type { IReadingRepository } from "@moondesk/domain";
import { getDb } from "../client";
import { readings } from "../schema/index";
import {
  Parameter,
  Protocol,
  ReadingQuality,
  ReadingStats,
} from "@moondesk/domain";

/**
 * Reading repository implementation optimized for time-series data
 */
export class ReadingRepository implements IReadingRepository {
  private db = getDb();

  async getRecent(
    organizationId: string,
    sensorId: number,
    limit = 100,
  ): Promise<Reading[]> {
    const results = await this.db
      .select()
      .from(readings)
      .where(
        and(
          eq(readings.organizationId, organizationId),
          eq(readings.sensorId, sensorId),
        ),
      )
      .orderBy(desc(readings.timestamp))
      .limit(limit);

    return results.map(this.mapToReading);
  }

  async query(params: ReadingQueryParams): Promise<Reading[]> {
    // Build dynamic query based on params
    let query = this.db
      .select()
      .from(readings)
      .where(eq(readings.organizationId, params.organizationId))
      .$dynamic();

    // Note: For production, would add more sophisticated filtering
    // This is simplified for initial implementation
    const results = await query
      .orderBy(desc(readings.timestamp))
      .limit(params.limit ?? 1000);

    return results.map(this.mapToReading);
  }

  async getAggregated(
    params: ReadingQueryParams,
  ): Promise<AggregatedReading[]> {
    // TimescaleDB time_bucket aggregation would go here
    // For now, return empty array - requires raw SQL for time_bucket
    console.warn(
      "getAggregated requires TimescaleDB time_bucket - not yet implemented",
    );
    return [];
  }

  async getLatestBySensor(
    organizationId: string,
    sensorIds: number[],
  ): Promise<Map<number, Reading>> {
    const result = new Map<number, Reading>();

    // Get latest reading for each sensor
    // This could be optimized with a window function in production
    for (const sensorId of sensorIds) {
      const latest = await this.db
        .select()
        .from(readings)
        .where(
          and(
            eq(readings.organizationId, organizationId),
            eq(readings.sensorId, sensorId),
          ),
        )
        .orderBy(desc(readings.timestamp))
        .limit(1);

      if (latest[0]) {
        result.set(sensorId, this.mapToReading(latest[0]));
      }
    }

    return result;
  }

  async bulkInsert(inputs: CreateReadingInput[]): Promise<void> {
    if (inputs.length === 0) return;

    const values = inputs.map((input) => ({
      sensorId: input.sensorId,
      organizationId: input.organizationId,
      timestamp: input.timestamp ?? new Date(),
      value: input.value,
      parameter: input.parameter ?? Parameter.None,
      protocol: input.protocol ?? Protocol.Mqtt,
      quality: input.quality ?? ReadingQuality.Good,
      notes: input.notes,
      metadata: input.metadata ?? {},
    }));

    await this.db.insert(readings).values(values);
  }

  async insert(input: CreateReadingInput): Promise<Reading> {
    const results = await this.db
      .insert(readings)
      .values({
        sensorId: input.sensorId,
        organizationId: input.organizationId,
        timestamp: input.timestamp ?? new Date(),
        value: input.value,
        parameter: input.parameter ?? Parameter.None,
        protocol: input.protocol ?? Protocol.Mqtt,
        quality: input.quality ?? ReadingQuality.Good,
        notes: input.notes,
        metadata: input.metadata ?? {},
      })
      .returning();

    return this.mapToReading(results[0]!);
  }

  private mapToReading(record: typeof readings.$inferSelect): Reading {
    return {
      sensorId: record.sensorId,
      organizationId: record.organizationId,
      timestamp: record.timestamp,
      value: record.value,
      parameter: record.parameter as import("@moondesk/domain").Parameter,
      protocol: record.protocol as import("@moondesk/domain").Protocol,
      quality: record.quality as import("@moondesk/domain").ReadingQuality,
      notes: record.notes,
      metadata: record.metadata ?? {},
    };
  }

  async getStats(organizationId: string): Promise<ReadingStats> {
    // Query 1: Total count
    // Note: Using Drizzle's `sql` operator for raw queries
    const totalResult = await this.db.execute(
      sql`SELECT count(*) as count FROM ${readings} WHERE ${readings.organizationId} = ${organizationId}`,
    );
    const total = Number(totalResult.rows[0]?.count || 0);

    // Query 2: Daily trend for last 7 days
    // Using TimescaleDB time_bucket
    const trendResult = this.db.execute(
      sql`
                SELECT time_bucket('1 day', ${readings.timestamp}) AS bucket, count(*) 
                FROM ${readings} 
                WHERE ${readings.organizationId} = ${organizationId} 
                AND ${readings.timestamp} > NOW() - INTERVAL '7 days' 
                GROUP BY bucket 
                ORDER BY bucket ASC
            `,
    );

    const trends = (await trendResult).rows.map((row: any) => ({
      bucket: new Date(row.bucket).toISOString(),
      count: Number(row.count),
    }));

    // Calculate dailyTrend
    let dailyTrend = 0;
    if (trends.length >= 2) {
      const last = trends[trends.length - 1]!.count;
      const prev = trends[trends.length - 2]!.count;
      if (prev > 0) {
        dailyTrend = Math.round(((last - prev) / prev) * 100);
      } else if (last > 0) {
        dailyTrend = 100;
      }
    }

    // Query 3: Quality Score (percentage of 'good' readings)
    const qualityResult = await this.db.execute(
      sql`SELECT count(*) as count FROM ${readings} WHERE ${readings.organizationId} = ${organizationId} AND ${readings.quality} = 'good'`,
    );
    const goodCount = Number(qualityResult.rows[0]?.count || 0);
    const qualityScore =
      total > 0 ? Math.round((goodCount / total) * 100) : 100;

    return { total, dailyTrend, qualityScore, trends };
  }
}
