/**
 * Represents the status of a command sent to a device
 */
export const CommandStatus = {
  Pending: "pending",
  Sent: "sent",
  Acknowledged: "acknowledged",
  Completed: "completed",
  Failed: "failed",
  Timeout: "timeout",
} as const;

export type CommandStatus = (typeof CommandStatus)[keyof typeof CommandStatus];
