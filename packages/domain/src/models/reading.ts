import type { Parameter } from '../enums/parameter';
import type { Protocol } from '../enums/protocol';
import type { ReadingQuality } from '../enums/reading-quality';
import type { Sensor } from './sensor';

/**
 * Represents a single time-series reading from a sensor
 */
export interface Reading {
    sensorId: number;
    organizationId: string;
    timestamp: Date;
    value: number;
    parameter: Parameter;
    protocol: Protocol;
    quality: ReadingQuality;
    notes: string | null;
    metadata: Record<string, string>;

    // Navigation property
    sensor?: Sensor;
}

/**
 * Input type for creating a new reading (from MQTT ingestion)
 */
export interface CreateReadingInput {
    sensorId: number;
    organizationId: string;
    timestamp?: Date;
    value: number;
    parameter: Parameter;
    protocol: Protocol;
    quality?: ReadingQuality;
    notes?: string | null;
    metadata?: Record<string, string>;
}

/**
 * Query parameters for fetching readings
 */
export interface ReadingQueryParams {
    sensorId?: number;
    organizationId: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
    aggregation?: 'raw' | 'avg' | 'min' | 'max' | 'count';
    bucketInterval?: string; // e.g., '1 hour', '1 day'
}

/**
 * Aggregated reading result
 */
export interface AggregatedReading {
    bucket: Date;
    sensorId: number;
    avg: number | null;
    min: number | null;
    max: number | null;
    count: number;
}

/**
 * Readings statistics
 */
export interface ReadingStats {
    total: number;
    dailyTrend: number; // Percentage change vs yesterday
    qualityScore: number; // Percentage of 'good' readings (0-100)
    trends: {
        bucket: string;
        count: number;
    }[];
}
