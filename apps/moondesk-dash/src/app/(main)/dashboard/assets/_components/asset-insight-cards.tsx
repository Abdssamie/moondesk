"use client";

import { Pie, PieChart, Label, Cell } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartConfig } from "@/components/ui/chart";
import { PieChartData } from "@/lib/adapters/dashboard-adapter";

const chartConfig = {
  count: {
    label: "Assets",
  },
  // Dynamic colors will be applied from data
} satisfies ChartConfig;

export function AssetInsightCards({ data }: { data: PieChartData[] }) {
  const totalAssets = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-3">
      <Card className="col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
        </CardHeader>
        <CardContent className="max-h-64">
          <ChartContainer config={chartConfig} className="size-full">
            <PieChart className="m-0" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                cornerRadius={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {totalAssets.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                            Assets
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                content={() => (
                  <ul className="ml-4 flex flex-col gap-2">
                    {data.map((item) => (
                      <li key={item.name} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm">
                          <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                          {item.name}
                        </span>
                        <span className="font-mono text-sm font-bold">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" variant="outline" className="w-full">
            Download Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
