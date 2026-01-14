package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/abdssamie/moondesk-go/internal/config"
	"github.com/abdssamie/moondesk-go/internal/repository"
	"github.com/abdssamie/moondesk-go/internal/repository/postgres"
	"github.com/abdssamie/moondesk-go/internal/service/ingestion"
	"github.com/abdssamie/moondesk-go/internal/worker"
	"github.com/rs/zerolog"
)

func main() {
	// Setup logger
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

	// Load config
	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Fatal().Err(err).Msg("Failed to load config")
	}

	// Set log level
	level, err := zerolog.ParseLevel(cfg.App.LogLevel)
	if err == nil {
		zerolog.SetGlobalLevel(level)
	}

	logger.Info().Msg("Starting Moondesk MQTT Worker")

	// Init DB
	db := repository.NewDB(&cfg.Database)
	defer db.Close()

	// Init Repos
	readingRepo := postgres.NewReadingRepo(db)
	sensorRepo := postgres.NewSensorRepo(db)
	alertRepo := postgres.NewAlertRepo(db)

	// Init Services
	ingestionService := ingestion.NewIngestionService(readingRepo, sensorRepo, alertRepo, logger)

	// Periodic threshold refresh
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := ingestionService.RefreshThresholds(ctx); err != nil {
		logger.Error().Err(err).Msg("Initial threshold refresh failed")
	}

	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				if err := ingestionService.RefreshThresholds(ctx); err != nil {
					logger.Error().Err(err).Msg("Periodic threshold refresh failed")
				}
			case <-ctx.Done():
				return
			}
		}
	}()

	// Init and Start Worker
	mqttWorker := worker.NewMQTTWorker(&cfg.MQTT, ingestionService, logger)
	if err := mqttWorker.Start(ctx); err != nil {
		logger.Fatal().Err(err).Msg("Failed to start MQTT worker")
	}

	// Graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	sig := <-sigChan
	logger.Info().Str("signal", sig.String()).Msg("Shutting down...")

	mqttWorker.Stop()
	cancel()

	logger.Info().Msg("Worker stopped")
}
