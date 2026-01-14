/**
 * Represents the severity level of an alert
 */
export const AlertSeverity = {
    Info: 'info',
    Warning: 'warning',
    Critical: 'critical',
    Emergency: 'emergency',
} as const;

export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];
