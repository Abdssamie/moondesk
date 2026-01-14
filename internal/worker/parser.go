package worker

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/abdssamie/moondesk-go/internal/domain"
)

type MqttReading struct {
	SensorID  int64             `json:"sensorId"`
	Value     float64           `json:"value"`
	Timestamp string            `json:"timestamp,omitempty"`
	Parameter domain.Parameter  `json:"parameter,omitempty"`
	Quality   domain.ReadingQuality `json:"quality,omitempty"`
	Metadata  map[string]string `json:"metadata,omitempty"`
}

type MqttBatch struct {
	Readings []MqttReading `json:"readings"`
}

type MqttCommandResponse struct {
	CommandID int64  `json:"commandId"`
	Status    string `json:"status"`
	Result    string `json:"result,omitempty"`
	Error     string `json:"error,omitempty"`
}

type ParsedTopic struct {
	OrganizationID string
	SensorID       int64
	Action         string // readings, batch, status, command-response
}

func ParseTopic(topic string) (*ParsedTopic, error) {
	parts := strings.Split(topic, "/")

	// Expected: moondesk/{orgId}/sensors/{sensorId}/{action}
	if len(parts) < 5 || parts[0] != "moondesk" || parts[2] != "sensors" {
		return nil, fmt.Errorf("invalid topic format")
	}

	orgID := parts[1]
	sensorID, err := strconv.ParseInt(parts[3], 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid sensor id in topic")
	}

	action := parts[4]

	return &ParsedTopic{
		OrganizationID: orgID,
		SensorID:       sensorID,
		Action:         action,
	}, nil
}

func ParseMessage(payload []byte, action string) (interface{}, error) {
	switch action {
	case "readings":
		var msg MqttReading
		if err := json.Unmarshal(payload, &msg); err != nil {
			return nil, err
		}
		return msg, nil
	case "batch":
		var msg MqttBatch
		if err := json.Unmarshal(payload, &msg); err != nil {
			return nil, err
		}
		return msg, nil
	case "command-response":
		var msg MqttCommandResponse
		if err := json.Unmarshal(payload, &msg); err != nil {
			return nil, err
		}
		return msg, nil
	default:
		return nil, fmt.Errorf("unhandled action: %s", action)
	}
}
