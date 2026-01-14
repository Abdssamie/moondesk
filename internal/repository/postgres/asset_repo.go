package postgres

import (
	"context"

	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/uptrace/bun"
)

type AssetRepo struct {
	db *bun.DB
}

func NewAssetRepo(db *bun.DB) *AssetRepo {
	return &AssetRepo{db: db}
}

func (r *AssetRepo) Create(ctx context.Context, asset *domain.Asset) error {
	_, err := r.db.NewInsert().Model(asset).Exec(ctx)
	return err
}

func (r *AssetRepo) GetByID(ctx context.Context, id int64, organizationID string) (*domain.Asset, error) {
	asset := new(domain.Asset)
	err := r.db.NewSelect().
		Model(asset).
		Where("id = ? AND organization_id = ?", id, organizationID).
		Relation("Sensors").
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return asset, nil
}

func (r *AssetRepo) ListByOrganization(ctx context.Context, organizationID string) ([]domain.Asset, error) {
	var assets []domain.Asset
	err := r.db.NewSelect().
		Model(&assets).
		Where("organization_id = ?", organizationID).
		Scan(ctx)
	return assets, err
}

func (r *AssetRepo) Update(ctx context.Context, asset *domain.Asset) error {
	_, err := r.db.NewUpdate().
		Model(asset).
		WherePK().
		Exec(ctx)
	return err
}

func (r *AssetRepo) Delete(ctx context.Context, id int64, organizationID string) error {
	_, err := r.db.NewDelete().
		Model((*domain.Asset)(nil)).
		Where("id = ? AND organization_id = ?", id, organizationID).
		Exec(ctx)
	return err
}
