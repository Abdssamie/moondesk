import { AlertStats, Asset, AssetStatus, Reading, ReadingStats } from "@moondesk/domain";

// --- Frontend View Models ---

export interface MetricTrend {
  title: string;
  value: string | number;
  noTrendData?: boolean;
  trend?: number;
  label: string;
  status: "up" | "down" | "neutral";
  description: string;
  icon?: "trending-up" | "trending-down" | "users" | "activity" | "alert-circle";
}

export interface TimeSeriesPoint {
  date: string;
  [key: string]: number | string; // e.g., "temperature": 24.5
}

export interface AssetTableRow {
  id: string;
  name: string;
  status: string; // AssetStatus enum string
  type: string;
  location: string;
  lastReading: string;
  lastSeen: string;
  activeAlerts: number;
}

export interface PieChartData {
  name: string;
  value: number;
  fill: string;
}

// --- Adapter Functions ---

function getOnlineStatus(assets: Asset[]): MetricTrend {
  const totalAssets = assets.length;
  const onlineAssets = assets.filter((a) => a.status === AssetStatus.Online).length;

  if (totalAssets > 0) {
    return {
      title: "Online Status",
      value: `${onlineAssets}/${totalAssets}`,
      noTrendData: true,
      label: onlineAssets < totalAssets ? "All assets online" : "Some assets need attention",
      status: "neutral",
      description:
        onlineAssets < totalAssets
          ? "All assets are online and operational"
          : "Configure connections in the assets page",
      icon: "activity",
    };
  }

  return {
    title: "Online Status",
    value: "0/0",
    noTrendData: true,
    label: "No assets found",
    status: "neutral",
    description: "Please configure assets",
    icon: "activity",
  };
}

function getActiveAlertsStatus(stats: AlertStats): MetricTrend {
  const activeAlerts = stats.byStatus.unacknowledged;
  const alertTrendValue = stats.trends.weekly;

  let label: string;
  let description: string;

  if (stats.total > 0) {
    label = "vs last week";
    description = activeAlerts > 0 ? "Requires attention" : "No active alerts";
  } else {
    label = "No alert history";
    description = "System is running smoothly";
  }

  return {
    title: "Active Alerts",
    value: activeAlerts,
    trend: alertTrendValue,
    label,
    status: alertTrendValue > 0 ? "up" : alertTrendValue < 0 ? "down" : "neutral",
    description,
    icon: "alert-circle",
  };
}

function getReadingsStatus(stats: ReadingStats): MetricTrend {
  const readingsCount = stats.total;
  const readingsTrendValue = stats.dailyTrend;

  let label: string;
  let description: string;

  if (readingsCount > 0) {
    label = "vs yesterday";
    description = "Total data points collected";
  } else {
    label = "No data";
    description = "No readings recorded yet";
  }

  return {
    title: "Total Readings",
    value: readingsCount.toLocaleString(),
    trend: readingsTrendValue,
    noTrendData: false,
    label,
    status: readingsTrendValue > 0 ? "up" : readingsTrendValue < 0 ? "down" : "neutral",
    description,
    icon: "activity",
  };
}

function getSignalQualityStatus(stats: ReadingStats): MetricTrend {
  const readingsCount = stats.total;

  let value: string;
  let label: string;
  let description: string;

  if (readingsCount > 0) {
    value = `${stats.qualityScore}%`;
    label = "Good readings";
    description = "Overall data reliability";
  } else {
    value = "N/A";
    label = "No data";
    description = "No readings to analyze";
  }

  return {
    title: "Signal Quality",
    value,
    noTrendData: true,
    trend: 0,
    label,
    status: "neutral",
    description,
    icon: "activity",
  };
}

/**
 * Adapts Asset and Alert data into MetricTrends for SectionCards
 */
export function adaptToMetricTrends(
  assets: Asset[] | undefined,
  readingStats: ReadingStats | undefined,
  alertStats: AlertStats | undefined,
): MetricTrend[] {
  const safeAssets = assets ?? [];
  const safeReadingStats = readingStats ?? { total: 0, dailyTrend: 0, qualityScore: 0, trends: [] };
  const safeAlertStats = alertStats ?? {
    byStatus: { unacknowledged: 0, acknowledged: 0 },
    bySeverity: { info: 0, warning: 0, critical: 0, emergency: 0 },
    trends: { daily: 0, weekly: 0, critical: 0 },
    recentTrend: [],
    total: 0,
  };

  return [
    getOnlineStatus(safeAssets),
    getActiveAlertsStatus(safeAlertStats),
    getReadingsStatus(safeReadingStats),
    getSignalQualityStatus(safeReadingStats),
  ];
}

/**
 * Adapts raw Readings into TimeSeriesPoints for ChartAreaInteractive
 */
export function adaptReadingsToTimeSeries(readings: Reading[]): TimeSeriesPoint[] {
  const grouped = new Map<string, { sum: number; count: number }>();

  readings.forEach((reading) => {
    const date = new Date(reading.timestamp).toISOString().split("T")[0];
    const current = grouped.get(date) ?? { sum: 0, count: 0 };
    current.sum += reading.value;
    current.count += 1;
    grouped.set(date, current);
  });

  return Array.from(grouped.entries())
    .map(([date, { sum, count }]) => ({
      date,
      desktop: Math.round(sum / count),
      mobile: Math.round((sum / count) * 0.8),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Adapts Assets into AssetTableRows for DataTable
 */
export function adaptAssetsToTableRows(assets: Asset[]): AssetTableRow[] {
  return assets.map((asset) => ({
    id: asset.id.toString(),
    name: asset.name,
    status: asset.status,
    type: asset.type,
    location: asset.location,
    lastReading: "N/A", // Needs sensor join
    lastSeen: asset.lastSeen ? new Date(asset.lastSeen).toLocaleDateString() : "Never",
    activeAlerts: 0, // Needs alert join
  }));
}

/**
 * Adapts Assets to Pie Chart Data (by Type)
 */
export function adaptAssetsToDistribution(assets: Asset[]): PieChartData[] {
  const typeCounts = new Map<string, number>();

  assets.forEach((asset) => {
    const current = typeCounts.get(asset.type) ?? 0;
    typeCounts.set(asset.type, current + 1);
  });

  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  return Array.from(typeCounts.entries()).map(([name, value], index) => ({
    name,
    value,
    fill: colors[index % colors.length],
  }));
}
