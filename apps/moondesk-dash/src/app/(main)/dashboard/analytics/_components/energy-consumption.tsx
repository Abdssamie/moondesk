"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "Jan", consumption: 186 },
  { month: "Feb", consumption: 205 },
  { month: "Mar", consumption: 237 },
  { month: "Apr", consumption: 173 },
  { month: "May", consumption: 209 },
  { month: "Jun", consumption: 214 },
];

export function EnergyConsumption() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Consumption</CardTitle>
        <CardDescription>Monthly usage in kWh</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ consumption: { label: "Consumption", color: "hsl(var(--chart-3))" } }}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="consumption" fill="var(--color-consumption)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground leading-none">Showing last 6 months</div>
      </CardFooter>
    </Card>
  );
}
