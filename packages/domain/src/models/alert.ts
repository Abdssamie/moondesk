import type { AlertSeverity } from '../enums/alert-severity';
import type { Protocol } from '../enums/protocol';
import type { Sensor } from './sensor';

/**
 * Represents an alert triggered when sensor readings exceed thresholds
 */
export interface Alert {
    id: number;
    sensorId: number;
    organizationId: string;
    timestamp: Date;
    severity: AlertSeverity;
    message: string;
    triggerValue: number;
    thresholdValue: number | null;
    acknowledged: boolean;
    acknowledgedAt: Date | null;
    acknowledgedBy: string | null;
    notes: string | null;
    protocol: Protocol;
    metadata: Record<string, string>;

    // Navigation property
    sensor?: Sensor;
}

/**
 * Input type for creating a new alert
 */
export interface CreateAlertInput {
    sensorId: number;
    organizationId: string;
    severity: AlertSeverity;
    message: string;
    triggerValue: number;
    thresholdValue?: number | null;
    protocol?: Protocol;
    metadata?: Record<string, string>;
}

/**
 * Input type for acknowledging an alert
 */
export interface AcknowledgeAlertInput {
    acknowledgedBy: string;
    notes?: string | null;
}

/**
 * Query parameters for fetching alerts
 */
export interface AlertQueryParams {
    organizationId: string;
    sensorId?: number;
    severity?: AlertSeverity;
    acknowledged?: boolean;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
}

/**
 * Statistics for alerts
 */
export interface AlertStats {
    total: number;
    bySeverity: Record<AlertSeverity, number>;
    byStatus: {
        acknowledged: number;
        unacknowledged: number;
    };
    trends: {
        daily: number; // Percentage change vs yesterday
        weekly: number; // Percentage change vs last week
        critical: number; // Percentage change for critical/emergency vs yesterday
    };
    recentTrend: {
        date: string;
        count: number;
        severity: AlertSeverity;
    }[];
}
