import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemePreset, type ThemeMode } from "@/types/preferences/theme";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");

  return (
    <ClerkProvider
      appearance={{
        baseTheme: themeMode === "dark" ? dark : undefined,
      }}
    >
      <html
        lang="en"
        className={`${themeMode === "dark" ? "dark" : ""} dark:bg-slate-950`}
        data-theme-preset={themePreset}
        suppressHydrationWarning
      >
        <body className={`${inter.className} min-h-screen antialiased`}>
          <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
            {children}
            <Toaster />
          </PreferencesStoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
