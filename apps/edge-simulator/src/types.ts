import { Parameter, SensorType } from "@moondesk/domain";

export type WaveForm =
  | "sine"
  | "cosine"
  | "triangle"
  | "sawtooth"
  | "square"
  | "random"
  | "constant"
  | "linear";

export interface SimulationProfile {
  waveform: WaveForm;
  min: number;
  max: number;
  /** Frequency in Hz (cycles per second) */
  frequency: number;
  /** Noise amplitude (random variation added to value) */
  noise: number;
  /** Offset to shift the wave up/down */
  offset?: number;
  /** Parameter this profile simulates */
  parameter: Parameter;
}

export interface SimulatedSensorConfig {
  id: number;
  organizationId: string;
  type: SensorType;
  profile: SimulationProfile;
  /** Interval in milliseconds between readings */
  intervalMs: number;
  enabled: boolean;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description?: string;
  sensors: SimulatedSensorConfig[];
}
