"use client";

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const chartData = [{ usage: 68, fill: "hsl(var(--chart-2))" }];

export function DataUsage() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Data Usage</CardTitle>
        <CardDescription>Storage consumption</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{ usage: { label: "Usage", color: "hsl(var(--chart-2))" } }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} startAngle={0} endAngle={250} innerRadius={80} outerRadius={110}>
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="usage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                          {chartData[0].usage}%
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                          Used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">6.8 TB of 10 TB used</div>
        <div className="text-muted-foreground leading-none">3.2 TB remaining</div>
      </CardFooter>
    </Card>
  );
}
