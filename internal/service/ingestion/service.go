package ingestion

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/abdssamie/moondesk-go/internal/repository/postgres"
	"github.com/rs/zerolog"
)

type IngestionService struct {
	readingRepo *postgres.ReadingRepo
	sensorRepo  *postgres.SensorRepo
	alertRepo   *postgres.AlertRepo
	logger      zerolog.Logger

	thresholdCache sync.Map // map[int64]thresholds
}

type thresholds struct {
	min *float64
	max *float64
}

func NewIngestionService(
	readingRepo *postgres.ReadingRepo,
	sensorRepo *postgres.SensorRepo,
	alertRepo *postgres.AlertRepo,
	logger zerolog.Logger,
) *IngestionService {
	return &IngestionService{
		readingRepo: readingRepo,
		sensorRepo:  sensorRepo,
		alertRepo:   alertRepo,
		logger:      logger.With().Str("service", "ingestion").Logger(),
	}
}

func (s *IngestionService) HandleReading(ctx context.Context, input domain.CreateReadingInput) error {
	reading := &domain.Reading{
		SensorID:       input.SensorID,
		OrganizationID: input.OrganizationID,
		Value:          input.Value,
		Parameter:      input.Parameter,
		Protocol:       input.Protocol,
		Quality:        input.Quality,
		Notes:          input.Notes,
		Metadata:       input.Metadata,
	}

	if input.Timestamp != nil {
		reading.Timestamp = *input.Timestamp
	} else {
		reading.Timestamp = time.Now()
	}

	if reading.Quality == "" {
		reading.Quality = domain.ReadingQualityGood
	}

	err := s.readingRepo.Create(ctx, reading)
	if err != nil {
		return fmt.Errorf("failed to save reading: %w", err)
	}

	s.logger.Debug().Int64("sensor_id", reading.SensorID).Float64("value", reading.Value).Msg("Reading ingested")

	// Check thresholds asynchronously to not block ingestion
	go s.checkThresholds(context.Background(), reading)

	return nil
}

func (s *IngestionService) checkThresholds(ctx context.Context, reading *domain.Reading) {
	var t thresholds
	val, ok := s.thresholdCache.Load(reading.SensorID)
	if !ok {
		// Cache miss, fetch from DB
		sensor, err := s.sensorRepo.GetByID(ctx, reading.SensorID, reading.OrganizationID)
		if err != nil {
			s.logger.Error().Err(err).Int64("sensor_id", reading.SensorID).Msg("Failed to fetch sensor for threshold check")
			return
		}
		t = thresholds{min: sensor.ThresholdLow, max: sensor.ThresholdHigh}
		s.thresholdCache.Store(reading.SensorID, t)
	} else {
		t = val.(thresholds)
	}

	var alertSeverity domain.AlertSeverity
	var alertMessage string
	var thresholdValue *float64

	if t.max != nil && reading.Value > *t.max {
		alertSeverity = domain.AlertSeverityCritical
		alertMessage = fmt.Sprintf("Value %f exceeds maximum threshold %f", reading.Value, *t.max)
		thresholdValue = t.max
	} else if t.min != nil && reading.Value < *t.min {
		alertSeverity = domain.AlertSeverityWarning
		alertMessage = fmt.Sprintf("Value %f below minimum threshold %f", reading.Value, *t.min)
		thresholdValue = t.min
	}

	if alertSeverity != "" {
		alert := &domain.Alert{
			SensorID:       reading.SensorID,
			OrganizationID: reading.OrganizationID,
			Timestamp:      reading.Timestamp,
			Severity:       alertSeverity,
			Message:        alertMessage,
			TriggerValue:   reading.Value,
			ThresholdValue: thresholdValue,
			Protocol:       reading.Protocol,
			Metadata:       make(map[string]string),
		}

		err := s.alertRepo.Create(ctx, alert)
		if err != nil {
			s.logger.Error().Err(err).Int64("sensor_id", reading.SensorID).Msg("Failed to create alert")
			return
		}

		s.logger.Info().
			Int64("sensor_id", reading.SensorID).
			Int64("alert_id", alert.ID).
			Str("severity", string(alertSeverity)).
			Msg("Alert created")
		
		// TODO: Broadcast via WebSocket
	}
}

func (s *IngestionService) RefreshThresholds(ctx context.Context) error {
	sensors, err := s.sensorRepo.ListAll(ctx)
	if err != nil {
		return fmt.Errorf("failed to list sensors for threshold refresh: %w", err)
	}

	for _, sensor := range sensors {
		s.thresholdCache.Store(sensor.ID, thresholds{
			min: sensor.ThresholdLow,
			max: sensor.ThresholdHigh,
		})
	}

	s.logger.Info().Int("count", len(sensors)).Msg("Refreshed sensor threshold cache")
	return nil
}
