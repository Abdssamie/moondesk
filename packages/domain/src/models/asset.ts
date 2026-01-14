import type { AssetStatus } from "../enums/asset-status";
import type { Sensor } from "./sensor";

/**
 * Represents an industrial asset (machine, equipment, facility) being monitored
 */
export interface Asset {
  id: number;
  organizationId: string;
  name: string;
  type: string; // e.g., "Pump", "Tank", "Valve", "Compressor"
  location: string;
  status: AssetStatus;
  lastSeen: Date | null;
  description: string | null;
  manufacturer: string | null;
  modelNumber: string | null;
  installationDate: Date | null;
  metadata: Record<string, string>;

  // Navigation property
  sensors?: Sensor[];
}

/**
 * Input type for creating a new asset
 */
export interface CreateAssetInput {
  organizationId: string;
  name: string;
  type: string;
  location?: string;
  status?: AssetStatus;
  description?: string | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  installationDate?: Date | null;
  metadata?: Record<string, string>;
}

/**
 * Input type for updating an existing asset
 */
export interface UpdateAssetInput {
  name?: string;
  type?: string;
  location?: string;
  status?: AssetStatus;
  description?: string | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  installationDate?: Date | null;
  metadata?: Record<string, string>;
}
