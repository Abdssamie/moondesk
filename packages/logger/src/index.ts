import pino, { type Logger } from "pino";

const isDevelopment = process.env["NODE_ENV"] !== "production";

/**
 * Create a Pino logger instance with appropriate configuration
 */
export function createLogger(name: string): Logger {
  return pino({
    name,
    level: process.env["LOG_LEVEL"] ?? (isDevelopment ? "debug" : "info"),
    transport: isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    base: {
      env: process.env["NODE_ENV"] ?? "development",
    },
  });
}

/**
 * Default application logger
 */
export const logger = createLogger("moondesk");

/**
 * Create a child logger with additional context
 */
export function createChildLogger(
  parent: Logger,
  context: Record<string, unknown>,
): Logger {
  return parent.child(context);
}

// Re-export pino types
export type { Logger } from "pino";
