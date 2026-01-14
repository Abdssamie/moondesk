"use client";

import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const systemComponents = [
  { name: "API Gateway", status: "operational", uptime: "99.9%", icon: CheckCircle, color: "text-green-500" },
  { name: "Database", status: "operational", uptime: "99.8%", icon: CheckCircle, color: "text-green-500" },
  { name: "Message Queue", status: "degraded", uptime: "98.2%", icon: AlertCircle, color: "text-amber-500" },
  { name: "Data Pipeline", status: "operational", uptime: "99.5%", icon: CheckCircle, color: "text-green-500" },
  { name: "Analytics Engine", status: "operational", uptime: "99.7%", icon: CheckCircle, color: "text-green-500" },
];

export function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-5" />
          System Health
        </CardTitle>
        <CardDescription>Real-time component status</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="uptime">Uptime</TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="space-y-4">
            {systemComponents.map((component, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <component.icon className={`size-4 ${component.color}`} />
                    <span className="text-sm font-medium">{component.name}</span>
                  </div>
                  <span className="text-muted-foreground text-xs capitalize">{component.status}</span>
                </div>
                {i < systemComponents.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </TabsContent>
          <TabsContent value="uptime" className="space-y-4">
            {systemComponents.map((component, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{component.name}</span>
                  <span className="text-sm font-semibold tabular-nums">{component.uptime}</span>
                </div>
                {i < systemComponents.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
