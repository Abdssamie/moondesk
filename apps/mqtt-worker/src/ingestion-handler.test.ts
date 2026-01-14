import { vi, describe, it, expect, beforeEach } from "vitest";

// Use vi.hoisted to ensure mocks are initialized before they are used in vi.mock
const { mockReadingRepo, mockSensorRepo, mockAlertRepo } = vi.hoisted(() => {
  return {
    mockReadingRepo: {
      insert: vi.fn(),
      bulkInsert: vi.fn(),
    },
    mockSensorRepo: {
      getAllSystemSensors: vi.fn(),
      getById: vi.fn(),
    },
    mockAlertRepo: {
      create: vi.fn(),
    },
  };
});

// Mock @moondesk/database
vi.mock("@moondesk/database", () => {
  return {
    ReadingRepository: vi.fn(() => mockReadingRepo),
    SensorRepository: vi.fn(() => mockSensorRepo),
    AlertRepository: vi.fn(() => mockAlertRepo),
  };
});

vi.mock("./api-broadcaster");
vi.mock("./parser");

import {
  handleMessage,
  refreshAllSensorThresholds,
  clearThresholdCache,
} from "./ingestion-handler";
import { broadcastToApi } from "./api-broadcaster";
import { parseMessage, parseTopic } from "./parser";

describe("Ingestion Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearThresholdCache();
  });

  describe("handleMessage", () => {
    it('should call handleSingleReading for "readings" action', async () => {
      vi.mocked(parseTopic).mockReturnValue({
        organizationId: "test-org",
        sensorId: 1,
        action: "readings",
      });
      vi.mocked(parseMessage).mockReturnValue({ value: 25, sensorId: 1 });

      mockReadingRepo.insert.mockResolvedValue({
        id: 1,
        value: 25,
        timestamp: new Date(),
      } as any);

      await handleMessage("org/test-org/sensor/1/readings", Buffer.from(""));

      expect(mockReadingRepo.insert).toHaveBeenCalled();
      expect(broadcastToApi).toHaveBeenCalledWith(
        "reading",
        expect.any(Object),
      );
    });

    it("should handle errors in handleSingleReading gracefully", async () => {
      vi.mocked(parseTopic).mockReturnValue({
        organizationId: "test-org",
        sensorId: 1,
        action: "readings",
      });
      vi.mocked(parseMessage).mockReturnValue({ value: 25, sensorId: 1 });

      mockReadingRepo.insert.mockRejectedValue(new Error("DB Error"));

      await handleMessage("org/test-org/sensor/1/readings", Buffer.from(""));

      expect(mockReadingRepo.insert).toHaveBeenCalled();
    });
  });

  describe("refreshAllSensorThresholds", () => {
    it("should fetch all sensors and update the cache", async () => {
      const sensors = [
        { id: 1, thresholdLow: 10, thresholdHigh: 30 },
        { id: 2, thresholdLow: null, thresholdHigh: 50 },
      ];

      mockSensorRepo.getAllSystemSensors.mockResolvedValue(
        sensors as any,
      );

      await refreshAllSensorThresholds();

      expect(mockSensorRepo.getAllSystemSensors).toHaveBeenCalled();
    });
  });
});
