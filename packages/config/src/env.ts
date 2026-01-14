import { z } from "zod";
import "dotenv/config";

/**
 * Environment variable schema with validation
 */
const envSchema = z
  .object({
    // Node environment
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    // Server
    PORT: z.string().transform(Number).default("5008"),
    HOST: z.string().default("0.0.0.0"),

    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // Clerk authentication
    CLERK_SECRET_KEY: z.string().optional(),
    CLERK_PUBLISHABLE_KEY: z.string().optional(),
    CLERK_WEBHOOK_SECRET: z.string().optional(),

    // MQTT
    MQTT_HOST: z.string().optional(),
    MQTT_PORT: z.string().transform(Number).optional(),
    MQTT_USERNAME: z.string().optional(),
    MQTT_PASSWORD: z.string().optional(),

    // Encryption
    ENCRYPTION_KEY: z.string().min(32).optional(),
    INTERNAL_SERVICE_TOKEN: z.string().optional(),

    // Logging
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  })
  .transform((env) => ({
    ...env,
    isProduction: env.NODE_ENV === "production",
  }));

export type Env = z.infer<typeof envSchema>;

let env: Env | null = null;

/**
 * Get validated environment variables
 * @throws Error if validation fails
 */
export function getEnv(): Env {
  if (!env) {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      console.error("❌ Invalid environment variables:");
      console.error(result.error.format());
      throw new Error("Invalid environment variables");
    }

    env = result.data;
  }

  return env;
}
