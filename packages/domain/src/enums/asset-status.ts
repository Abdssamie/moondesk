/**
 * Represents the operational status of an asset
 */
export const AssetStatus = {
    Online: 'online',
    Offline: 'offline',
    Maintenance: 'maintenance',
    Error: 'error',
    Unknown: 'unknown',
} as const;

export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus];
