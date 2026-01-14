import { SimulationProfile } from './types';

/**
 * Generate a value based on the simulation profile and current time
 */
export function generateValue(profile: SimulationProfile, timestamp: number): number {
    const { waveform, min, max, frequency, noise, offset = 0 } = profile;
    const timeSec = timestamp / 1000;
    const amplitude = (max - min) / 2;
    const center = min + amplitude;

    let baseValue = 0;

    switch (waveform) {
        case 'sine':
            baseValue = center + amplitude * Math.sin(2 * Math.PI * frequency * timeSec);
            break;
        case 'cosine':
            baseValue = center + amplitude * Math.cos(2 * Math.PI * frequency * timeSec);
            break;
        case 'triangle': {
            const period = 1 / frequency;
            const t = (timeSec % period) / period;
            baseValue = center + amplitude * (2 * Math.abs(2 * t - 1) - 1);
            break;
        }
        case 'sawtooth': {
            const period = 1 / frequency;
            const t = (timeSec % period) / period;
            baseValue = min + (max - min) * t;
            break;
        }
        case 'square':
            baseValue = Math.sin(2 * Math.PI * frequency * timeSec) >= 0 ? max : min;
            break;
        case 'random':
            baseValue = min + Math.random() * (max - min);
            break;
        case 'constant':
            baseValue = center; // or just offset? let's stick to center + offset logic if needed
            if (offset !== 0) baseValue = offset; // override if explicit offset given for constant
            else baseValue = (min + max) / 2;
            break;
        case 'linear':
            // For linear, we use 'max' as the rate (slope) and 'min' as the starting value (intercept)
            // Value = start + slope * time
            // To prevent unbounded growth in simple tests, we might want to modulo it or just let it grow.
            // Requirement mentions "Energy consumption (increasing)", so unbounded growth is expected.
            // However, timeSec is absolute simulation time? Or request time?
            // Usually simulators run indefinitely. Let's assume linear is strictly T * slope + offset
            // We use 'max' field for slope, 'min' for initial value.
            baseValue = min + max * timeSec;
            break;
    }

    // Add noise
    if (noise > 0) {
        const noiseValue = (Math.random() - 0.5) * 2 * noise;
        baseValue += noiseValue;
    }

    // Apply global offset if not constant (already handled)
    if (waveform !== 'constant' && offset) {
        baseValue += offset;
    }

    // Clamping just in case noise pushed it way out? 
    // Actually real sensors might go out of range, so let's allow it to float unless explicitly clamped.
    // But usually we want some boundaries. Let's return raw value for now.

    return Number(baseValue.toFixed(4));
}
