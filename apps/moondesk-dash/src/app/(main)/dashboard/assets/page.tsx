import { auth } from "@clerk/nextjs/server";
import { Asset } from "@moondesk/domain";

import { DataTable } from "@/app/(main)/dashboard/overview/_components/data-table";
import { adaptAssetsToDistribution, adaptAssetsToTableRows } from "@/lib/adapters/dashboard-adapter";
import { moondeskApi } from "@/lib/api/api-client";

import { AssetInsightCards } from "./_components/asset-insight-cards";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  if (token) {
    moondeskApi.setToken(token);
  }

  const assets = await moondeskApi.getAssets().catch(() => []);

  const distributionData = adaptAssetsToDistribution(assets);
  const tableData = adaptAssetsToTableRows(assets);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <AssetInsightCards data={distributionData} />
      <div className="@container/main">
        <DataTable data={tableData} />
      </div>
    </div>
  );
}
