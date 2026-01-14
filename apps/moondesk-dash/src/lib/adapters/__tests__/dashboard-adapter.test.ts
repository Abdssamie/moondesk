import {
  Asset,
  Alert,
  ReadingStats,
  AssetStatus,
  SensorType,
  Parameter,
  Protocol,
  AlertSeverity,
} from "@moondesk/domain";
import { describe, it, expect } from "vitest";

import { adaptToMetricTrends } from "../dashboard-adapter";

describe("dashboard-adapter", () => {
  it("should adapt ReadingStats to MetricTrend", () => {
    const assets: Asset[] = [];
    const alerts: Alert[] = [];
    const readingStats: ReadingStats = {
      total: 1234567,
      dailyTrend: 0,
      qualityScore: 0,
      trends: [
        { bucket: "2023-01-01", count: 100 },
        { bucket: "2023-01-02", count: 5000 }, // Last bucket
      ],
    };

    const trends = adaptToMetricTrends(assets, readingStats, undefined);

    const readingsCard = trends.find((t) => t.title === "Total Readings");
    expect(readingsCard).toBeDefined();
    expect(readingsCard?.value).toBe("1,234,567");
    expect(readingsCard?.trend).toBe(5000); // Last bucket count
    expect(readingsCard?.status).toBe("up");
  });

  it("should handle undefined stats gracefully", () => {
    const trends = adaptToMetricTrends([], undefined, undefined);
    const readingsCard = trends.find((t) => t.title === "Total Readings");
    expect(readingsCard?.value).toBe("0");
    expect(readingsCard?.trend).toBe(0);
  });
});
