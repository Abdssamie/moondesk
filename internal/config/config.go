package config

import (
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	App      AppConfig      `mapstructure:"app"`
	Database DatabaseConfig `mapstructure:"database"`
	MQTT     MQTTConfig     `mapstructure:"mqtt"`
}

type AppConfig struct {
	Port        string `mapstructure:"port"`
	Environment string `mapstructure:"environment"`
	LogLevel    string `mapstructure:"log_level"`
}

type DatabaseConfig struct {
	DSN string `mapstructure:"dsn"`
}

type MQTTConfig struct {
	Broker   string `mapstructure:"broker"`
	Username string `mapstructure:"username"`
	Password string `mapstructure:"password"`
	ClientID string `mapstructure:"client_id"`
}

func LoadConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./internal/config")

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	// Defaults
	viper.SetDefault("app.port", "8080")
	viper.SetDefault("app.environment", "development")
	viper.SetDefault("app.log_level", "info")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
		// It's okay if config file doesn't exist, we fallback to defaults/env
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}
