import { z } from "zod";

/**
 * Schema for time series data points used in Tremor charts
 * Validates that each point has a date field and dynamic numeric/string values
 */
export const timeSeriesPointSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  })
  .catchall(z.union([z.string(), z.number()]));

/**
 * Schema for an array of time series points
 */
export const timeSeriesSchema = z.array(timeSeriesPointSchema);

/**
 * Schema for metric trend data used in dashboard metric cards
 */
export const metricTrendSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.union([z.string(), z.number()]),
  noTrendData: z.boolean().optional(),
  trend: z.number().optional(),
  label: z.string().min(1, "Label is required"),
  status: z.enum(["up", "down", "neutral"]),
  description: z.string().min(1, "Description is required"),
  icon: z
    .enum(["trending-up", "trending-down", "users", "activity", "alert-circle"])
    .optional(),
});

/**
 * Schema for an array of metric trends
 */
export const metricTrendsSchema = z.array(metricTrendSchema);

/**
 * Schema for pie/donut chart data
 */
export const pieChartDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.number().nonnegative("Value must be non-negative"),
  fill: z.string().min(1, "Fill color is required"),
});

/**
 * Schema for an array of pie chart data points
 */
export const pieChartDataArraySchema = z.array(pieChartDataSchema);

/**
 * Schema for asset table row data
 */
export const assetTableRowSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  status: z.string().min(1, "Status is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  lastReading: z.string(),
  lastSeen: z.string(),
  activeAlerts: z.number().nonnegative("Active alerts must be non-negative"),
});

/**
 * Schema for an array of asset table rows
 */
export const assetTableRowsSchema = z.array(assetTableRowSchema);

/**
 * Generic chart data validation error
 */
export class ChartDataValidationError extends Error {
  constructor(
    message: string,
    public readonly zodError?: z.ZodError,
  ) {
    super(message);
    this.name = "ChartDataValidationError";
  }
}

/**
 * Validates chart data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated and typed data
 * @throws {ChartDataValidationError} If validation fails
 */
export const validateChartData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = `Chart data validation failed: ${error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ")}`;
      throw new ChartDataValidationError(errorMessage, error);
    }
    throw new ChartDataValidationError("Chart data validation failed with unknown error");
  }
};

/**
 * Safely validates chart data and returns a result object
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns An object with success status and either data or error
 */
export const safeValidateChartData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: ChartDataValidationError } => {
  try {
    const validatedData = validateChartData(schema, data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ChartDataValidationError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new ChartDataValidationError("Chart data validation failed with unknown error"),
    };
  }
};
