import type { AssetStatus } from "@moondesk/domain/enums/asset-status";
import type { AlertSeverity } from "@moondesk/domain/enums/alert-severity";
import type { ReadingQuality } from "@moondesk/domain/enums/reading-quality";

/**
 * Available Tremor colors for charts and components
 */
export type TremorColor =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

/**
 * Color mapping for asset operational status
 * Maps each AssetStatus to an appropriate Tremor color
 */
export const ASSET_STATUS_COLORS: Record<AssetStatus, TremorColor> = {
  online: "green",
  offline: "gray",
  maintenance: "amber",
  error: "red",
  unknown: "slate",
};

/**
 * Color mapping for alert severity levels
 * Maps each AlertSeverity to an appropriate Tremor color
 */
export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, TremorColor> = {
  info: "blue",
  warning: "amber",
  critical: "orange",
  emergency: "red",
};

/**
 * Color mapping for sensor reading quality indicators
 * Maps each ReadingQuality to an appropriate Tremor color
 */
export const READING_QUALITY_COLORS: Record<ReadingQuality, TremorColor> = {
  good: "green",
  uncertain: "amber",
  bad: "red",
  simulated: "violet",
};
