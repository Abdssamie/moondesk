import { useEffect, useState } from "react";

import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { Alert, Reading } from "@moondesk/domain";
import { useQueryClient } from "@tanstack/react-query";

const HUB_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") + "/hubs/iot" || "http://localhost:5000/hubs/iot";

export function useSignalR() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder().withUrl(HUB_URL).withAutomaticReconnect().build();

    newConnection.on("ReceiveReading", (reading: Reading) => {
      queryClient.setQueryData(["readings", reading.sensorId, 24], (old: Reading[] = []) =>
        [...old, reading].slice(-100),
      );
    });

    newConnection.on("ReceiveAlert", (alert: Alert) => {
      queryClient.setQueryData(["alerts"], (old: Alert[] = []) => [alert, ...old]);
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    });

    newConnection.on("AssetStatusChanged", () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    });

    newConnection
      .start()
      .then(() => setConnection(newConnection))
      .catch(console.error);

    return () => {
      if (newConnection.state === HubConnectionState.Connected) {
        newConnection.stop();
      }
    };
  }, [queryClient]);

  return connection;
}
