import type { SensorType } from '../enums/sensor-type';
import type { Parameter } from '../enums/parameter';
import type { Protocol } from '../enums/protocol';
import type { Asset } from './asset';
import type { Reading } from './reading';
import type { Alert } from './alert';
import type { Command } from './command';

/**
 * Represents a sensor attached to an asset
 */
export interface Sensor {
    id: number;
    assetId: number;
    organizationId: string;
    name: string;
    type: SensorType;
    parameter: Parameter;
    unit: string; // e.g., "°C", "PSI", "Hz", "L/min"
    thresholdLow: number | null;
    thresholdHigh: number | null;
    minValue: number | null;
    maxValue: number | null;
    samplingIntervalMs: number; // Default 1000 (1 second)
    isActive: boolean;
    protocol: Protocol;
    description: string | null;
    metadata: Record<string, string>;

    // Navigation properties
    asset?: Asset;
    readings?: Reading[];
    alerts?: Alert[];
    commands?: Command[];
}

/**
 * Input type for creating a new sensor
 */
export interface CreateSensorInput {
    assetId: number;
    organizationId: string;
    name: string;
    type: SensorType;
    parameter: Parameter;
    unit: string;
    thresholdLow?: number | null;
    thresholdHigh?: number | null;
    minValue?: number | null;
    maxValue?: number | null;
    samplingIntervalMs?: number;
    isActive?: boolean;
    protocol: Protocol;
    description?: string | null;
    metadata?: Record<string, string>;
}

/**
 * Input type for updating an existing sensor
 */
export interface UpdateSensorInput {
    name?: string;
    type?: SensorType;
    parameter?: Parameter;
    unit?: string;
    thresholdLow?: number | null;
    thresholdHigh?: number | null;
    minValue?: number | null;
    maxValue?: number | null;
    samplingIntervalMs?: number;
    isActive?: boolean;
    protocol?: Protocol;
    description?: string | null;
    metadata?: Record<string, string>;
}
