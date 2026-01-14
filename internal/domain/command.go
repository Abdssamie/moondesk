package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// Command represents a command sent to a device/sensor
type Command struct {
	bun.BaseModel `bun:"table:commands,alias:cmd"`

	ID             int64                  `bun:"id,pk,autoincrement" json:"id"`
	SensorID       int64                  `bun:"sensor_id,notnull" json:"sensorId"`
	OrganizationID string                 `bun:"organization_id,notnull" json:"organizationId"`
	UserID         string                 `bun:"user_id,notnull" json:"userId"`
	Action         string                 `bun:"action,notnull" json:"action"` // e.g., "TURN_ON", "TURN_OFF"
	Parameters     map[string]interface{} `bun:"parameters,type:jsonb" json:"parameters"`
	Status         CommandStatus          `bun:"status,notnull" json:"status"`
	Protocol       Protocol               `bun:"protocol,notnull" json:"protocol"`
	CreatedAt      time.Time              `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"createdAt"`
	SentAt         *time.Time             `bun:"sent_at" json:"sentAt"`
	CompletedAt    *time.Time             `bun:"completed_at" json:"completedAt"`
	ErrorMessage   string                 `bun:"error_message" json:"errorMessage"`
	Metadata       map[string]string      `bun:"metadata,type:jsonb" json:"metadata"`

	// Navigation property
	Sensor *Sensor `bun:"rel:belongs-to,join:sensor_id=id" json:"sensor,omitempty"`
}

// CommandRepository defines the interface for command persistence
type CommandRepository interface {
	Create(ctx context.Context, command *Command) error
	GetByID(ctx context.Context, id int64, organizationID string) (*Command, error)
	ListBySensor(ctx context.Context, sensorID int64, organizationID string) ([]Command, error)
	Update(ctx context.Context, command *Command) error
}

// CreateCommandInput represents input for creating a new command
type CreateCommandInput struct {
	SensorID       int64                  `json:"sensorId"`
	OrganizationID string                 `json:"organizationId"`
	UserID         string                 `json:"userId"`
	Action         string                 `json:"action"`
	Parameters     map[string]interface{} `json:"parameters,omitempty"`
	Protocol       Protocol               `json:"protocol,omitempty"`
	Metadata       map[string]string      `json:"metadata,omitempty"`
}

// UpdateCommandStatusInput represents input for updating command status
type UpdateCommandStatusInput struct {
	Status       CommandStatus `json:"status"`
	ErrorMessage string        `json:"errorMessage,omitempty"`
}
