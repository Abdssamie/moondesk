# Moondesk Agent Guidelines (Go)

This document provides comprehensive instructions and conventions for AI agents (and human developers) working on the Moondesk Go codebase.

## 1. Environment & Setup

- **Language**: Go 1.25.5+
- **Module Name**: `github.com/abdssamie/moondesk-go`
- **Key Frameworks**:
  - **Web Framework**: `github.com/labstack/echo/v4`
  - **ORM/Database**: `github.com/uptrace/bun` (PostgreSQL driver)
  - **Logging**: `github.com/rs/zerolog`
  - **Configuration**: `github.com/spf13/viper`
  - **MQTT**: `github.com/eclipse/paho.mqtt.golang`
  - **Docs**: `github.com/swaggo/swag` (Swagger/OpenAPI)

## 2. Build, Test, & Lint

Use the `Makefile` as the primary interface.

### Build
- **Build All**: `make build` (creates `bin/api` and `bin/worker`)
- **Build API**: `make build-api` or `go build -o bin/api ./cmd/api`
- **Build Worker**: `make build-worker` or `go build -o bin/worker ./cmd/worker`

### Run
- **Run API**: `make run` or `./bin/api` (after build)
- **Run Worker**: `./bin/worker` (after build)

### Testing
- **Run All Tests**: `make test` or `go test -v ./...`
- **Run Single Test**:
  ```bash
  go test -v -run ^TestName$ ./path/to/package
  # Example: go test -v -run ^TestSensorCreation$ ./internal/repository/postgres
  ```
- **Test with Race Detector**: `go test -v -race ./...` (Recommended for concurrent code)

### Linting & Formatting
- **Lint**: `make lint` (Runs `go vet` and checks `gofmt`)
- **Format**: `gofmt -s -w .` (Apply formatting)
- **Vet**: `go vet ./...`

### Documentation
- **Generate Swagger**: `make swagger` (requires `swag` CLI)
  - Output: `docs/` folder.
  - URL: `http://localhost:8080/swagger/index.html`

## 3. Project Structure

Adhere to the [Standard Go Project Layout](https://github.com/golang-standards/project-layout).

```text
.
├── cmd/                    # Main applications
│   ├── api/                # API server entrypoint (main.go)
│   └── worker/             # Background worker entrypoint
├── internal/               # Private application and library code
│   ├── config/             # Configuration loading (Viper)
│   ├── domain/             # Core business models & interfaces (DDD entities)
│   ├── repository/         # Data access layer (Postgres/Bun implementation)
│   │   └── postgres/       # Concrete Postgres implementations
│   ├── service/            # Business logic / Use cases
│   └── worker/             # Worker logic (MQTT, Parser)
├── pkg/                    # Library code safe to be imported by external apps (if any)
├── docs/                   # Swagger generated docs
├── migrations/             # Database migrations
└── Makefile                # Build scripts
```

## 4. Code Style & Conventions

### General
- **Formatting**: ALWAYS run `gofmt` on modified files.
- **Imports**: Group imports: Standard Library, Third Party, Local.
- **Naming**:
  - Use `CamelCase` for exported identifiers, `camelCase` for unexported.
  - Short variable names are preferred (`ctx`, `db`, `r` for repository, `s` for service) where context is clear.
  - IDs in structs: `ID` (not `Id`), `AssetID`.
- **Functions**: Keep functions small and focused. One concern per function.

### Domain Layer (`internal/domain`)
- **Structs**: Define core entities here with struct tags.
- **Tags**:
  - `bun`: Database mapping (e.g., `bun:"table:sensors,alias:s"`).
  - `json`: JSON serialization (camelCase).
  - Use pointers for optional fields (e.g., `*float64`).
- **Interfaces**: Define `Repository` interfaces here (e.g., `SensorRepository`).

### Repository Layer (`internal/repository`)
- **Implementation**: Implement domain interfaces in `internal/repository/postgres`.
- **Pattern**:
  ```go
  type SensorRepo struct {
      db *bun.DB
  }
  func NewSensorRepo(db *bun.DB) *SensorRepo { ... }
  ```
- **Context**: All DB methods MUST accept `context.Context` as the first argument.

### Error Handling
- **Explicit**: Always check errors.
  ```go
  if err != nil {
      return nil, fmt.Errorf("failed to operation: %w", err)
  }
  ```
- **No Panics**: Do not use `panic()` in application code. Allow `main` to handle fatal startup errors.
- **Wrapping**: Wrap errors with context when bubbling up (use `%w`).

### Logging (`zerolog`)
- Use structured logging.
  ```go
  log.Info().
      Str("component", "sensor_service").
      Int64("sensor_id", id).
      Msg("Processing sensor data")
  ```
- Levels: `Debug` (dev only), `Info` (general flow), `Warn` (recoverable), `Error` (actionable issues).

### API Handlers (`echo`)
- Return standard JSON responses.
- Use `c.JSON(http.StatusOK, response)`.
- Annotate handlers with Swagger comments (`// @Summary`, `// @Router`, etc.).

### Configuration
- Do not hardcode values. Use `internal/config` which loads from environment variables or config files.

## 5. Legacy & Migration
- **TypeScript Legacy**: The `moondesk-ts-legacy/` directory contains the previous iteration.
  - Consult its `AGENTS.md` (if present) or code for reference on business logic being ported.
  - Do NOT modify legacy code unless explicitly instructed for migration purposes.

## 6. Workflow for Agents
1. **Understand**: Read the request, search for relevant files in `cmd/` or `internal/`.
2. **Plan**: Outline changes. Check `domain` for model changes first.
3. **Edit**: Apply changes. If modifying DB schema, consider migrations (if applicable).
4. **Verify**:
   - Run `go build ./...` to check compilation.
   - Run `go test ./...` to verify no regressions.
   - Run `go vet ./...` to catch static errors.
