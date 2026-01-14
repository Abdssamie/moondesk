package postgres

import (
	"context"

	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/uptrace/bun"
)

type SensorRepo struct {
	db *bun.DB
}

func NewSensorRepo(db *bun.DB) *SensorRepo {
	return &SensorRepo{db: db}
}

func (r *SensorRepo) Create(ctx context.Context, sensor *domain.Sensor) error {
	_, err := r.db.NewInsert().Model(sensor).Exec(ctx)
	return err
}

func (r *SensorRepo) GetByID(ctx context.Context, id int64, organizationID string) (*domain.Sensor, error) {
	sensor := new(domain.Sensor)
	err := r.db.NewSelect().
		Model(sensor).
		Where("s.id = ? AND s.organization_id = ?", id, organizationID).
		Relation("Asset").
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return sensor, nil
}

func (r *SensorRepo) ListByAsset(ctx context.Context, assetID int64, organizationID string) ([]domain.Sensor, error) {
	var sensors []domain.Sensor
	err := r.db.NewSelect().
		Model(&sensors).
		Where("asset_id = ? AND organization_id = ?", assetID, organizationID).
		Scan(ctx)
	return sensors, err
}

func (r *SensorRepo) ListByOrganization(ctx context.Context, organizationID string) ([]domain.Sensor, error) {
	var sensors []domain.Sensor
	err := r.db.NewSelect().
		Model(&sensors).
		Where("organization_id = ?", organizationID).
		Scan(ctx)
	return sensors, err
}

func (r *SensorRepo) ListAll(ctx context.Context) ([]domain.Sensor, error) {
	var sensors []domain.Sensor
	err := r.db.NewSelect().
		Model(&sensors).
		Scan(ctx)
	return sensors, err
}

func (r *SensorRepo) Update(ctx context.Context, sensor *domain.Sensor) error {
	_, err := r.db.NewUpdate().
		Model(sensor).
		WherePK().
		Exec(ctx)
	return err
}

func (r *SensorRepo) Delete(ctx context.Context, id int64, organizationID string) error {
	_, err := r.db.NewDelete().
		Model((*domain.Sensor)(nil)).
		Where("id = ? AND organization_id = ?", id, organizationID).
		Exec(ctx)
	return err
}
