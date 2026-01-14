package postgres

import (
	"context"

	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/uptrace/bun"
)

type AlertRepo struct {
	db *bun.DB
}

func NewAlertRepo(db *bun.DB) *AlertRepo {
	return &AlertRepo{db: db}
}

func (r *AlertRepo) Create(ctx context.Context, alert *domain.Alert) error {
	_, err := r.db.NewInsert().Model(alert).Exec(ctx)
	return err
}

func (r *AlertRepo) GetByID(ctx context.Context, id int64, organizationID string) (*domain.Alert, error) {
	alert := new(domain.Alert)
	err := r.db.NewSelect().
		Model(alert).
		Where("al.id = ? AND al.organization_id = ?", id, organizationID).
		Relation("Sensor").
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return alert, nil
}

func (r *AlertRepo) List(ctx context.Context, params domain.AlertQueryParams) ([]domain.Alert, error) {
	var alerts []domain.Alert
	query := r.db.NewSelect().Model(&alerts).Where("organization_id = ?", params.OrganizationID)

	if params.SensorID != nil {
		query = query.Where("sensor_id = ?", *params.SensorID)
	}
	if params.Severity != nil {
		query = query.Where("severity = ?", *params.Severity)
	}
	if params.Acknowledged != nil {
		query = query.Where("acknowledged = ?", *params.Acknowledged)
	}
	if params.StartTime != nil {
		query = query.Where("timestamp >= ?", *params.StartTime)
	}
	if params.EndTime != nil {
		query = query.Where("timestamp <= ?", *params.EndTime)
	}

	query = query.Order("timestamp DESC")

	if params.Limit > 0 {
		query = query.Limit(params.Limit)
	}

	err := query.Scan(ctx)
	return alerts, err
}

func (r *AlertRepo) Update(ctx context.Context, alert *domain.Alert) error {
	_, err := r.db.NewUpdate().
		Model(alert).
		WherePK().
		Exec(ctx)
	return err
}

func (r *AlertRepo) GetStats(ctx context.Context, organizationID string) (*domain.AlertStats, error) {
	// Placeholder for complex stats query
	return &domain.AlertStats{}, nil
}
