import type {
  Command,
  CreateCommandInput,
  UpdateCommandStatusInput,
} from "../../models/command";

/**
 * Repository interface for Command operations
 */
export interface ICommandRepository {
  /**
   * Get all commands for an organization
   */
  getAll(organizationId: string, limit?: number): Promise<Command[]>;

  /**
   * Get commands for a specific sensor
   */
  getBySensorId(sensorId: number, organizationId: string): Promise<Command[]>;

  /**
   * Get a single command by ID
   */
  getById(id: number, organizationId: string): Promise<Command | null>;

  /**
   * Get pending commands
   */
  getPending(organizationId: string): Promise<Command[]>;

  /**
   * Create a new command
   */
  create(input: CreateCommandInput): Promise<Command>;

  /**
   * Update command status
   */
  updateStatus(
    id: number,
    organizationId: string,
    input: UpdateCommandStatusInput,
  ): Promise<Command | null>;
}
