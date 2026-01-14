export enum AssetStatus {
  Unknown = 0,
  Online = 1,
  Offline = 2,
  Maintenance = 3,
  Error = 4,
}

export enum AlertSeverity {
  Info = 0,
  Warning = 1,
  Critical = 2,
}

export enum Parameter {
  None = 0,
  pH = 1,
  FreeChlorine = 2,
  TotalChlorine = 3,
  Fluoride = 4,
  DissolvedOxygen = 5,
  Turbidity = 10,
  Temperature = 11,
  Conductivity = 12,
  TotalDissolvedSolids = 13,
  FlowRate = 20,
  Pressure = 21,
  Level = 22,
}

export interface Asset {
  id: number;
  organizationId: string;
  name: string;
  type: string;
  location: string;
  status: AssetStatus;
  lastSeen?: string;
  description?: string;
  manufacturer?: string;
  modelNumber?: string;
  sensors: Sensor[];
}

export interface Sensor {
  id: number;
  assetId: number;
  name: string;
  parameter: Parameter;
  unit: string;
  thresholdLow?: number;
  thresholdHigh?: number;
  isActive: boolean;
}

export interface Reading {
  sensorId: number;
  timestamp: string;
  value: number;
  parameter: Parameter;
}

export interface Alert {
  id: number;
  sensorId: number;
  timestamp: string;
  severity: AlertSeverity;
  message: string;
  triggerValue: number;
  acknowledged: boolean;
}

export interface DashboardStats {
  totalAssets: number;
  onlineAssets: number;
  offlineAssets: number;
  activeAlerts: number;
}
