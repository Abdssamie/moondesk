import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { Factory, Gauge, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  // If user is signed in, redirect to dashboard
  if (userId) {
    redirect("/dashboard/iiot");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8 flex justify-center gap-4">
          <Factory className="h-12 w-12 text-slate-700 dark:text-slate-300" />
          <Gauge className="h-12 w-12 text-slate-700 dark:text-slate-300" />
          <Zap className="h-12 w-12 text-slate-700 dark:text-slate-300" />
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-100">
          Industrial IoT Dashboard
        </h1>

        <p className="mb-8 text-lg text-slate-600 sm:text-xl dark:text-slate-400">
          Monitor and manage your industrial assets in real-time.
          <br />
          Solar Panels, PLCs, Sensors, and more.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/v2/login">
            <Button size="lg" variant="outline" className="min-w-[140px]">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/v2/register">
            <Button size="lg" className="min-w-[140px]">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <Factory className="mx-auto mb-4 h-8 w-8 text-slate-700 dark:text-slate-300" />
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Device Management</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Provision and monitor industrial devices with ease
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <Gauge className="mx-auto mb-4 h-8 w-8 text-slate-700 dark:text-slate-300" />
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Real-time Monitoring</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track telemetry data and device status in real-time
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <Zap className="mx-auto mb-4 h-8 w-8 text-slate-700 dark:text-slate-300" />
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Multi-tenancy</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage multiple organizations and teams securely
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
