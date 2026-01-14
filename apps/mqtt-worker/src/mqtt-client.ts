import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { createLogger } from "@moondesk/logger";
import { getEnv } from "@moondesk/config";

const logger = createLogger("mqtt-client");

export type MessageHandler = (topic: string, payload: Buffer) => void;

let client: MqttClient | null = null;
let messageHandler: MessageHandler | null = null;

/**
 * Initialize MQTT client connection
 */
export async function connectMqtt(): Promise<MqttClient> {
  const env = getEnv();

  const options: IClientOptions = {
    host: env.MQTT_HOST ?? "localhost",
    port: env.MQTT_PORT ?? 1883,
    username: env.MQTT_USERNAME,
    password: env.MQTT_PASSWORD,
    clientId: `moondesk-worker-${process.pid}`,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
    clean: true,
  };

  return new Promise((resolve, reject) => {
    logger.info(
      { host: options.host, port: options.port },
      "Connecting to MQTT broker",
    );

    client = mqtt.connect(options);

    client.on("connect", () => {
      logger.info("Connected to MQTT broker");
      resolve(client!);
    });

    client.on("error", (error) => {
      logger.error({ error }, "MQTT connection error");
      reject(error);
    });

    client.on("reconnect", () => {
      logger.info("Reconnecting to MQTT broker");
    });

    client.on("offline", () => {
      logger.warn("MQTT client offline");
    });

    client.on("close", () => {
      logger.info("MQTT connection closed");
    });

    client.on("message", (topic, payload) => {
      if (messageHandler) {
        messageHandler(topic, payload);
      }
    });
  });
}

/**
 * Subscribe to organization topics
 */
export async function subscribeToTopics(
  organizationIds?: string[],
): Promise<void> {
  if (!client) {
    throw new Error("MQTT client not connected");
  }

  // Subscribe to all organizations or specific ones
  const topicPattern = organizationIds
    ? organizationIds.map((id) => `moondesk/${id}/sensors/+/#`)
    : ["moondesk/+/sensors/+/#"];

  for (const topic of topicPattern) {
    await new Promise<void>((resolve, reject) => {
      client!.subscribe(topic, { qos: 1 }, (error) => {
        if (error) {
          logger.error({ error, topic }, "Failed to subscribe to topic");
          reject(error);
        } else {
          logger.info({ topic }, "Subscribed to topic");
          resolve();
        }
      });
    });
  }
}

/**
 * Set the message handler for incoming MQTT messages
 */
export function setMessageHandler(handler: MessageHandler): void {
  messageHandler = handler;
}

/**
 * Publish a command to a sensor
 */
export async function publishCommand(
  organizationId: string,
  sensorId: number,
  commandPayload: Record<string, unknown>,
): Promise<void> {
  if (!client) {
    throw new Error("MQTT client not connected");
  }

  const topic = `moondesk/${organizationId}/sensors/${sensorId}/commands`;
  const payload = JSON.stringify(commandPayload);

  await new Promise<void>((resolve, reject) => {
    client!.publish(topic, payload, { qos: 1 }, (error) => {
      if (error) {
        logger.error({ error, topic }, "Failed to publish command");
        reject(error);
      } else {
        logger.debug({ topic, sensorId }, "Published command");
        resolve();
      }
    });
  });
}

/**
 * Disconnect from MQTT broker
 */
export async function disconnectMqtt(): Promise<void> {
  if (client) {
    await new Promise<void>((resolve) => {
      client!.end(false, {}, () => {
        logger.info("Disconnected from MQTT broker");
        resolve();
      });
    });
    client = null;
  }
}

/**
 * Get the MQTT client instance
 */
export function getMqttClient(): MqttClient | null {
  return client;
}
