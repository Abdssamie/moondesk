# Moondesk Go Backend Implementation Plan

## 🎯 Objective
Re-implement the Moondesk Industrial IoT backend using **Go**, **Echo** (Web Framework), and **Bun** (ORM), maintaining the existing Domain-Driven Design and Clean Architecture principles established in the .NET solution.

---

## 🛠️ Technology Stack & Mapping

| Component | Current (.NET) | Target (Go) | Notes |
| :--- | :--- | :--- | :--- |
| **Web Framework** | ASP.NET Core | **[Labstack Echo](https://echo.labstack.com/)** | Fast, minimalist, robust middleware support. |
| **ORM / Database** | EF Core | **[uptrace/bun](https://bun.uptrace.dev/)** | SQL-first, performant, supports PostgreSQL arrays/types. |
| **Database** | TimescaleDB | **TimescaleDB** | Same database, accessed via `pgdriver`. |
| **Real-time** | SignalR | **[Gorilla WebSocket](https://github.com/gorilla/websocket)** | Native WebSocket upgrading with simple hub pattern. |
| **MQTT** | MQTTnet | **[paho.mqtt.golang](https://github.com/eclipse/paho.mqtt.golang)** | Industry standard Go MQTT client. |
| **Authentication** | Clerk.NET | **[golang-jwt/jwt](https://github.com/golang-jwt/jwt)** | Custom middleware to verify Clerk JWKS. |
| **Configuration** | IConfiguration | **[spf13/viper](https://github.com/spf13/viper)** | Reads env vars, JSON, YAML. |
| **Logging** | Serilog | **[rs/zerolog](https://github.com/rs/zerolog)** | Zero-allocation JSON logging. |
| **Task Scheduling** | BackgroundService | **Go Routines** / **[Robfig Cron](https://github.com/robfig/cron)** | Native concurrency is superior here. |

---

## 📂 Proposed Project Structure

We will adhere to the **Standard Go Project Layout** with modifications for Clean Architecture.

```text
moondesk/
├── cmd/
│   ├── api/
│   │   └── main.go           # Entry point for the REST API server
│   └── worker/
│       └── main.go           # Entry point for MQTT ingestion & background tasks
├── internal/
│   ├── config/               # Viper configuration loading
│   ├── domain/               # PURE GO: Entities, Interfaces (Clean Arch: Domain)
│   │   ├── asset.go
│   │   ├── sensor.go
│   │   ├── reading.go
│   │   └── alert.go
│   ├── handler/              # HTTP Handlers (Clean Arch: API Controllers)
│   │   ├── http/             # Echo handlers
│   │   │   ├── asset_handler.go
│   │   │   └── reading_handler.go
│   │   └── ws/               # WebSocket/Real-time handlers
│   ├── repository/           # Database Access (Clean Arch: DataAccess)
│   │   ├── postgres/         # Bun implementations
│   │   │   ├── asset_repo.go
│   │   │   └── reading_repo.go
│   │   └── db.go             # Bun connection setup
│   ├── service/              # Business Logic (Clean Arch: Application Services)
│   │   ├── ingestion/        # MQTT Message processing
│   │   ├── compliance/       # Alert threshold checking logic
│   │   └── encryption.go     # Credential encryption
│   └── worker/               # Background job definitions (MQTT listeners)
├── migrations/               # SQL migrations (Bun compatible)
├── pkg/                      # Public shared code (utils, constants)
├── go.mod
└── go.sum
```

---

## 🗺️ Component Mapping Guide

### 1. Domain Entities (`Moondesk.Domain`)
**Location:** `internal/domain`
Define structs with Bun tags for persistence and JSON tags for API.
```go
// internal/domain/reading.go
type Reading struct {
    bun.BaseModel `bun:"table:readings"`

    ID             uuid.UUID `bun:"type:uuid,default:uuid_generate_v4()"`
    SensorID       string    `bun:",notnull"`
    Timestamp      time.Time `bun:",notnull"`
    Value          float64   `bun:",notnull"`
    OrganizationID string    `bun:",notnull"`
}
```

### 2. Database & Repositories (`Moondesk.DataAccess`)
**Location:** `internal/repository`
Use Bun to write type-safe SQL. TimescaleDB hypertables are created via migrations.
```go
// internal/repository/postgres/reading_repo.go
func (r *ReadingRepo) Insert(ctx context.Context, reading *domain.Reading) error {
    _, err := r.db.NewInsert().Model(reading).Exec(ctx)
    return err
}
```

### 3. API Controllers (`Moondesk.API/Controllers`)
**Location:** `internal/handler/http`
Echo handlers receive `echo.Context`.
```go
// internal/handler/http/reading_handler.go
func (h *ReadingHandler) GetLatest(c echo.Context) error {
    sensorID := c.Param("sensorId")
    // call service...
    return c.JSON(http.StatusOK, result)
}
```

### 4. Background Services (`Moondesk.BackgroundServices`)
**Location:** `internal/worker` & `cmd/worker`
Go routines are perfect for this. The MQTT listener will run in a separate goroutine or a dedicated worker binary.
```go
// internal/worker/mqtt_subscriber.go
func StartIngestion(cfg Config, svc service.IngestionService) {
    opts := mqtt.NewClientOptions().AddBroker(cfg.MQTT_URL)
    // ... setup and subscribe
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Day 1)
1.  Initialize `go.mod`.
2.  Set up `cmd/api/main.go` with a basic Echo server.
3.  Configure `viper` for `config.yaml` / ENV vars.
4.  Set up `zerolog` for structured logging.

### Phase 2: Database & Domain (Days 2-3)
1.  Define Domain structs (`internal/domain`).
2.  Set up Bun connection to TimescaleDB (`internal/repository/db.go`).
3.  Write migrations (Create tables + `SELECT create_hypertable(...)`).
4.  Implement basic CRUD repositories.

### Phase 3: API & Auth (Days 4-5)
1.  Implement Clerk JWT Middleware for Echo.
2.  Port standard REST endpoints (Assets, Sensors).
3.  Connect Repositories to Handlers.

### Phase 4: Ingestion & Real-time (Days 6-7)
1.  Implement `internal/worker` for MQTT.
2.  Implement `internal/service/ingestion` logic (Parse -> Save -> Check Threshold).
3.  Add WebSockets for real-time updates using Gorilla WebSocket.

---
