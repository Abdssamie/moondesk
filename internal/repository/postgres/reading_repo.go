package postgres

import (
	"context"

	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/uptrace/bun"
)

type ReadingRepo struct {
	db *bun.DB
}

func NewReadingRepo(db *bun.DB) *ReadingRepo {
	return &ReadingRepo{db: db}
}

func (r *ReadingRepo) Create(ctx context.Context, reading *domain.Reading) error {
	_, err := r.db.NewInsert().Model(reading).Exec(ctx)
	return err
}

func (r *ReadingRepo) List(ctx context.Context, params domain.ReadingQueryParams) ([]domain.Reading, error) {
	var readings []domain.Reading
	query := r.db.NewSelect().Model(&readings).Where("organization_id = ?", params.OrganizationID)

	if params.SensorID != nil {
		query = query.Where("sensor_id = ?", *params.SensorID)
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
	} else {
		query = query.Limit(100)
	}

	err := query.Scan(ctx)
	return readings, err
}

func (r *ReadingRepo) GetAggregated(ctx context.Context, params domain.ReadingQueryParams) ([]domain.AggregatedReading, error) {
	var results []domain.AggregatedReading

	// Simple aggregation example using Bun's raw query or building with TimescaleDB's time_bucket
	// This would typically use time_bucket(params.BucketInterval, timestamp)
	
	// For now, let's just provide a placeholder for the logic as full TimescaleDB aggregation 
	// often requires more complex SQL than a simple ORM select.
	
	query := r.db.NewSelect().
		Model((*domain.Reading)(nil)).
		ColumnExpr("time_bucket(?, timestamp) AS bucket", params.BucketInterval).
		Column("sensor_id").
		ColumnExpr("avg(value) AS avg").
		ColumnExpr("min(value) AS min").
		ColumnExpr("max(value) AS max").
		ColumnExpr("count(*) AS count").
		Where("organization_id = ?", params.OrganizationID)

	if params.SensorID != nil {
		query = query.Where("sensor_id = ?", *params.SensorID)
	}
	if params.StartTime != nil {
		query = query.Where("timestamp >= ?", *params.StartTime)
	}
	if params.EndTime != nil {
		query = query.Where("timestamp <= ?", *params.EndTime)
	}

	query = query.GroupExpr("bucket, sensor_id").Order("bucket DESC")

	err := query.Scan(ctx, &results)
	return results, err
}
