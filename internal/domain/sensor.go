package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// Sensor represents a sensor attached to an asset
type Sensor struct {
	bun.BaseModel `bun:"table:sensors,alias:s"`

	ID                 int64             `bun:"id,pk,autoincrement" json:"id"`
	AssetID            int64             `bun:"asset_id,notnull" json:"assetId"`
	OrganizationID     string            `bun:"organization_id,notnull" json:"organizationId"`
	Name               string            `bun:"name,notnull" json:"name"`
	Type               SensorType        `bun:"type,notnull" json:"type"`
	Parameter          Parameter         `bun:"parameter,notnull" json:"parameter"`
	Unit               string            `bun:"unit,notnull" json:"unit"` // e.g., "°C", "PSI", "Hz", "L/min"
	ThresholdLow       *float64          `bun:"threshold_low" json:"thresholdLow"`
	ThresholdHigh      *float64          `bun:"threshold_high" json:"thresholdHigh"`
	MinValue           *float64          `bun:"min_value" json:"minValue"`
	MaxValue           *float64          `bun:"max_value" json:"maxValue"`
	SamplingIntervalMs int               `bun:"sampling_interval_ms,notnull,default:1000" json:"samplingIntervalMs"`
	IsActive           bool              `bun:"is_active,notnull,default:true" json:"isActive"`
	Protocol           Protocol          `bun:"protocol,notnull" json:"protocol"`
	Description        string            `bun:"description" json:"description"`
	Metadata           map[string]string `bun:"metadata,type:jsonb" json:"metadata"`
	CreatedAt          time.Time         `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt          time.Time         `bun:"updated_at,nullzero,notnull,default:current_timestamp" json:"updatedAt"`

	// Navigation properties
	Asset    *Asset     `bun:"rel:belongs-to,join:asset_id=id" json:"asset,omitempty"`
	Readings []*Reading `bun:"rel:has-many,join:id=sensor_id" json:"readings,omitempty"`
	Alerts   []*Alert   `bun:"rel:has-many,join:id=sensor_id" json:"alerts,omitempty"`
	Commands []*Command `bun:"rel:has-many,join:id=sensor_id" json:"commands,omitempty"`
}

// SensorRepository defines the interface for sensor persistence
type SensorRepository interface {
	Create(ctx context.Context, sensor *Sensor) error
	GetByID(ctx context.Context, id int64, organizationID string) (*Sensor, error)
	ListByAsset(ctx context.Context, assetID int64, organizationID string) ([]Sensor, error)
	ListByOrganization(ctx context.Context, organizationID string) ([]Sensor, error)
	ListAll(ctx context.Context) ([]Sensor, error)
	Update(ctx context.Context, sensor *Sensor) error
	Delete(ctx context.Context, id int64, organizationID string) error
}

// CreateSensorInput represents input for creating a new sensor
type CreateSensorInput struct {
	AssetID            int64             `json:"assetId"`
	OrganizationID     string            `json:"organizationId"`
	Name               string            `json:"name"`
	Type               SensorType        `json:"type"`
	Parameter          Parameter         `json:"parameter"`
	Unit               string            `json:"unit"`
	ThresholdLow       *float64          `json:"thresholdLow,omitempty"`
	ThresholdHigh      *float64          `json:"thresholdHigh,omitempty"`
	MinValue           *float64          `json:"minValue,omitempty"`
	MaxValue           *float64          `json:"maxValue,omitempty"`
	SamplingIntervalMs int               `json:"samplingIntervalMs,omitempty"`
	IsActive           bool              `json:"isActive,omitempty"`
	Protocol           Protocol          `json:"protocol"`
	Description        string            `json:"description,omitempty"`
	Metadata           map[string]string `json:"metadata,omitempty"`
}

// UpdateSensorInput represents input for updating an existing sensor
type UpdateSensorInput struct {
	Name               *string           `json:"name,omitempty"`
	Type               *SensorType       `json:"type,omitempty"`
	Parameter          *Parameter        `json:"parameter,omitempty"`
	Unit               *string           `json:"unit,omitempty"`
	ThresholdLow       *float64          `json:"thresholdLow,omitempty"`
	ThresholdHigh      *float64          `json:"thresholdHigh,omitempty"`
	MinValue           *float64          `json:"minValue,omitempty"`
	MaxValue           *float64          `json:"maxValue,omitempty"`
	SamplingIntervalMs *int              `json:"samplingIntervalMs,omitempty"`
	IsActive           *bool             `json:"isActive,omitempty"`
	Protocol           *Protocol         `json:"protocol,omitempty"`
	Description        *string           `json:"description,omitempty"`
	Metadata           map[string]string `json:"metadata,omitempty"`
}
