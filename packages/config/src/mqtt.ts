import { getEnv } from "./env";

/**
 * MQTT configuration
 */
export function getMqttConfig() {
  const env = getEnv();

  return {
    host: env.MQTT_HOST ?? "localhost",
    port: env.MQTT_PORT ?? 1883,
    username: env.MQTT_USERNAME,
    password: env.MQTT_PASSWORD,
    clientIdPrefix: "moondesk-",
    topics: {
      telemetry: "+/+/telemetry", // {org_id}/{device_id}/telemetry
      commands: "+/+/cmd", // {org_id}/{device_id}/cmd
    },
  };
}
