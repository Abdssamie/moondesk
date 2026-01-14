package domain

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

// User represents a user in the system (synced from Clerk)
type User struct {
	bun.BaseModel `bun:"table:users,alias:u"`

	ID        string    `bun:"id,pk" json:"id"` // Clerk user ID
	Email     string    `bun:"email,notnull,unique" json:"email"`
	Username  string    `bun:"username" json:"username"`
	FirstName string    `bun:"first_name" json:"firstName"`
	LastName  string    `bun:"last_name" json:"lastName"`
	ImageUrl  string    `bun:"image_url" json:"imageUrl"`
	CreatedAt time.Time `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt time.Time `bun:"updated_at,nullzero,notnull,default:current_timestamp" json:"updatedAt"`

	// Navigation property
	Memberships []*OrganizationMembership `bun:"rel:has-many,join:id=user_id" json:"memberships,omitempty"`
}

// UserRepository defines the interface for user persistence
type UserRepository interface {
	Upsert(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id string) (*User, error)
}

// UpsertUserInput represents input for creating/updating a user
type UpsertUserInput struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Username  string `json:"username,omitempty"`
	FirstName string `json:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty"`
	ImageUrl  string `json:"imageUrl,omitempty"`
}
