package domain

// AlertSeverity represents the severity level of an alert
type AlertSeverity string

const (
	AlertSeverityInfo      AlertSeverity = "info"
	AlertSeverityWarning   AlertSeverity = "warning"
	AlertSeverityCritical  AlertSeverity = "critical"
	AlertSeverityEmergency AlertSeverity = "emergency"
)

// AssetStatus represents the operational status of an asset
type AssetStatus string

const (
	AssetStatusOnline      AssetStatus = "online"
	AssetStatusOffline     AssetStatus = "offline"
	AssetStatusMaintenance AssetStatus = "maintenance"
	AssetStatusError       AssetStatus = "error"
	AssetStatusUnknown     AssetStatus = "unknown"
)

// CommandStatus represents the status of a command sent to a device
type CommandStatus string

const (
	CommandStatusPending      CommandStatus = "pending"
	CommandStatusSent         CommandStatus = "sent"
	CommandStatusAcknowledged CommandStatus = "acknowledged"
	CommandStatusCompleted    CommandStatus = "completed"
	CommandStatusFailed       CommandStatus = "failed"
	CommandStatusTimeout      CommandStatus = "timeout"
)

// Parameter represents the water quality parameter being measured
type Parameter string

const (
	ParameterNone            Parameter = "none"
	ParameterPH              Parameter = "ph"
	ParameterChlorine        Parameter = "chlorine"
	ParameterFluoride        Parameter = "fluoride"
	ParameterDissolvedOxygen Parameter = "dissolved_oxygen"
	ParameterTurbidity       Parameter = "turbidity"
	ParameterTemperature     Parameter = "temperature"
	ParameterConductivity    Parameter = "conductivity"
	ParameterTDS             Parameter = "tds"
	ParameterFlow            Parameter = "flow"
	ParameterPressure        Parameter = "pressure"
	ParameterLevel           Parameter = "level"
	ParameterVibration       Parameter = "vibration"
	ParameterVoltage         Parameter = "voltage"
	ParameterCurrent         Parameter = "current"
	ParameterPower           Parameter = "power"
	ParameterEnergy          Parameter = "energy"
)

// Protocol represents the communication protocol used by a sensor or device
type Protocol string

const (
	ProtocolMqtt   Protocol = "mqtt"
	ProtocolOpcUa  Protocol = "opc_ua"
	ProtocolModbus Protocol = "modbus"
	ProtocolHttp   Protocol = "http"
	ProtocolBACnet Protocol = "bacnet"
)

// ReadingQuality represents the quality/reliability of a sensor reading
type ReadingQuality string

const (
	ReadingQualityGood      ReadingQuality = "good"
	ReadingQualityUncertain ReadingQuality = "uncertain"
	ReadingQualityBad       ReadingQuality = "bad"
	ReadingQualitySimulated ReadingQuality = "simulated"
)

// SensorType represents the type of sensor
type SensorType string

const (
	SensorTypePH                   SensorType = "ph"
	SensorTypeFreeChlorine         SensorType = "free_chlorine"
	SensorTypeTotalChlorine        SensorType = "total_chlorine"
	SensorTypeFluoride             SensorType = "fluoride"
	SensorTypeDissolvedOxygen      SensorType = "dissolved_oxygen"
	SensorTypeTurbidity            SensorType = "turbidity"
	SensorTypeTemperature          SensorType = "temperature"
	SensorTypeConductivity         SensorType = "conductivity"
	SensorTypeTotalDissolvedSolids SensorType = "total_dissolved_solids"
	SensorTypeFlowRate             SensorType = "flow_rate"
	SensorTypePressure             SensorType = "pressure"
	SensorTypeLevel                SensorType = "level"
	SensorTypeVibration            SensorType = "vibration"
	SensorTypeVoltageMeter         SensorType = "voltage_meter"
	SensorTypeCurrentMeter         SensorType = "current_meter"
	SensorTypePowerMeter           SensorType = "power_meter"
	SensorTypeEnergyMeter          SensorType = "energy_meter"
	SensorTypeGeneric              SensorType = "generic"
)

// UserRole represents the role of a user within an organization
type UserRole string

const (
	UserRoleAdmin  UserRole = "admin"
	UserRoleMember UserRole = "member"
	UserRoleViewer UserRole = "viewer"
)
