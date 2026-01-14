/**
 * Represents the communication protocol used by a sensor or device
 */
export const Protocol = {
    Mqtt: 'mqtt',
    OpcUa: 'opc_ua',
    Modbus: 'modbus',
    Http: 'http',
    BACnet: 'bacnet',
} as const;

export type Protocol = (typeof Protocol)[keyof typeof Protocol];
