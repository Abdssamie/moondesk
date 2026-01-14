import { createLogger } from "@moondesk/logger";
import { getEnv } from "@moondesk/config";
import {
  connectMqtt,
  subscribeToTopics,
  setMessageHandler,
  disconnectMqtt,
} from "./mqtt-client";
import { handleMessage, refreshAllSensorThresholds } from "./ingestion-handler";
import { connectToApi, disconnectFromApi } from "./api-broadcaster";

const logger = createLogger("mqtt-worker");
const THRESHOLD_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

async function main(): Promise<void> {
  logger.info("Starting MQTT Worker...");

  try {
    getEnv();

    // Connect to API for broadcasting (optional - worker can run without it)
    await connectToApi();

    // Connect to MQTT broker
    await connectMqtt();

    // Set up message handler
    setMessageHandler(handleMessage);

    // Subscribe to all organization sensor topics
    await subscribeToTopics();

    // Periodically refresh sensor thresholds
    await refreshAllSensorThresholds();
    setInterval(refreshAllSensorThresholds, THRESHOLD_REFRESH_INTERVAL_MS);

    logger.info(`✅ MQTT Worker running`);
    logger.info(`📡 Subscribed to sensor topics`);
    logger.info(`🔗 Connected to API for broadcasting`);
  } catch (error) {
    logger.error({ error }, "Failed to start MQTT Worker");
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, "Shutting down MQTT Worker...");

  disconnectFromApi();
  await disconnectMqtt();

  logger.info("MQTT Worker stopped");
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  logger.error({ error }, "Uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled rejection");
  process.exit(1);
});

main();
