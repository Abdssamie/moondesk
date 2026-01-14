# MoonDesk Go Business-Ready Plan

## 1. API Specifications & Client Generation (OpenAPI)
To enable fast client generation and strict API contracts, we will use **Code-First** generation.

*   **Tool**: `github.com/swaggo/swag`
*   **Implementation**:
    1.  Add General API annotations in `cmd/api/main.go`.
    2.  Add Operation annotations in Handler methods (e.g., `@Summary`, `@Param`, `@Success`).
    3.  Run `swag init -g cmd/api/main.go` to generate `docs/swagger.json`.
    4.  Mount `echo-swagger` middleware to serve documentation.
    5.  **Automation**: A Makefile target `make swagger` to regenerate on demand.
    6.  **Client Gen**: Use `openapi-generator-cli` to generate TypeScript/React Query hooks from the spec.

## 2. Robust Database Migrations
We cannot rely on manual DB setup. We will use `bun`'s native migration system.

*   **Structure**: `cmd/bundb/main.go` (CLI entrypoint).
*   **Migrations**: stored in `internal/migrations/*.go`.
*   **Workflow**:
    *   `go run ./cmd/bundb init`
    *   `go run ./cmd/bundb migrate`
    *   This ensures every environment (Local, CI, Prod) has the exact same schema version.

## 3. Testing Strategy & Quality
*   **Linter**: Add `.golangci.yml` with strict rules (errcheck, staticcheck, revive).
*   **Unit Tests**: Test `internal/service` logic using mocked Repositories.
*   **Integration Tests**: Use `testcontainers-go`.
    *   Spin up a real Postgres Docker container in Go tests.
    *   Run migrations.
    *   Test Repository queries against the real DB.
    *   Spin up Mosquitto to test MQTT worker ingestion.

## 4. Modularity & Scalability
*   **Dependency Injection**: Continue using manual injection in `main.go` (cleanest for this size), but strictly separate `Transport` (HTTP/MQTT) from `Business Logic` (Service) from `Data` (Repository).
*   **Caching Layer**:
    *   Add `internal/cache/redis.go`.
    *   Wrap Repository calls for high-traffic data (e.g., `GetSensorConfig`) with a cached decorator.
*   **Async Processing**:
    *   Ensure the MQTT worker pushes heavy writes (like "Batch Insert Readings") to a buffered channel or a persistent queue (Redis Streams/Kafka) if throughput exceeds DB write speed.

## 5. Automation (Makefile)
Create a `Makefile` to standardize developer workflows:
```makefile
.PHONY: build test lint swagger migrate

build:
	go build -o bin/api ./cmd/api

swagger:
	swag init -g cmd/api/main.go --output docs/

test:
	go test -race ./...

lint:
	golangci-lint run
```
