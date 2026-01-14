import { DataUsage } from "./_components/data-usage";
import { EnergyConsumption } from "./_components/energy-consumption";
import { PerformanceMetrics } from "./_components/performance-metrics";
import { SystemHealth } from "./_components/system-health";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-1">
        <SystemHealth />
      </div>

      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="flex-1">
          <PerformanceMetrics />
        </div>
        <div className="*:data-[slot=card]:shadow-xs grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          <DataUsage />
          <EnergyConsumption />
        </div>
      </div>
    </div>
  );
}
