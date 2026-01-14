"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const performanceData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  responseTime: 50 + Math.random() * 100,
  throughput: 1000 + Math.random() * 500,
}));

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Response time and throughput over 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            responseTime: { label: "Response Time (ms)", color: "hsl(var(--chart-1))" },
            throughput: { label: "Throughput (req/s)", color: "hsl(var(--chart-2))" },
          }}
        >
          <AreaChart accessibilityLayer data={performanceData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="responseTime"
              type="natural"
              fill="var(--color-responseTime)"
              fillOpacity={0.4}
              stroke="var(--color-responseTime)"
              stackId="a"
            />
            <Area
              dataKey="throughput"
              type="natural"
              fill="var(--color-throughput)"
              fillOpacity={0.4}
              stroke="var(--color-throughput)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
