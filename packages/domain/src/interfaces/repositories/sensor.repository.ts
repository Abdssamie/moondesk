import type {
  Sensor,
  CreateSensorInput,
  UpdateSensorInput,
} from "../../models/sensor";

/**
 * Repository interface for Sensor operations
 */
export interface ISensorRepository {
  /**
   * Get all sensors for an organization
   */
  getAll(organizationId: string): Promise<Sensor[]>;

  /**
   * Get all sensors in the system (across all organizations)
   * Used for background workers
   */
  getAllSystemSensors(): Promise<Sensor[]>;

  /**
   * Get all sensors for a specific asset
   */
  getByAssetId(assetId: number, organizationId: string): Promise<Sensor[]>;

  /**
   * Get a single sensor by ID
   */
  getById(id: number, organizationId: string): Promise<Sensor | null>;

  /**
   * Get sensors that are active
   */
  getActive(organizationId: string): Promise<Sensor[]>;

  /**
   * Create a new sensor
   */
  create(input: CreateSensorInput): Promise<Sensor>;

  /**
   * Update an existing sensor
   */
  update(
    id: number,
    organizationId: string,
    input: UpdateSensorInput,
  ): Promise<Sensor | null>;

  /**
   * Delete a sensor
   */
  delete(id: number, organizationId: string): Promise<boolean>;
}
