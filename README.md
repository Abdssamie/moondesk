# Moondesk

Moondesk is a comprehensive IoT Dashboard and Edge Simulation platform built as a monorepo using [Turborepo](https://turbo.build/repo). It provides a full stack solution for managing, monitoring, and simulating IoT devices.

## Architecture

The project is structured as a monorepo with the following components:

### Apps (`/apps`)

- **`moondesk-dash`**: The main dashboard application built with [Next.js](https://nextjs.org/). It provides the user interface for monitoring assets, managing organizations, and visualizing data.
- **`@moondesk/api`**: The backend API service (Node.js/Fastify) that handles data ingestion, user management, and communication with the database and message broker.
- **`edge-simulator`**: A CLI/Service built with TypeScript that simulates edge devices, generating telemetry data for testing and development.
- **`mqtt-worker`**: A dedicated worker service for handling high-throughput MQTT messages and processing telemetry data.
- **`docs`**: Project documentation site built with Next.js.

### Packages (`/packages`)

Shared libraries used across the applications:

- **`@moondesk/database`**: Database schema, migrations (Prisma/TimescaleDB), and repository patterns.
- **`@moondesk/domain`**: Shared domain types, interfaces, and business logic definitions.
- **`@moondesk/config`**: Centralized configuration management.
- **`@moondesk/logger`**: shared logging utilities.
- **`@moondesk/ui`**: Shared UI component library.
- **`@moondesk/eslint-config`**: Shared ESLint configurations.
- **`@moondesk/typescript-config`**: Shared TSConfig bases.

## Prerequisites

- **Node.js**: >= 18
- **pnpm**: >= 9
- **Docker & Docker Compose**: For running infrastructure services (TimescaleDB, Mosquitto, Redis).

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd moondesk
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start Infrastructure:**
   Spin up the required database and message broker services using Docker Compose.

   ```bash
   docker-compose up -d
   ```

4. **Run Development Server:**
   Start all applications in development mode.

   ```bash
   pnpm dev
   ```

   - Dashboard: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3001](http://localhost:3001) (check logs for exact port)
   - Documentation: [http://localhost:3002](http://localhost:3002)

## Common Commands

- **Build**: `pnpm build` - Builds all apps and packages.
- **Lint**: `pnpm lint` - Lints all workspaces.
- **Test**: `pnpm test` - Runs tests across the monorepo.
- **Development**: `pnpm dev` - Starts the development environment.

## Environment Variables

Check `.env.example` in respective applications for required environment variables. Ensure `globalEnv` in `turbo.json` is updated if adding new shared environment variables.

## License

Not set yet
