import { ReactNode } from "react";

import { Factory } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
          <div className="text-primary-foreground absolute top-10 space-y-1 px-10">
            <Factory className="size-10" />
            <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
            <p className="text-sm">Industrial IoT Dashboard</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Real-time Monitoring</h2>
              <p className="text-sm">Track your solar panels, PLCs, sensors, and industrial devices in real-time.</p>
            </div>
            <Separator orientation="vertical" className="mx-3 !h-auto" />
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Multi-tenancy</h2>
              <p className="text-sm">
                Secure organization-based access control for managing multiple teams and assets.
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
