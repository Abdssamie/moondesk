import { TrendingUp, TrendingDown, Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricTrend } from "@/lib/adapters/dashboard-adapter";

export function SectionCards({ stats }: { stats: MetricTrend[] }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat) => {
        const TrendIcon = stat.status === "up" ? TrendingUp : stat.status === "down" ? TrendingDown : Activity;

        return (
          <Card key={stat.title} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{stat.value}</CardTitle>
              <CardAction>
                {!stat.noTrendData && typeof stat.trend === "number" && (
                  <Badge variant="outline">
                    <TrendIcon />
                    {stat.trend > 0 ? "+" : ""}
                    {stat.trend}%
                  </Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stat.label}{" "}
                {!stat.noTrendData && typeof stat.trend === "number" && stat.trend !== 0 && (
                  <TrendIcon className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">{stat.description}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
