FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @moondesk/edge-simulator build

FROM base AS runner
WORKDIR /app

# Copy root config files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy shared packages
COPY --from=builder /app/packages ./packages

# Copy app source and build
COPY --from=builder /app/apps/edge-simulator ./apps/edge-simulator

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
WORKDIR /app/apps/edge-simulator

CMD ["node", "dist/main.js"]
