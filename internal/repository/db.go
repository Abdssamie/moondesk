package repository

import (
	"database/sql"

	"github.com/abdssamie/moondesk-go/internal/config"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

// NewDB creates a new Bun database connection
func NewDB(cfg *config.DatabaseConfig) *bun.DB {
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(cfg.DSN)))
	db := bun.NewDB(sqldb, pgdialect.New())
	return db
}
