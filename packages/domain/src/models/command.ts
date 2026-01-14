import type { CommandStatus } from "../enums/command-status";
import type { Protocol } from "../enums/protocol";
import type { Sensor } from "./sensor";

/**
 * Represents a command sent to a device/sensor
 */
export interface Command {
  id: number;
  sensorId: number;
  organizationId: string;
  userId: string;
  action: string; // e.g., "TURN_ON", "TURN_OFF", "SET_INTERVAL", "CALIBRATE"
  parameters: Record<string, unknown>;
  status: CommandStatus;
  protocol: Protocol;
  createdAt: Date;
  sentAt: Date | null;
  completedAt: Date | null;
  errorMessage: string | null;
  metadata: Record<string, string>;

  // Navigation property
  sensor?: Sensor;
}

/**
 * Input type for creating a new command
 */
export interface CreateCommandInput {
  sensorId: number;
  organizationId: string;
  userId: string;
  action: string;
  parameters?: Record<string, unknown>;
  protocol?: Protocol;
  metadata?: Record<string, string>;
}

/**
 * Input type for updating command status
 */
export interface UpdateCommandStatusInput {
  status: CommandStatus;
  errorMessage?: string | null;
}
