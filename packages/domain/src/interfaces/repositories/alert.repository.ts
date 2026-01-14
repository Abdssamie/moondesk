import type {
  Alert,
  CreateAlertInput,
  AcknowledgeAlertInput,
  AlertQueryParams,
  AlertStats,
} from "../../models/alert";

/**
 * Repository interface for Alert operations
 */
export interface IAlertRepository {
  /**
   * Get all alerts for an organization
   */
  getAll(organizationId: string, limit?: number): Promise<Alert[]>;

  /**
   * Get alert statistics for an organization
   */
  getStats(organizationId: string): Promise<AlertStats>;

  /**
   * Query alerts with filters
   */
  query(params: AlertQueryParams): Promise<Alert[]>;

  /**
   * Get a single alert by ID
   */
  getById(id: number, organizationId: string): Promise<Alert | null>;

  /**
   * Get unacknowledged alerts
   */
  getUnacknowledged(organizationId: string): Promise<Alert[]>;

  /**
   * Create a new alert
   */
  create(input: CreateAlertInput): Promise<Alert>;

  /**
   * Acknowledge an alert
   */
  acknowledge(
    id: number,
    organizationId: string,
    input: AcknowledgeAlertInput,
  ): Promise<Alert | null>;
}
