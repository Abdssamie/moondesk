/**
 * Represents the water quality parameter being measured
 */
export const Parameter = {
  None: "none",
  // Chemical parameters
  pH: "ph",
  Chlorine: "chlorine",
  Fluoride: "fluoride",
  DissolvedOxygen: "dissolved_oxygen",

  // Physical parameters
  Turbidity: "turbidity",
  Temperature: "temperature",
  Conductivity: "conductivity",
  TDS: "tds",

  // Hydraulic parameters
  Flow: "flow",
  Pressure: "pressure",
  Level: "level",
  Vibration: "vibration",

  // Energy parameters
  Voltage: "voltage",
  Current: "current",
  Power: "power",
  Energy: "energy",
} as const;

export type Parameter = (typeof Parameter)[keyof typeof Parameter];
