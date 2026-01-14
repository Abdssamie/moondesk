package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// ConnectionCredential represents connection credentials for external services
type ConnectionCredential struct {
	bun.BaseModel `bun:"table:connection_credentials,alias:cc"`

	ID                int64             `bun:"id,pk,autoincrement" json:"id"`
	OrganizationID    string            `bun:"organization_id,notnull" json:"organizationId"`
	Name              string            `bun:"name,notnull" json:"name"`
	Protocol          Protocol          `bun:"protocol,notnull" json:"protocol"`
	EndpointUri       string            `bun:"endpoint_uri,notnull" json:"endpointUri"`
	Username          string            `bun:"username,notnull" json:"username"`
	EncryptedPassword string            `bun:"encrypted_password,notnull" json:"-"`
	EncryptionIV      string            `bun:"encryption_iv,notnull" json:"-"`
	ClientID          string            `bun:"client_id" json:"clientId"`
	IsActive          bool              `bun:"is_active,notnull,default:true" json:"isActive"`
	CreatedAt         time.Time         `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt         time.Time         `bun:"updated_at,nullzero,notnull,default:current_timestamp" json:"updatedAt"`
	Metadata          map[string]string `bun:"metadata,type:jsonb" json:"metadata"`
}

// ConnectionCredentialRepository defines the interface for credential persistence
type ConnectionCredentialRepository interface {
	Create(ctx context.Context, credential *ConnectionCredential) error
	GetByID(ctx context.Context, id int64, organizationID string) (*ConnectionCredential, error)
	ListByOrganization(ctx context.Context, organizationID string) ([]ConnectionCredential, error)
	Update(ctx context.Context, credential *ConnectionCredential) error
	Delete(ctx context.Context, id int64, organizationID string) error
}

// CreateCredentialInput represents input for creating connection credentials
type CreateCredentialInput struct {
	OrganizationID string            `json:"organizationId"`
	Name           string            `json:"name"`
	Protocol       Protocol          `json:"protocol"`
	EndpointUri    string            `json:"endpointUri"`
	Username       string            `json:"username"`
	Password       string            `json:"password"` // Plain text, will be encrypted
	ClientID       string            `json:"clientId,omitempty"`
	Metadata       map[string]string `json:"metadata,omitempty"`
}

// UpdateCredentialInput represents input for updating connection credentials
type UpdateCredentialInput struct {
	Name        *string            `json:"name,omitempty"`
	EndpointUri *string            `json:"endpointUri,omitempty"`
	Username    *string            `json:"username,omitempty"`
	Password    *string            `json:"password,omitempty"` // Plain text, will be encrypted
	ClientID    *string            `json:"clientId,omitempty"`
	IsActive    *bool              `json:"isActive,omitempty"`
	Metadata    map[string]string `json:"metadata,omitempty"`
}
