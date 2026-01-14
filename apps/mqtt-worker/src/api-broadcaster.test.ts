import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  connectToApi,
  broadcastToApi,
  disconnectFromApi,
} from "./api-broadcaster";
import { io } from "socket.io-client";

vi.mock("socket.io-client", () => ({
  io: vi.fn(),
}));

vi.mock("@moondesk/config", () => ({
  getEnv: vi.fn(() => ({
    HOST: "localhost",
    PORT: 3001,
    DATABASE_URL: "postgresql://user:password@host:port/db",
  })),
}));

describe("api-broadcaster", () => {
  let socketMock: any;

  beforeEach(() => {
    socketMock = {
      on: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn(),
      connected: false,
    };
    (io as any).mockReturnValue(socketMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
    disconnectFromApi();
  });

  describe("connectToApi", () => {
    it("should connect to the API and resolve on successful connection", async () => {
      socketMock.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === "connect") {
            callback();
          }
        },
      );

      await connectToApi();

      expect(io).toHaveBeenCalled();
      expect(socketMock.on).toHaveBeenCalledWith(
        "connect",
        expect.any(Function),
      );
    });

    it("should resolve even if the connection fails", async () => {
      socketMock.on.mockImplementation(
        (event: string, callback: (error: Error) => void) => {
          if (event === "connect_error") {
            callback(new Error("Connection failed"));
          }
        },
      );

      await connectToApi();

      expect(io).toHaveBeenCalled();
      expect(socketMock.on).toHaveBeenCalledWith(
        "connect_error",
        expect.any(Function),
      );
    });
  });

  describe("broadcastToApi", () => {
    it("should emit an event if the socket is connected", async () => {
      socketMock.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === "connect") {
            socketMock.connected = true;
            callback();
          }
        },
      );

      await connectToApi();
      await broadcastToApi("reading", {
        sensorId: 1,
        assetId: 1,
        organizationId: "org1",
        timestamp: new Date(),
        value: 10,
        parameter: "temp",
        quality: "good",
      });

      expect(socketMock.emit).toHaveBeenCalledWith(
        "worker:reading",
        expect.any(Object),
      );
    });

    it("should not emit an event if the socket is not connected", async () => {
      await broadcastToApi("reading", {
        sensorId: 1,
        assetId: 1,
        organizationId: "org1",
        timestamp: new Date(),
        value: 10,
        parameter: "temp",
        quality: "good",
      });

      expect(socketMock.emit).not.toHaveBeenCalled();
    });
  });

  describe("disconnectFromApi", () => {
    it("should disconnect the socket", async () => {
      socketMock.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === "connect") {
            callback();
          }
        },
      );

      await connectToApi();
      disconnectFromApi();

      expect(socketMock.disconnect).toHaveBeenCalled();
    });
  });
});
