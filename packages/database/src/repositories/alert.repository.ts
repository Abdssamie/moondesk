import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import type {
  Alert,
  CreateAlertInput,
  AcknowledgeAlertInput,
  AlertQueryParams,
  IAlertRepository,
  AlertStats,
} from "@moondesk/domain";
import { getDb } from "../client";
import { alerts } from "../schema/index";
import type { AlertSeverity, Protocol } from "@moondesk/domain";

/**
 * Alert repository implementation using Drizzle ORM
 */
export class AlertRepository implements IAlertRepository {
  private db = getDb();

  async getAll(organizationId: string, limit = 100): Promise<Alert[]> {
    const results = await this.db
      .select()
      .from(alerts)
      .where(eq(alerts.organizationId, organizationId))
      .orderBy(desc(alerts.timestamp))
      .limit(limit);

    return results.map(this.mapToAlert);
  }

  async getStats(organizationId: string): Promise<AlertStats> {
    // Total count
    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(alerts)
      .where(eq(alerts.organizationId, organizationId));
    const total = Number(totalResult[0]?.count ?? 0);

    // Group by severity
    const bySeverityResult = await this.db
      .select({
        severity: alerts.severity,
        count: sql<number>`count(*)`,
      })
      .from(alerts)
      .where(eq(alerts.organizationId, organizationId))
      .groupBy(alerts.severity);

    const bySeverity: Record<AlertSeverity, number> = {
      info: 0,
      warning: 0,
      critical: 0,
      emergency: 0,
    };

    bySeverityResult.forEach((row) => {
      if (row.severity) {
        bySeverity[row.severity as AlertSeverity] = Number(row.count);
      }
    });

    // Group by acknowledged
    const byStatusResult = await this.db
      .select({
        acknowledged: alerts.acknowledged,
        count: sql<number>`count(*)`,
      })
      .from(alerts)
      .where(eq(alerts.organizationId, organizationId))
      .groupBy(alerts.acknowledged);

    const byStatus = {
      acknowledged: 0,
      unacknowledged: 0,
    };

    byStatusResult.forEach((row) => {
      if (row.acknowledged) {
        byStatus.acknowledged = Number(row.count);
      } else {
        byStatus.unacknowledged = Number(row.count);
      }
    });

    // Recent trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendResult = await this.db
      .select({
        date: sql<string>`to_char(${alerts.timestamp}, 'YYYY-MM-DD')`,
        severity: alerts.severity,
        count: sql<number>`count(*)`,
      })
      .from(alerts)
      .where(
        and(
          eq(alerts.organizationId, organizationId),
          gte(alerts.timestamp, sevenDaysAgo),
        ),
      )
      .groupBy(sql`to_char(${alerts.timestamp}, 'YYYY-MM-DD')`, alerts.severity)
      .orderBy(sql`to_char(${alerts.timestamp}, 'YYYY-MM-DD')`);

    const recentTrend = trendResult.map((row) => ({
      date: row.date!, // Assuming date is never null due to grouping
      count: Number(row.count),
      severity: row.severity as AlertSeverity,
    }));

    // Calculate trends based on real DB data
    // Group recentTrend by date to get daily totals
    const dailyTotals: Record<string, number> = {};
    const criticalDailyTotals: Record<string, number> = {};

    recentTrend.forEach((item) => {
      dailyTotals[item.date] = (dailyTotals[item.date] || 0) + item.count;
      if (item.severity === "critical" || item.severity === "emergency") {
        criticalDailyTotals[item.date] =
          (criticalDailyTotals[item.date] || 0) + item.count;
      }
    });

    const dates = Object.keys(dailyTotals).sort();
    const lastDate = dates[dates.length - 1]; // Most recent day (today/yesterday)
    const prevDate = dates[dates.length - 2]; // The day before

    // Helper to calculate percentage change
    const calcTrend = (now: number, before: number) => {
      if (before === 0) return now > 0 ? 100 : 0;
      return Math.round(((now - before) / before) * 100);
    };

    const dailyTrend = calcTrend(
      lastDate ? (dailyTotals[lastDate] ?? 0) : 0,
      prevDate ? (dailyTotals[prevDate] ?? 0) : 0,
    );

    const criticalTrend = calcTrend(
      lastDate ? criticalDailyTotals[lastDate] || 0 : 0,
      prevDate ? criticalDailyTotals[prevDate] || 0 : 0,
    );

    // Calculate weekly trend
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentWeekCountResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(alerts)
      .where(
        and(
          eq(alerts.organizationId, organizationId),
          gte(alerts.timestamp, oneWeekAgo),
        ),
      );
    const currentWeekCount = Number(currentWeekCountResult[0]?.count ?? 0);

    const previousWeekCountResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(alerts)
      .where(
        and(
          eq(alerts.organizationId, organizationId),
          gte(alerts.timestamp, twoWeeksAgo),
          lte(alerts.timestamp, oneWeekAgo),
        ),
      );
    const previousWeekCount = Number(previousWeekCountResult[0]?.count ?? 0);

    const weeklyTrend = calcTrend(currentWeekCount, previousWeekCount);

    return {
      total,
      bySeverity,
      byStatus,
      trends: {
        daily: dailyTrend,
        weekly: weeklyTrend,
        critical: criticalTrend,
      },
      recentTrend,
    };
  }

  async query(params: AlertQueryParams): Promise<Alert[]> {
    let query = this.db
      .select()
      .from(alerts)
      .where(eq(alerts.organizationId, params.organizationId))
      .$dynamic();

    if (params.sensorId !== undefined) {
      query = query.where(eq(alerts.sensorId, params.sensorId));
    }
    if (params.severity !== undefined) {
      query = query.where(eq(alerts.severity, params.severity));
    }
    if (params.acknowledged !== undefined) {
      query = query.where(eq(alerts.acknowledged, params.acknowledged));
    }
    if (params.startTime !== undefined) {
      query = query.where(gte(alerts.timestamp, params.startTime));
    }
    if (params.endTime !== undefined) {
      query = query.where(lte(alerts.timestamp, params.endTime));
    }

    const results = await query
      .orderBy(desc(alerts.timestamp))
      .limit(params.limit ?? 100);

    return results.map(this.mapToAlert);
  }

  async getById(id: number, organizationId: string): Promise<Alert | null> {
    const results = await this.db
      .select()
      .from(alerts)
      .where(and(eq(alerts.id, id), eq(alerts.organizationId, organizationId)))
      .limit(1);

    return results[0] ? this.mapToAlert(results[0]) : null;
  }

  async getUnacknowledged(organizationId: string): Promise<Alert[]> {
    const results = await this.db
      .select()
      .from(alerts)
      .where(
        and(
          eq(alerts.organizationId, organizationId),
          eq(alerts.acknowledged, false),
        ),
      )
      .orderBy(desc(alerts.timestamp));

    return results.map(this.mapToAlert);
  }

  async create(input: CreateAlertInput): Promise<Alert> {
    const results = await this.db
      .insert(alerts)
      .values({
        sensorId: input.sensorId,
        organizationId: input.organizationId,
        severity: input.severity,
        message: input.message,
        triggerValue: input.triggerValue,
        thresholdValue: input.thresholdValue,
        protocol: input.protocol,
        metadata: input.metadata ?? {},
      })
      .returning();

    return this.mapToAlert(results[0]!);
  }

  async acknowledge(
    id: number,
    organizationId: string,
    input: AcknowledgeAlertInput,
  ): Promise<Alert | null> {
    const results = await this.db
      .update(alerts)
      .set({
        acknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedBy: input.acknowledgedBy,
        notes: input.notes,
      })
      .where(and(eq(alerts.id, id), eq(alerts.organizationId, organizationId)))
      .returning();

    return results[0] ? this.mapToAlert(results[0]) : null;
  }

  private mapToAlert(record: typeof alerts.$inferSelect): Alert {
    return {
      id: record.id,
      sensorId: record.sensorId,
      organizationId: record.organizationId,
      timestamp: record.timestamp,
      severity: record.severity as AlertSeverity,
      message: record.message,
      triggerValue: record.triggerValue,
      thresholdValue: record.thresholdValue,
      acknowledged: record.acknowledged,
      acknowledgedAt: record.acknowledgedAt,
      acknowledgedBy: record.acknowledgedBy,
      notes: record.notes,
      protocol: record.protocol as Protocol,
      metadata: record.metadata ?? {},
    };
  }
}
