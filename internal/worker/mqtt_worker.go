package worker

import (
	"context"
	"time"

	"github.com/abdssamie/moondesk-go/internal/config"
	"github.com/abdssamie/moondesk-go/internal/domain"
	"github.com/abdssamie/moondesk-go/internal/service/ingestion"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/rs/zerolog"
)

type MQTTWorker struct {
	client           mqtt.Client
	ingestionService *ingestion.IngestionService
	logger           zerolog.Logger
	cfg              *config.MQTTConfig
}

func NewMQTTWorker(
	cfg *config.MQTTConfig,
	ingestionService *ingestion.IngestionService,
	logger zerolog.Logger,
) *MQTTWorker {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(cfg.Broker)
	opts.SetClientID(cfg.ClientID)
	opts.SetUsername(cfg.Username)
	opts.SetPassword(cfg.Password)
	opts.SetCleanSession(true)
	opts.SetAutoReconnect(true)
	opts.SetMaxReconnectInterval(5 * time.Second)

	w := &MQTTWorker{
		ingestionService: ingestionService,
		logger:           logger.With().Str("worker", "mqtt").Logger(),
		cfg:              cfg,
	}

	opts.SetDefaultPublishHandler(w.handleMessage)
	opts.OnConnect = func(c mqtt.Client) {
		w.logger.Info().Msg("Connected to MQTT broker")
		w.subscribe()
	}
	opts.OnConnectionLost = func(c mqtt.Client, err error) {
		w.logger.Warn().Err(err).Msg("Lost connection to MQTT broker")
	}

	w.client = mqtt.NewClient(opts)
	return w
}

func (w *MQTTWorker) Start(ctx context.Context) error {
	w.logger.Info().Str("broker", w.cfg.Broker).Msg("Connecting to MQTT broker")
	if token := w.client.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	return nil
}

func (w *MQTTWorker) Stop() {
	w.client.Disconnect(250)
	w.logger.Info().Msg("Disconnected from MQTT broker")
}

func (w *MQTTWorker) subscribe() {
	topic := "moondesk/+/sensors/+/#"
	token := w.client.Subscribe(topic, 1, nil)
	token.Wait()
	if token.Error() != nil {
		w.logger.Error().Err(token.Error()).Str("topic", topic).Msg("Failed to subscribe")
	} else {
		w.logger.Info().Str("topic", topic).Msg("Subscribed to topic")
	}
}

func (w *MQTTWorker) handleMessage(client mqtt.Client, msg mqtt.Message) {
	topic := msg.Topic()
	payload := msg.Payload()

	parsed, err := ParseTopic(topic)
	if err != nil {
		w.logger.Warn().Err(err).Str("topic", topic).Msg("Received message on unhandled topic")
		return
	}

	switch parsed.Action {
	case "readings":
		w.handleReading(parsed, payload)
	case "batch":
		w.handleBatch(parsed, payload)
	case "command-response":
		w.handleCommandResponse(parsed, payload)
	default:
		w.logger.Debug().Str("action", parsed.Action).Msg("Unhandled action")
	}
}

func (w *MQTTWorker) handleReading(parsed *ParsedTopic, payload []byte) {
	msgObj, err := ParseMessage(payload, "readings")
	if err != nil {
		w.logger.Error().Err(err).Msg("Failed to parse reading message")
		return
	}

	m := msgObj.(MqttReading)

	input := domain.CreateReadingInput{
		SensorID:       parsed.SensorID,
		OrganizationID: parsed.OrganizationID,
		Value:          m.Value,
		Parameter:      m.Parameter,
		Protocol:       domain.ProtocolMqtt,
		Quality:        m.Quality,
		Metadata:       m.Metadata,
	}

	if m.Timestamp != "" {
		t, err := time.Parse(time.RFC3339, m.Timestamp)
		if err == nil {
			input.Timestamp = &t
		}
	}

	if input.Parameter == "" {
		input.Parameter = domain.ParameterNone
	}

	ctx := context.Background()
	if err := w.ingestionService.HandleReading(ctx, input); err != nil {
		w.logger.Error().Err(err).Int64("sensor_id", parsed.SensorID).Msg("Failed to process reading")
	}
}

func (w *MQTTWorker) handleBatch(parsed *ParsedTopic, payload []byte) {
	msgObj, err := ParseMessage(payload, "batch")
	if err != nil {
		w.logger.Error().Err(err).Msg("Failed to parse batch message")
		return
	}

	batch := msgObj.(MqttBatch)
	ctx := context.Background()

	for _, m := range batch.Readings {
		input := domain.CreateReadingInput{
			SensorID:       m.SensorID,
			OrganizationID: parsed.OrganizationID,
			Value:          m.Value,
			Parameter:      m.Parameter,
			Protocol:       domain.ProtocolMqtt,
			Quality:        m.Quality,
			Metadata:       m.Metadata,
		}

		if m.SensorID == 0 {
			input.SensorID = parsed.SensorID
		}

		if m.Timestamp != "" {
			t, err := time.Parse(time.RFC3339, m.Timestamp)
			if err == nil {
				input.Timestamp = &t
			}
		}

		if input.Parameter == "" {
			input.Parameter = domain.ParameterNone
		}

		if err := w.ingestionService.HandleReading(ctx, input); err != nil {
			w.logger.Error().Err(err).Int64("sensor_id", input.SensorID).Msg("Failed to process batch reading")
		}
	}
}

func (w *MQTTWorker) handleCommandResponse(parsed *ParsedTopic, payload []byte) {
	// Implementation for command response
	w.logger.Info().Int64("sensor_id", parsed.SensorID).Msg("Received command response")
}
