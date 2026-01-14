# @moondesk/config

This package provides a centralized and validated way to manage configuration and environment variables across the Moondesk monorepo. It uses Zod for schema validation to ensure that all services start with a valid configuration, preventing runtime errors due to missing or invalid environment variables.

## Core Concepts

The configuration is split into multiple files, each responsible for a specific domain:

- `env.ts`: Handles base environment variables, such as `NODE_ENV`, `PORT`, and `DATABASE_URL`. It also exports a `isProduction` flag for environment-specific logic.
- `app.ts`: Manages application-level configurations, such as Clerk keys. It ensures that required variables are present in production environments.
- `database.ts`: Provides the database connection configuration.
- `mqtt.ts`: Provides the MQTT connection configuration.

## Usage

To access configuration variables, import the appropriate getter function from this package.

### Environment Variables

The `getEnv()` function returns a validated object with the base environment variables.

```typescript
import { getEnv } from "@moondesk/config";

const env = getEnv();

console.log("Node environment:", env.NODE_ENV);
console.log("Is production:", env.isProduction);
```

### Application Configuration

The `getAppConfig()` function returns application-specific configurations, such as Clerk keys.

```typescript
import { getAppConfig } from "@moondesk/config";

const appConfig = getAppConfig();

if (appConfig.isProduction) {
  console.log("Clerk Secret Key:", appConfig.clerk.secretKey);
}
```

## Validation

The environment variable schemas are defined using Zod. If any required environment variables are missing or invalid, the application will throw an error on startup, preventing it from running with an invalid configuration.

## Adding New Configuration

To add new configuration variables, follow these steps:

1.  **Determine the scope**: Decide whether the variable belongs in `env.ts` (base environment), `app.ts` (application-level), or a new domain-specific file.
2.  **Update the schema**: Add the new variable to the Zod schema in the appropriate file.
3.  **Update the getter function**: If necessary, update the corresponding getter function to include the new variable.
4.  **Access the variable**: Import the getter function in the service that requires the new variable.
