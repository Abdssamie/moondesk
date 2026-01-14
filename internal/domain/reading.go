package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// Reading represents a single time-series reading from a sensor
type Reading struct {
	bun.BaseModel `bun:"table:readings,alias:r"`

	SensorID       int64             `bun:"sensor_id,pk,notnull" json:"sensorId"`
	OrganizationID string            `bun:"organization_id,notnull" json:"organizationId"`
	Timestamp      time.Time         `bun:"timestamp,pk,notnull,default:current_timestamp" json:"timestamp"`
	Value          float64           `bun:"value,notnull" json:"value"`
	Parameter      Parameter         `bun:"parameter,notnull" json:"parameter"`
	Protocol       Protocol          `bun:"protocol,notnull" json:"protocol"`
	Quality        ReadingQuality    `bun:"quality,notnull,default:'good'" json:"quality"`
	Notes          string            `bun:"notes" json:"notes"`
	Metadata       map[string]string `bun:"metadata,type:jsonb" json:"metadata"`

	// Navigation property
	Sensor *Sensor `bun:"rel:belongs-to,join:sensor_id=id" json:"sensor,omitempty"`
}

// ReadingRepository defines the interface for reading persistence
type ReadingRepository interface {
	Create(ctx context.Context, reading *Reading) error
	List(ctx context.Context, params ReadingQueryParams) ([]Reading, error)
	GetAggregated(ctx context.Context, params ReadingQueryParams) ([]AggregatedReading, error)
}

// CreateReadingInput represents input for creating a new reading
type CreateReadingInput struct {
	SensorID       int64             `json:"sensorId"`
	OrganizationID string            `json:"organizationId"`
	Timestamp      *time.Time        `json:"timestamp,omitempty"`
	Value          float64           `json:"value"`
	Parameter      Parameter         `json:"parameter"`
	Protocol       Protocol          `json:"protocol"`
	Quality        ReadingQuality    `json:"quality,omitempty"`
	Notes          string            `json:"notes,omitempty"`
	Metadata       map[string]string `json:"metadata,omitempty"`
}

// ReadingQueryParams represents query parameters for fetching readings
type ReadingQueryParams struct {
	SensorID       *int64     `json:"sensorId,omitempty"`
	OrganizationID string     `json:"organizationId"`
	StartTime      *time.Time `json:"startTime,omitempty"`
	EndTime        *time.Time `json:"endTime,omitempty"`
	Limit          int        `json:"limit,omitempty"`
	Aggregation    string     `json:"aggregation,omitempty"`    // 'raw' | 'avg' | 'min' | 'max' | 'count'
	BucketInterval string     `json:"bucketInterval,omitempty"` // e.g., '1 hour', '1 day'
}

// AggregatedReading represents an aggregated reading result
type AggregatedReading struct {
	Bucket   time.Time `json:"bucket"`
	SensorID int64     `json:"sensorId"`
	Avg      *float64  `json:"avg"`
	Min      *float64  `json:"min"`
	Max      *float64  `json:"max"`
	Count    int64     `json:"count"`
}
