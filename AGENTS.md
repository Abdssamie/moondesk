# Moondesk Agent Guidelines (TypeScript)

This document provides comprehensive instructions and conventions for AI agents (and human developers) working on the Moondesk TypeScript codebase.

## 1. Project Overview

Moondesk is a scalable, protocol-agnostic IoT platform designed to handle high-throughput data ingestion, real-time analytics, and device management.

## 2. Environment & Setup

- **Runtime**: Node.js (v20+), strictly TypeScript.
- **Package Manager**: `pnpm` (Corepack enabled).
- **Build System**: `turbo` for task orchestration, `tsup` for backend bundling.
- **Database**: PostgreSQL with TimescaleDB extension.
- **ORM**: Drizzle ORM.
- **Infrastructure**: Docker Compose for local development (Redis, Postgres, Mosquitto).

### Common Commands

- **Setup**: `corepack enable && pnpm install`
- **Dev**: `turbo run dev` (starts apps)
- **Docker**: `docker compose up -d` (starts infra + backend services)
- **Build**: `turbo run build`
- **Lint**: `turbo run lint`
- **Check Types**: `turbo run check-types`

## 3. Git Workflow & Linear Integration

Strict Git hooks (Husky) are enforced. Agents MUST follow these rules to successfully push code.

- **Branch Naming**:
  - Format: `mndsk-<ticket-id>-<title-kebab-case>`
  - Example: `mndsk-39-initial-commit` or `mndsk-42-fix-sensor-reading`
  - **Restriction**: You CANNOT commit directly to `main` or `master`.
- **Linear Integration**:
  - The project uses a `commit-msg` hook.
  - It automatically prepends the Linear Ticket ID (e.g., `MNDSK-39`) from the branch name to your commit message.
  - You do not need to manually type `MNDSK-39` in the commit message.
- **Pushing**:
  - Direct pushes to `main` are blocked.
  - You must push to your feature branch and open a Pull Request.

## 4. Repository Structure

This is a **Monorepo** managed by **Turbo** and **pnpm** workspaces.

### `apps/`

- **`api`**: Fastify backend. Main entry point for REST/WS.
- **`mqtt-worker`**: Node.js worker. Handles high-velocity MQTT traffic.
- **`edge-simulator`**: Tool to generate synthetic load for testing.
- **`moondesk-dash`**: Next.js 14+ frontend application.
- **`docs`**: Documentation site.

### `packages/`

- **`config`**: Shared configuration (env vars, schemas, constants).
- **`database`**: Drizzle ORM schemas and repositories.
- **`domain`**: Shared interfaces, types, Models, and Enums. No side effects.
- **`logger`**: Standardized Pino logger configuration.
- **`ui`**: Shared React UI components (shadcn/ui based).
- **`typescript-config`**: Shared `tsconfig.json` bases.

## 5. Architecture & Key Patterns

### System Architecture

1.  **Edge Devices**: Simulate or real devices sending data via MQTT.
2.  **Broker (Mosquitto)**: Handles MQTT messsaging.
3.  **Worker (MQTT Worker)**: Subscribes to broker, processes ingestion, and broadcasts "hot" data to API.
4.  **API (Fastify)**: REST & WebSocket API for frontend clients.
5.  **Storage**: TimescaleDB (Postgres) & Redis.

### Key Patterns

- **Ingestion Flow**: Device -> MQTT -> Mosquitto -> Worker -> Database + API (Broadcast).
- **Internal Auth**: The MQ worker talks to the API using a shared `INTERNAL_SERVICE_TOKEN`.
- **Bundling**: Backend apps use `tsup` to bundle local workspace packages into a single entry point for Docker.

## 6. Development Philosophy

1.  **Strict Types**: We do NOT use `any`. All types should be defined in `@moondesk/domain` if shared.
2.  **Docker First**: The entire backend stack runs in Docker.
3.  **Environment Variables**: Strictly validated using Zod in `@moondesk/config`.

## 7. Pre-Push Verification

**CRITICAL**: Before pushing ANY code, you MUST ensure these pass:

1.  `pnpm lint` (0 exit code)
2.  `pnpm check-types` (or `pnpm typecheck`)
3.  `pnpm build`

**If any of these fail, you MUST fix the errors before pushing.**

## 8. Commit Conventions

Every commit message should provide context. The Linear ID will be auto-prepended.

1.  **Summary Line**: `feat: implement user login flow`
2.  **Detailed Description**: List changed files and why.

Example:

```text
feat: implement user login flow

- apps/api/src/controllers/auth.controller.ts: Added login endpoint handler.
- packages/domain/src/schemas/auth.schema.ts: Added Zod schema.
```
