import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { createLogger } from "@moondesk/logger";
import { getEnv } from "@moondesk/config";

const logger = createLogger("simulator-mqtt");

export class MqttPublisher {
  private client: MqttClient | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    const env = getEnv();
    const options: IClientOptions = {
      host: env.MQTT_HOST ?? "localhost",
      port: env.MQTT_PORT ?? 1883,
      username: env.MQTT_USERNAME,
      password: env.MQTT_PASSWORD,
      clientId: `simulator-${process.pid}`,
    };

    return new Promise((resolve, reject) => {
      logger.info({ host: options.host }, "Connecting to MQTT broker...");
      this.client = mqtt.connect(options);

      this.client.on("connect", () => {
        logger.info("Connected to MQTT broker");
        this.isConnected = true;
        resolve();
      });

      this.client.on("error", (err) => {
        logger.error({ err }, "MQTT connection error");
        if (!this.isConnected) reject(err);
      });

      this.client.on("close", () => {
        this.isConnected = false;
        logger.warn("MQTT connection closed");
      });
    });
  }

  publish(topic: string, payload: object): void {
    if (!this.client || !this.isConnected) return;

    const message = JSON.stringify(payload);
    this.client.publish(topic, message, { qos: 0 }, (err) => {
      if (err) logger.error({ err, topic }, "Failed to publish message");
    });
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await new Promise<void>((resolve) =>
        this.client!.end(false, {}, () => resolve()),
      );
      this.isConnected = false;
    }
  }
}
