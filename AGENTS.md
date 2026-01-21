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
4.  **Code Quality**: Write correct, best practice, DRY, bug-free, and fully functional code.
5.  **Completeness**: Leave NO todo’s, placeholders, or missing pieces. Ensure code is fully finalized.

## 7. Pre-Push Verification

**CRITICAL**: Before pushing ANY code, you MUST ensure these pass:

1.  `pnpm lint` (0 exit code)
2.  `pnpm check-types` (or `pnpm typecheck`)
3.  `pnpm build`

**If any of these fail, you MUST fix the errors before pushing.**

## 8. Commit Conventions

Every commit message should provide context. The Linear ID will be auto-prepended.

1.  **Summary Line**: `feat: implement user login flow` (Brief and follows conventional commit format)
2.  **Detailed Description**: List changed files and why. Include elaborate details in the body.
3.  **Format**: Add two newlines after the commit message title.

Example:

```text
feat: implement user login flow

- apps/api/src/controllers/auth.controller.ts: Added login endpoint handler.
- packages/domain/src/schemas/auth.schema.ts: Added Zod schema.
```

## 9. Testing & Quality Control (Agent Specific)

Agents must run tests to verify changes. The project uses **Vitest**.

### Running Tests

- **All Tests**: `turbo run test` (runs all workspace tests).
-
- **Specific Workspace**: `pnpm test --filter @moondesk/api`.
- **Single Test File**:
  1. Navigate to the app directory: `apps/api` (using `workdir` parameter).
  2. Run: `pnpm test src/controllers/auth.controller.spec.ts`
- **Single Test Case**:
  1. Navigate to the app directory.
  2. Run: `pnpm test -- -t "should handle user.created event"`

### Linting & Formatting

- **Lint**: `turbo run lint` or `eslint src/` within a workspace.
- **Format**: `pnpm format` (uses Prettier).
- **Type Check**: `turbo run check-types` is the source of truth.

### Code Review Checklist

- Ensure proper typing (no `any`).
- Check for code duplication (DRY).
- Verify error handling (try/catch, typed errors).
- Confirm test coverage.
- Assess overall code structure and readability.

## 10. Code Style Guidelines

Adhere to these styles to ensure consistency across the monorepo.

### 10.1 Imports

Sort imports in the following order:

1.  **External Libraries**: `import { Fastify } from 'fastify';`
2.  **Internal Packages**: `import { getEnv } from '@moondesk/config';` (Always use `@moondesk/*` aliases)
3.  **Relative Imports**: `import { createApp } from './app';`

- If an import is only used as a type, use `import type`.

### 10.2 TypeScript & Naming

- **Strictness**: No `any`. Use `unknown` with narrowing if necessary.
- **Interfaces**: Prefer `interface` for object shapes, `type` for unions/primitives.
- **Naming**:
  - Variables/Functions: `camelCase` (e.g., `processIngestion`, `getUserData`)
  - Classes/Components: `PascalCase` (e.g., `WebhookController`, `Button`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `INTERNAL_SERVICE_TOKEN`)
  - Files: `kebab-case` (e.g., `auth.controller.ts`, `user.schema.ts`)
- **Functions**: Use descriptive names (verbs & nouns). Prefer arrow functions for simple operations (e.g., `const toggle = () =>`).
- **Types**: For new types, prefer creating a Zod schema and inferring the type. Use `readonly` for immutable properties.

### 10.3 Error Handling

- **Typed Exceptions**: Do not throw raw strings. Use typed error classes or objects.
- **Logging**: Use the `@moondesk/logger` instance.
  - **Bad**: `console.log(error)`
  - **Good**: `logger.error(error, 'Failed to process webhook')`
- **Graceful Failure**: API endpoints should return structured 4xx/5xx responses, not crash.

### 10.4 Testing Patterns

- **Framework**: Vitest + Supertest (for API integration).
- **Mocking**: Use `vi.mock()` for external dependencies.
- **Structure**: Group with `describe`, define cases with `it` or `test`.
- **Setup**: Use `beforeEach` to reset mocks/state.

### 10.5 Agent Behavior

- **Dependencies**: Do NOT install new packages without explicit user permission.
- **Configuration**: Changes to `package.json` or `tsconfig.json` require justification.
- **Hallucinations**: Do not assume standard libraries exist if they are not in `package.json`.
- **Verification**: ALWAYS run `pnpm check-types` after making changes.
- **Plan First**: Describe your plan in pseudocode/detail before writing code.
- **Documentation**: Follow Google's Technical Writing Style Guide. Use JSDoc for all code.

## 11. Frontend Development Guidelines

Specific rules for React, Next.js, and UI components (e.g., `apps/moondesk-dash`).

- **Tech Stack**: ReactJS, NextJS, TypeScript, TailwindCSS, Shadcn, Radix.
- **Styling**:
  - Always use **Tailwind classes** for styling; avoid custom CSS or style tags.
  - Use `class:` (or `cn` utility) instead of ternary operators in class strings where possible.
- **Components**:
  - Use `const` for components: `const MyComponent = () =>`.
  - Naming: `PascalCase` for components.
  - Handlers: Prefix with `handle` (e.g., `handleClick`, `handleKeyDown`).
- **Accessibility**:
  - Ensure interactive elements have `tabindex`, `aria-label`, `on:click`, `on:keydown`.
- **Implementation**:
  - Focus on readability.
  - Use early returns to simplify logic.
  - **Minimize Prose**: Be concise in explanations.

## 12. Advanced Workflows & Shortcuts

- **`CURSOR:PAIR`**: Act as a senior pair programmer. Provide alternatives, guidance, and weigh in on the best course of action.
- **`RFC`**: Refactor code per instructions. Follow requirements strictly.
- **`RFP`**: Improve the provided prompt. Break it down into smaller steps using Google's Technical Writing Style Guide.

## 13. Documentation Standards

- **Style**: Follow Google's Technical Writing Style Guide.
- **Voice**: Active voice, present tense, clear and concise.
- **JSDoc**: Always write JSDocs for classes, functions, methods, fields, types, and interfaces. Use TypeDoc compatible tags.
