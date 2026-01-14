import { z } from "zod";
import { getEnv } from "./env";

const appConfigSchema = z.object({
  isProduction: z.boolean(),
  clerk: z.object({
    secretKey: z.string().optional(),
    publishableKey: z.string().optional(),
  }),
});

let appConfig: z.infer<typeof appConfigSchema> | null = null;

export function getAppConfig() {
  if (appConfig) {
    return appConfig;
  }

  const env = getEnv();
  const isProduction = env.NODE_ENV === "production";

  const clerkSecretKey = env.CLERK_SECRET_KEY;
  const clerkPublishableKey = env.CLERK_PUBLISHABLE_KEY;

  if (isProduction && (!clerkSecretKey || !clerkPublishableKey)) {
    throw new Error(
      "CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY are required in production",
    );
  }

  appConfig = {
    isProduction,
    clerk: {
      secretKey: clerkSecretKey,
      publishableKey: clerkPublishableKey,
    },
  };

  return appConfig;
}
