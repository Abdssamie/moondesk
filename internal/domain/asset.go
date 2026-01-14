package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// Asset represents an industrial asset (machine, equipment, facility) being monitored
type Asset struct {
	bun.BaseModel `bun:"table:assets,alias:a"`

	ID               int64             `bun:"id,pk,autoincrement" json:"id"`
	OrganizationID   string            `bun:"organization_id,notnull" json:"organizationId"`
	Name             string            `bun:"name,notnull" json:"name"`
	Type             string            `bun:"type,notnull" json:"type"` // e.g., "Pump", "Tank", "Valve", "Compressor"
	Location         string            `bun:"location" json:"location"`
	Status           AssetStatus       `bun:"status,notnull" json:"status"`
	LastSeen         *time.Time        `bun:"last_seen" json:"lastSeen"`
	Description      string            `bun:"description" json:"description"`
	Manufacturer     string            `bun:"manufacturer" json:"manufacturer"`
	ModelNumber      string            `bun:"model_number" json:"modelNumber"`
	InstallationDate *time.Time        `bun:"installation_date" json:"installationDate"`
	Metadata         map[string]string `bun:"metadata,type:jsonb" json:"metadata"`
	CreatedAt        time.Time         `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt        time.Time         `bun:"updated_at,nullzero,notnull,default:current_timestamp" json:"updatedAt"`

	// Navigation properties
	Sensors []*Sensor `bun:"rel:has-many,join:id=asset_id" json:"sensors,omitempty"`
}

// AssetRepository defines the interface for asset persistence
type AssetRepository interface {
	Create(ctx context.Context, asset *Asset) error
	GetByID(ctx context.Context, id int64, organizationID string) (*Asset, error)
	ListByOrganization(ctx context.Context, organizationID string) ([]Asset, error)
	Update(ctx context.Context, asset *Asset) error
	Delete(ctx context.Context, id int64, organizationID string) error
}

// CreateAssetInput represents input for creating a new asset
type CreateAssetInput struct {
	OrganizationID   string            `json:"organizationId"`
	Name             string            `json:"name"`
	Type             string            `json:"type"`
	Location         string            `json:"location"`
	Status           AssetStatus       `json:"status"`
	Description      string            `json:"description,omitempty"`
	Manufacturer     string            `json:"manufacturer,omitempty"`
	ModelNumber      string            `json:"modelNumber,omitempty"`
	InstallationDate *time.Time        `json:"installationDate,omitempty"`
	Metadata         map[string]string `json:"metadata,omitempty"`
}

// UpdateAssetInput represents input for updating an existing asset
type UpdateAssetInput struct {
	Name             *string            `json:"name,omitempty"`
	Type             *string            `json:"type,omitempty"`
	Location         *string            `json:"location,omitempty"`
	Status           *AssetStatus       `json:"status,omitempty"`
	Description      *string            `json:"description,omitempty"`
	Manufacturer     *string            `json:"manufacturer,omitempty"`
	ModelNumber      *string            `json:"modelNumber,omitempty"`
	InstallationDate *time.Time         `json:"installationDate,omitempty"`
	Metadata         map[string]string `json:"metadata,omitempty"`
}
