import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@moondesk/database");
vi.mock("./api-broadcaster");
vi.mock("./parser");

import {
  handleMessage,
  refreshAllSensorThresholds,
  clearThresholdCache,
} from "./ingestion-handler";
import { ReadingRepository, SensorRepository } from "@moondesk/database";
import { broadcastToApi } from "./api-broadcaster";
import { parseMessage, parseTopic } from "./parser";

describe("Ingestion Handler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    clearThresholdCache();
  });

  describe("handleMessage", () => {
    it('should call handleSingleReading for "readings" action', async () => {
      const readingRepo = new ReadingRepository();
      vi.mocked(parseTopic).mockReturnValue({
        organizationId: "test-org",
        sensorId: 1,
        action: "readings",
      });
      vi.mocked(parseMessage).mockReturnValue({ value: 25, sensorId: 1 });
      vi.mocked(readingRepo.insert).mockResolvedValue({
        id: 1,
        value: 25,
        timestamp: new Date(),
      } as any);

      await handleMessage("org/test-org/sensor/1/readings", Buffer.from(""));

      expect(readingRepo.insert).toHaveBeenCalled();
      expect(broadcastToApi).toHaveBeenCalledWith(
        "reading",
        expect.any(Object),
      );
    });

    it("should handle errors in handleSingleReading gracefully", async () => {
      const readingRepo = new ReadingRepository();
      vi.mocked(parseTopic).mockReturnValue({
        organizationId: "test-org",
        sensorId: 1,
        action: "readings",
      });
      vi.mocked(parseMessage).mockReturnValue({ value: 25, sensorId: 1 });
      vi.mocked(readingRepo.insert).mockRejectedValue(new Error("DB Error"));

      await handleMessage("org/test-org/sensor/1/readings", Buffer.from(""));

      expect(readingRepo.insert).toHaveBeenCalled();
    });
  });

  describe("refreshAllSensorThresholds", () => {
    it("should fetch all sensors and update the cache", async () => {
      const sensorRepo = new SensorRepository();
      const sensors = [
        { id: 1, thresholdLow: 10, thresholdHigh: 30 },
        { id: 2, thresholdLow: null, thresholdHigh: 50 },
      ];
      vi.mocked(sensorRepo.getAllSystemSensors).mockResolvedValue(
        sensors as any,
      );

      await refreshAllSensorThresholds();

      expect(sensorRepo.getAllSystemSensors).toHaveBeenCalled();
    });
  });
});
