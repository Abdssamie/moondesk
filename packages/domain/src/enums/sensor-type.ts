/**
 * Represents the type of sensor
 */
export const SensorType = {
    // Chemical sensors
    pH: 'ph',
    FreeChlorine: 'free_chlorine',
    TotalChlorine: 'total_chlorine',
    Fluoride: 'fluoride',
    DissolvedOxygen: 'dissolved_oxygen',

    // Physical sensors
    Turbidity: 'turbidity',
    Temperature: 'temperature',
    Conductivity: 'conductivity',
    TotalDissolvedSolids: 'total_dissolved_solids',

    // Hydraulic sensors
    FlowRate: 'flow_rate',
    Pressure: 'pressure',
    Level: 'level',
    Vibration: 'vibration',

    // Energy sensors
    VoltageMeter: 'voltage_meter',
    CurrentMeter: 'current_meter',
    PowerMeter: 'power_meter',
    EnergyMeter: 'energy_meter',

    // General
    Generic: 'generic',
} as const;

export type SensorType = (typeof SensorType)[keyof typeof SensorType];
