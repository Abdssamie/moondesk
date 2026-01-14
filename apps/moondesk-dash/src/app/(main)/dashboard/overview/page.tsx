import { auth } from "@clerk/nextjs/server";
import { Reading } from "@moondesk/domain";

import { ChartAreaInteractive } from "@/app/(main)/dashboard/overview/_components/chart-area-interactive";
import { DataTable } from "@/app/(main)/dashboard/overview/_components/data-table";
import { SectionCards } from "@/app/(main)/dashboard/overview/_components/section-cards";
import {
  adaptToMetricTrends,
  adaptReadingsToTimeSeries,
  adaptAssetsToTableRows,
} from "@/lib/adapters/dashboard-adapter";
import { moondeskApi } from "@/lib/api/api-client";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  if (token) {
    moondeskApi.setToken(token);
  }

  // Fetch data in parallel
  const [assets, alertStats, readingStats] = await Promise.all([
    moondeskApi.getAssets().catch(() => []),
    moondeskApi.getAlertStats().catch(() => undefined),
    moondeskApi.getReadingStats().catch(() => undefined),
  ]);

  // Fetch readings for chart (e.g., from the first asset with a sensor)
  // This is a simplification for the overview; a real dashboard might aggregate
  let readings: Reading[] = [];
  const firstAssetWithSensor = assets.find((a) => a.sensors && a.sensors.length > 0);
  if (firstAssetWithSensor && firstAssetWithSensor.sensors?.[0]) {
    readings = await moondeskApi.getRecentReadings(firstAssetWithSensor.sensors[0].id).catch(() => []);
  }

  // Adapt data
  const stats = adaptToMetricTrends(assets, readingStats, alertStats);
  const chartData = adaptReadingsToTimeSeries(readings);
  const tableData = adaptAssetsToTableRows(assets);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards stats={stats} />
      <ChartAreaInteractive data={chartData} />
      <DataTable data={tableData} />
    </div>
  );
}
