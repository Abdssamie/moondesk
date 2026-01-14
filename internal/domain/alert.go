package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// Alert represents an alert triggered when sensor readings exceed thresholds
type Alert struct {
	bun.BaseModel `bun:"table:alerts,alias:al"`

	ID             int64             `bun:"id,pk,autoincrement" json:"id"`
	SensorID       int64             `bun:"sensor_id,notnull" json:"sensorId"`
	OrganizationID string            `bun:"organization_id,notnull" json:"organizationId"`
	Timestamp      time.Time         `bun:"timestamp,notnull,default:current_timestamp" json:"timestamp"`
	Severity       AlertSeverity     `bun:"severity,notnull" json:"severity"`
	Message        string            `bun:"message,notnull" json:"message"`
	TriggerValue   float64           `bun:"trigger_value,notnull" json:"triggerValue"`
	ThresholdValue *float64          `bun:"threshold_value" json:"thresholdValue"`
	Acknowledged   bool              `bun:"acknowledged,notnull,default:false" json:"acknowledged"`
	AcknowledgedAt *time.Time        `bun:"acknowledged_at" json:"acknowledgedAt"`
	AcknowledgedBy string            `bun:"acknowledged_by" json:"acknowledgedBy"`
	Notes          string            `bun:"notes" json:"notes"`
	Protocol       Protocol          `bun:"protocol,notnull" json:"protocol"`
	Metadata       map[string]string `bun:"metadata,type:jsonb" json:"metadata"`

	// Navigation property
	Sensor *Sensor `bun:"rel:belongs-to,join:sensor_id=id" json:"sensor,omitempty"`
}

// AlertRepository defines the interface for alert persistence
type AlertRepository interface {
	Create(ctx context.Context, alert *Alert) error
	GetByID(ctx context.Context, id int64, organizationID string) (*Alert, error)
	List(ctx context.Context, params AlertQueryParams) ([]Alert, error)
	Update(ctx context.Context, alert *Alert) error
	GetStats(ctx context.Context, organizationID string) (*AlertStats, error)
}

// CreateAlertInput represents input for creating a new alert
type CreateAlertInput struct {
	SensorID       int64             `json:"sensorId"`
	OrganizationID string            `json:"organizationId"`
	Severity       AlertSeverity     `json:"severity"`
	Message        string            `json:"message"`
	TriggerValue   float64           `json:"triggerValue"`
	ThresholdValue *float64          `json:"thresholdValue,omitempty"`
	Protocol       Protocol          `json:"protocol,omitempty"`
	Metadata       map[string]string `json:"metadata,omitempty"`
}

// AcknowledgeAlertInput represents input for acknowledging an alert
type AcknowledgeAlertInput struct {
	AcknowledgedBy string `json:"acknowledgedBy"`
	Notes          string `json:"notes,omitempty"`
}

// AlertQueryParams represents query parameters for fetching alerts
type AlertQueryParams struct {
	OrganizationID string         `json:"organizationId"`
	SensorID       *int64         `json:"sensorId,omitempty"`
	Severity       *AlertSeverity `json:"severity,omitempty"`
	Acknowledged   *bool          `json:"acknowledged,omitempty"`
	StartTime      *time.Time     `json:"startTime,omitempty"`
	EndTime        *time.Time     `json:"endTime,omitempty"`
	Limit          int            `json:"limit,omitempty"`
}

// AlertStats represents statistics for alerts
type AlertStats struct {
	Total      int64                         `json:"total"`
	BySeverity map[AlertSeverity]int64       `json:"bySeverity"`
	ByStatus   map[string]int64              `json:"byStatus"` // "acknowledged", "unacknowledged"
	Trends     map[string]float64            `json:"trends"`   // "daily", "weekly", "critical"
}
