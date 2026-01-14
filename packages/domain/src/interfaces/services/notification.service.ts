import type { Alert } from "../../models/alert";
import type { Reading } from "../../models/reading";

/**
 * Service interface for sending real-time notifications via WebSocket
 */
export interface INotificationService {
  /**
   * Send a sensor reading update to connected clients
   */
  sendSensorReading(reading: Reading, organizationId: string): Promise<void>;

  /**
   * Send an alert notification to connected clients
   */
  sendAlert(alert: Alert, organizationId: string): Promise<void>;

  /**
   * Send device status change notification
   */
  sendDeviceStatus(
    deviceId: number,
    status: string,
    organizationId: string,
  ): Promise<void>;
}
