package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	_ "github.com/abdssamie/moondesk-go/docs" // Import generated docs
	"github.com/abdssamie/moondesk-go/internal/config"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// @title Moondesk API
// @version 1.0
// @description High-throughput IoT ingestion and management platform.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.email support@moondesk.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /
func main() {
	// 1. Load Configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load configuration")
	}

	// 2. Setup Logger
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	if cfg.App.Environment == "development" {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})
	}
	level, err := zerolog.ParseLevel(cfg.App.LogLevel)
	if err == nil {
		zerolog.SetGlobalLevel(level)
	}

	// 3. Setup Echo
	e := echo.New()
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogURI:    true,
		LogStatus: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			log.Info().
				Str("URI", v.URI).
				Int("status", v.Status).
				Msg("request")
			return nil
		},
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// 4. Routes
	// @Summary Health Check
	// @Description Checks if the server is running
	// @Tags system
	// @Produce json
	// @Success 200 {object} map[string]string
	// @Router /health [get]
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "up",
			"env":    cfg.App.Environment,
		})
	})

	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// 5. Start Server
	go func() {
		if err := e.Start(":" + cfg.App.Port); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("shutting down the server")
		}
	}()
	log.Info().Msgf("Server started on port %s", cfg.App.Port)

	// 6. Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}
