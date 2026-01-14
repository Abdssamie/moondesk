import type {
  Asset,
  CreateAssetInput,
  UpdateAssetInput,
} from "../../models/asset";

/**
 * Repository interface for Asset operations
 */
export interface IAssetRepository {
  /**
   * Get all assets for an organization
   */
  getAll(organizationId: string): Promise<Asset[]>;

  /**
   * Get a single asset by ID
   */
  getById(id: number, organizationId: string): Promise<Asset | null>;

  /**
   * Get an asset with its sensors
   */
  getByIdWithSensors(id: number, organizationId: string): Promise<Asset | null>;

  /**
   * Create a new asset
   */
  create(input: CreateAssetInput): Promise<Asset>;

  /**
   * Update an existing asset
   */
  update(
    id: number,
    organizationId: string,
    input: UpdateAssetInput,
  ): Promise<Asset | null>;

  /**
   * Delete an asset
   */
  delete(id: number, organizationId: string): Promise<boolean>;

  /**
   * Update the lastSeen timestamp for an asset
   */
  updateLastSeen(id: number, organizationId: string): Promise<void>;
}
