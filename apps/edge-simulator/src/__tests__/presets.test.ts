import { describe, it, expect } from "vitest";
import { EnergyProfiles, ProcessProfiles } from "../presets";
import { Parameter } from "@moondesk/domain";

describe("Presets", () => {
  it("EnergyProfiles should have valid parameters", () => {
    expect(EnergyProfiles.GridVoltage.parameter).toBe(Parameter.Voltage);
    expect(EnergyProfiles.MotorCurrent.parameter).toBe(Parameter.Current);
    expect(EnergyProfiles.ActivePower.parameter).toBe(Parameter.Power);
    expect(EnergyProfiles.EnergyConsumption.parameter).toBe(Parameter.Energy);
  });

  it("EnergyConsumption should use linear waveform", () => {
    expect(EnergyProfiles.EnergyConsumption.waveform).toBe("linear");
  });

  it("ProcessProfiles should have valid parameters", () => {
    expect(ProcessProfiles.TankLevel.parameter).toBe(Parameter.Level);
    expect(ProcessProfiles.PipePressure.parameter).toBe(Parameter.Pressure);
    expect(ProcessProfiles.WaterTemperature.parameter).toBe(
      Parameter.Temperature,
    );
    expect(ProcessProfiles.PipeFlow.parameter).toBe(Parameter.Flow);
  });

  it("All profiles should have min <= max", () => {
    const allProfiles = { ...EnergyProfiles, ...ProcessProfiles };
    Object.values(allProfiles).forEach((profile) => {
      // For linear, max is slope, so min<=max doesn't strictly apply, but let's check non-linear ones
      if (profile.waveform !== "linear") {
        expect(profile.min).toBeLessThanOrEqual(profile.max);
      }
    });
  });
});
