import type {
  Reading,
  CreateReadingInput,
  ReadingQueryParams,
  AggregatedReading,
  ReadingStats,
} from "../../models/reading";

/**
 * Repository interface for Reading operations
 * Optimized for high-volume time-series data
 */
export interface IReadingRepository {
  /**
   * Get recent readings for a sensor
   */
  getRecent(
    organizationId: string,
    sensorId: number,
    limit?: number,
  ): Promise<Reading[]>;

  /**
   * Query readings with filters and optional aggregation
   */
  query(params: ReadingQueryParams): Promise<Reading[]>;

  /**
   * Get aggregated readings (for dashboards)
   */
  getAggregated(params: ReadingQueryParams): Promise<AggregatedReading[]>;

  /**
   * Get the latest reading for each sensor
   */
  getLatestBySensor(
    organizationId: string,
    sensorIds: number[],
  ): Promise<Map<number, Reading>>;

  /**
   * Bulk insert readings (for MQTT ingestion)
   */
  bulkInsert(readings: CreateReadingInput[]): Promise<void>;

  /**
   * Insert a single reading
   */
  insert(reading: CreateReadingInput): Promise<Reading>;

  /**
   * Get reading statistics (total count and trends)
   */
  getStats(organizationId: string): Promise<ReadingStats>;
}
