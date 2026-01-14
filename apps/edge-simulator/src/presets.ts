import { Parameter } from "@moondesk/domain";

export const EnergyProfiles = {
  GridVoltage: {
    waveform: "sine",
    min: 228,
    max: 232,
    frequency: 50, // 50 Hz mains
    noise: 0.1,
    parameter: Parameter.Voltage,
  },
  MotorCurrent: {
    waveform: "random", // Fluctuating load
    min: 5,
    max: 15,
    frequency: 1, // variation speed check
    noise: 0.5,
    parameter: Parameter.Current,
  },
  ActivePower: {
    waveform: "square", // Different operating modes
    min: 2000,
    max: 3500,
    frequency: 0.05, // changes every 20 seconds
    noise: 50,
    parameter: Parameter.Power,
  },
  EnergyConsumption: {
    waveform: "linear",
    min: 1000, // Starting kWh Reading
    max: 0.5, // 0.5 kWh per second? value increase rate.
    frequency: 0,
    noise: 0,
    parameter: Parameter.Energy,
  },
};

export const ProcessProfiles = {
  TankLevel: {
    waveform: "triangle", // Filling and emptying
    min: 10,
    max: 90,
    frequency: 0.005, // Slow cycle
    noise: 0.2,
    parameter: Parameter.Level,
  },
  PipePressure: {
    waveform: "constant",
    min: 4.8,
    max: 5.2,
    frequency: 0,
    offset: 5.0, // Target pressure
    noise: 0.1,
    parameter: Parameter.Pressure,
  },
  WaterTemperature: {
    waveform: "sine", // Daily cycle
    min: 15,
    max: 25,
    frequency: 0.00001157, // One cycle per day (rough)
    noise: 0.05,
    parameter: Parameter.Temperature,
  },
  PipeFlow: {
    waveform: "sine",
    min: 50,
    max: 150,
    frequency: 0.1,
    noise: 2,
    parameter: Parameter.Flow,
  },
};
