import { describe, expect, it } from "vitest";
import {
  assetTableRowSchema,
  assetTableRowsSchema,
  ChartDataValidationError,
  metricTrendSchema,
  metricTrendsSchema,
  pieChartDataArraySchema,
  pieChartDataSchema,
  safeValidateChartData,
  timeSeriesPointSchema,
  timeSeriesSchema,
  validateChartData,
} from "../chart-schemas";

describe("timeSeriesPointSchema", () => {
  it("should validate a valid time series point with date and numeric values", () => {
    const validData = {
      date: "2024-01-15",
      temperature: 24.5,
      humidity: 65,
    };

    const result = timeSeriesPointSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should validate a time series point with string values", () => {
    const validData = {
      date: "2024-01-15",
      label: "Sensor A",
      value: 100,
    };

    const result = timeSeriesPointSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should reject invalid date format", () => {
    const invalidData = {
      date: "01/15/2024",
      value: 100,
    };

    expect(() => timeSeriesPointSchema.parse(invalidData)).toThrow();
  });

  it("should reject missing date field", () => {
    const invalidData = {
      value: 100,
    };

    expect(() => timeSeriesPointSchema.parse(invalidData)).toThrow();
  });
});

describe("timeSeriesSchema", () => {
  it("should validate an array of time series points", () => {
    const validData = [
      { date: "2024-01-15", desktop: 100, mobile: 80 },
      { date: "2024-01-16", desktop: 120, mobile: 90 },
    ];

    const result = timeSeriesSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should validate an empty array", () => {
    const result = timeSeriesSchema.parse([]);
    expect(result).toEqual([]);
  });

  it("should reject array with invalid date format", () => {
    const invalidData = [
      { date: "2024-01-15", value: 100 },
      { date: "invalid-date", value: 200 },
    ];

    expect(() => timeSeriesSchema.parse(invalidData)).toThrow();
  });
});

describe("metricTrendSchema", () => {
  it("should validate a complete metric trend with all fields", () => {
    const validData = {
      title: "Total Readings",
      value: 1234,
      noTrendData: false,
      trend: 5.2,
      label: "vs yesterday",
      status: "up" as const,
      description: "Total data points collected",
      icon: "activity" as const,
    };

    const result = metricTrendSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should validate metric trend with string value", () => {
    const validData = {
      title: "Online Status",
      value: "5/10",
      label: "All assets online",
      status: "neutral" as const,
      description: "All assets are online",
    };

    const result = metricTrendSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should validate metric trend without optional fields", () => {
    const validData = {
      title: "Signal Quality",
      value: "95%",
      label: "Good readings",
      status: "neutral" as const,
      description: "Overall data reliability",
    };

    const result = metricTrendSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should reject empty title", () => {
    const invalidData = {
      title: "",
      value: 100,
      label: "test",
      status: "up",
      description: "test",
    };

    expect(() => metricTrendSchema.parse(invalidData)).toThrow();
  });

  it("should reject invalid status value", () => {
    const invalidData = {
      title: "Test",
      value: 100,
      label: "test",
      status: "invalid",
      description: "test",
    };

    expect(() => metricTrendSchema.parse(invalidData)).toThrow();
  });

  it("should reject invalid icon value", () => {
    const invalidData = {
      title: "Test",
      value: 100,
      label: "test",
      status: "up",
      description: "test",
      icon: "invalid-icon",
    };

    expect(() => metricTrendSchema.parse(invalidData)).toThrow();
  });
});

describe("metricTrendsSchema", () => {
  it("should validate an array of metric trends", () => {
    const validData = [
      {
        title: "Total Readings",
        value: 1234,
        trend: 5.2,
        label: "vs yesterday",
        status: "up" as const,
        description: "Total data points collected",
      },
      {
        title: "Active Alerts",
        value: 3,
        trend: -2.1,
        label: "vs last week",
        status: "down" as const,
        description: "Requires attention",
      },
    ];

    const result = metricTrendsSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should validate an empty array", () => {
    const result = metricTrendsSchema.parse([]);
    expect(result).toEqual([]);
  });
});

describe("pieChartDataSchema", () => {
  it("should validate valid pie chart data", () => {
    const validData = {
      name: "Pumps",
      value: 15,
      fill: "var(--chart-1)",
    };

    const result = pieChartDataSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should reject negative value", () => {
    const invalidData = {
      name: "Pumps",
      value: -5,
      fill: "var(--chart-1)",
    };

    expect(() => pieChartDataSchema.parse(invalidData)).toThrow();
  });

  it("should reject empty name", () => {
    const invalidData = {
      name: "",
      value: 15,
      fill: "var(--chart-1)",
    };

    expect(() => pieChartDataSchema.parse(invalidData)).toThrow();
  });

  it("should reject empty fill", () => {
    const invalidData = {
      name: "Pumps",
      value: 15,
      fill: "",
    };

    expect(() => pieChartDataSchema.parse(invalidData)).toThrow();
  });
});

describe("pieChartDataArraySchema", () => {
  it("should validate an array of pie chart data", () => {
    const validData = [
      { name: "Pumps", value: 15, fill: "var(--chart-1)" },
      { name: "Tanks", value: 8, fill: "var(--chart-2)" },
      { name: "Valves", value: 22, fill: "var(--chart-3)" },
    ];

    const result = pieChartDataArraySchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should validate an empty array", () => {
    const result = pieChartDataArraySchema.parse([]);
    expect(result).toEqual([]);
  });
});

describe("assetTableRowSchema", () => {
  it("should validate valid asset table row", () => {
    const validData = {
      id: "123",
      name: "Pump A",
      status: "Online",
      type: "Pump",
      location: "Building 1",
      lastReading: "24.5°C",
      lastSeen: "2024-01-15",
      activeAlerts: 2,
    };

    const result = assetTableRowSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should reject negative active alerts", () => {
    const invalidData = {
      id: "123",
      name: "Pump A",
      status: "Online",
      type: "Pump",
      location: "Building 1",
      lastReading: "24.5°C",
      lastSeen: "2024-01-15",
      activeAlerts: -1,
    };

    expect(() => assetTableRowSchema.parse(invalidData)).toThrow();
  });

  it("should reject empty required fields", () => {
    const invalidData = {
      id: "",
      name: "Pump A",
      status: "Online",
      type: "Pump",
      location: "Building 1",
      lastReading: "24.5°C",
      lastSeen: "2024-01-15",
      activeAlerts: 0,
    };

    expect(() => assetTableRowSchema.parse(invalidData)).toThrow();
  });
});

describe("assetTableRowsSchema", () => {
  it("should validate an array of asset table rows", () => {
    const validData = [
      {
        id: "123",
        name: "Pump A",
        status: "Online",
        type: "Pump",
        location: "Building 1",
        lastReading: "24.5°C",
        lastSeen: "2024-01-15",
        activeAlerts: 2,
      },
      {
        id: "124",
        name: "Tank B",
        status: "Offline",
        type: "Tank",
        location: "Building 2",
        lastReading: "N/A",
        lastSeen: "Never",
        activeAlerts: 0,
      },
    ];

    const result = assetTableRowsSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it("should validate an empty array", () => {
    const result = assetTableRowsSchema.parse([]);
    expect(result).toEqual([]);
  });
});

describe("validateChartData", () => {
  it("should return validated data for valid input", () => {
    const validData = {
      date: "2024-01-15",
      value: 100,
    };

    const result = validateChartData(timeSeriesPointSchema, validData);
    expect(result).toEqual(validData);
  });

  it("should throw ChartDataValidationError for invalid input", () => {
    const invalidData = {
      date: "invalid-date",
      value: 100,
    };

    expect(() => validateChartData(timeSeriesPointSchema, invalidData)).toThrow(
      ChartDataValidationError,
    );
  });

  it("should include detailed error message", () => {
    const invalidData = {
      date: "invalid-date",
      value: 100,
    };

    try {
      validateChartData(timeSeriesPointSchema, invalidData);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ChartDataValidationError);
      expect((error as ChartDataValidationError).message).toContain("validation failed");
      expect((error as ChartDataValidationError).zodError).toBeDefined();
    }
  });

  it("should handle multiple validation errors", () => {
    const invalidData = {
      title: "",
      value: 100,
      label: "",
      status: "invalid",
      description: "",
    };

    try {
      validateChartData(metricTrendSchema, invalidData);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ChartDataValidationError);
      expect((error as ChartDataValidationError).message).toContain("title");
      expect((error as ChartDataValidationError).message).toContain("label");
      expect((error as ChartDataValidationError).message).toContain("status");
    }
  });
});

describe("safeValidateChartData", () => {
  it("should return success result for valid data", () => {
    const validData = {
      date: "2024-01-15",
      value: 100,
    };

    const result = safeValidateChartData(timeSeriesPointSchema, validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it("should return error result for invalid data", () => {
    const invalidData = {
      date: "invalid-date",
      value: 100,
    };

    const result = safeValidateChartData(timeSeriesPointSchema, invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ChartDataValidationError);
      expect(result.error.message).toContain("validation failed");
    }
  });

  it("should not throw errors for invalid data", () => {
    const invalidData = {
      date: "invalid-date",
      value: 100,
    };

    expect(() => safeValidateChartData(timeSeriesPointSchema, invalidData)).not.toThrow();
  });
});

describe("ChartDataValidationError", () => {
  it("should create error with message", () => {
    const error = new ChartDataValidationError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.name).toBe("ChartDataValidationError");
  });

  it("should store zodError when provided", () => {
    const invalidData = { date: "invalid" };
    try {
      timeSeriesPointSchema.parse(invalidData);
    } catch (zodError) {
      const error = new ChartDataValidationError("Test error", zodError as any);
      expect(error.zodError).toBeDefined();
    }
  });
});
