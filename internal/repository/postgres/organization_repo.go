package postgres

import (
	"context"

	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/uptrace/bun"
)

type OrganizationRepo struct {
	db *bun.DB
}

func NewOrganizationRepo(db *bun.DB) *OrganizationRepo {
	return &OrganizationRepo{db: db}
}

func (r *OrganizationRepo) Upsert(ctx context.Context, org *domain.Organization) error {
	_, err := r.db.NewInsert().
		Model(org).
		On("CONFLICT (id) DO UPDATE").
		Set("name = EXCLUDED.name").
		Set("slug = EXCLUDED.slug").
		Set("image_url = EXCLUDED.image_url").
		Set("owner_id = EXCLUDED.owner_id").
		Set("updated_at = EXCLUDED.updated_at").
		Exec(ctx)
	return err
}

func (r *OrganizationRepo) GetByID(ctx context.Context, id string) (*domain.Organization, error) {
	org := new(domain.Organization)
	err := r.db.NewSelect().
		Model(org).
		Where("o.id = ?", id).
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return org, nil
}

func (r *OrganizationRepo) UpsertMembership(ctx context.Context, membership *domain.OrganizationMembership) error {
	_, err := r.db.NewInsert().
		Model(membership).
		On("CONFLICT (user_id, organization_id) DO UPDATE").
		Set("role = EXCLUDED.role").
		Exec(ctx)
	return err
}

func (r *OrganizationRepo) DeleteMembership(ctx context.Context, userID, organizationID string) error {
	_, err := r.db.NewDelete().
		Model((*domain.OrganizationMembership)(nil)).
		Where("user_id = ? AND organization_id = ?", userID, organizationID).
		Exec(ctx)
	return err
}
