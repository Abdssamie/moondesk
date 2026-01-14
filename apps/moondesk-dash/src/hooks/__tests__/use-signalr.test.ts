import { HubConnectionBuilder } from "@microsoft/signalr";
import { describe, it, expect, vi } from "vitest";

import { useSignalR } from "../use-signalr";

// Mock SignalR module
vi.mock("@microsoft/signalr", () => {
  const mockConnection = {
    on: vi.fn(),
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    state: "Connected",
  };

  // Mock HubConnectionBuilder as a class
  class MockHubConnectionBuilder {
    withUrl = vi.fn().mockReturnThis();
    withAutomaticReconnect = vi.fn().mockReturnThis();
    build = vi.fn().mockReturnValue(mockConnection);
  }

  return {
    HubConnectionBuilder: MockHubConnectionBuilder,
    HubConnectionState: {
      Connected: "Connected",
      Disconnected: "Disconnected",
    },
  };
});

describe("useSignalR", () => {
  it("hook is defined", () => {
    expect(useSignalR).toBeDefined();
    expect(typeof useSignalR).toBe("function");
  });

  it("SignalR builder is mocked correctly", () => {
    const builder = new HubConnectionBuilder();

    expect(builder.withUrl).toBeDefined();
    expect(builder.withAutomaticReconnect).toBeDefined();
    expect(builder.build).toBeDefined();
  });
});
