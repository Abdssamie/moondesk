package postgres

import (
	"context"

	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/uptrace/bun"
)

type UserRepo struct {
	db *bun.DB
}

func NewUserRepo(db *bun.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Upsert(ctx context.Context, user *domain.User) error {
	_, err := r.db.NewInsert().
		Model(user).
		On("CONFLICT (id) DO UPDATE").
		Set("email = EXCLUDED.email").
		Set("username = EXCLUDED.username").
		Set("first_name = EXCLUDED.first_name").
		Set("last_name = EXCLUDED.last_name").
		Set("image_url = EXCLUDED.image_url").
		Set("updated_at = EXCLUDED.updated_at").
		Exec(ctx)
	return err
}

func (r *UserRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {
	user := new(domain.User)
	err := r.db.NewSelect().
		Model(user).
		Where("u.id = ?", id).
		Relation("Memberships").
		Relation("Memberships.Organization").
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return user, nil
}
