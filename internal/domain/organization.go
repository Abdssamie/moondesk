package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// Organization represents an organization (synced from Clerk)
type Organization struct {
	bun.BaseModel `bun:"table:organizations,alias:o"`

	ID        string    `bun:"id,pk" json:"id"` // Clerk organization ID
	Name      string    `bun:"name,notnull" json:"name"`
	Slug      string    `bun:"slug,unique" json:"slug"`
	ImageUrl  string    `bun:"image_url" json:"imageUrl"`
	OwnerID   string    `bun:"owner_id,notnull" json:"ownerId"`
	CreatedAt time.Time `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt time.Time `bun:"updated_at,nullzero,notnull,default:current_timestamp" json:"updatedAt"`

	// Navigation property
	Memberships []*OrganizationMembership `bun:"rel:has-many,join:id=organization_id" json:"memberships,omitempty"`
}

// OrganizationRepository defines the interface for organization persistence
type OrganizationRepository interface {
	Upsert(ctx context.Context, org *Organization) error
	GetByID(ctx context.Context, id string) (*Organization, error)
	UpsertMembership(ctx context.Context, membership *OrganizationMembership) error
	DeleteMembership(ctx context.Context, userID, organizationID string) error
}

// OrganizationMembership represents a user's membership in an organization
type OrganizationMembership struct {
	bun.BaseModel `bun:"table:organization_memberships,alias:om"`

	UserID         string    `bun:"user_id,pk" json:"userId"`
	OrganizationID string    `bun:"organization_id,pk" json:"organizationId"`
	Role           UserRole  `bun:"role,notnull" json:"role"`
	CreatedAt      time.Time `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"createdAt"`

	// Navigation properties
	User         *User         `bun:"rel:belongs-to,join:user_id=id" json:"user,omitempty"`
	Organization *Organization `bun:"rel:belongs-to,join:organization_id=id" json:"organization,omitempty"`
}

// UpsertOrganizationInput represents input for creating/updating an organization
type UpsertOrganizationInput struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Slug     string `json:"slug,omitempty"`
	ImageUrl string `json:"imageUrl,omitempty"`
	OwnerID  string `json:"ownerId"`
}

// UpsertMembershipInput represents input for managing organization membership
type UpsertMembershipInput struct {
	UserID         string   `json:"userId"`
	OrganizationID string   `json:"organizationId"`
	Role           UserRole `json:"role"`
}
