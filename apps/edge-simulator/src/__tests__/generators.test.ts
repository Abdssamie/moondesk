
import { describe, it, expect } from 'vitest';
import { generateValue } from '../generators';
import { SimulationProfile } from '../types';
import { Parameter } from '@moondesk/domain';

// Helper to create a basic profile
const createProfile = (overrides: Partial<SimulationProfile> = {}): SimulationProfile => ({
    waveform: 'constant',
    min: 0,
    max: 10,
    frequency: 1,
    noise: 0,
    parameter: Parameter.None,
    ...overrides
});

describe('generateValue', () => {
    it('should generate constant value correctly', () => {
        const profile = createProfile({ waveform: 'constant', min: 10, max: 10, noise: 0 });
        const val = generateValue(profile, 0);
        expect(val).toBe(10);
    });

    it('should respect explicit offset in constant waveform', () => {
        const profile = createProfile({ waveform: 'constant', offset: 42, noise: 0 });
        const val = generateValue(profile, 0);
        expect(val).toBe(42);
    });

    it('should generate linear values correctly', () => {
        const profile = createProfile({ waveform: 'linear', min: 10, max: 2, noise: 0 }); // start 10, slope 2 (max used as slope)
        // t=0 => 10
        expect(generateValue(profile, 0)).toBe(10);
        // t=1s (1000ms) => 12
        expect(generateValue(profile, 1000)).toBe(12);
        // t=10s (10000ms) => 30
        expect(generateValue(profile, 10000)).toBe(30);
    });

    it('should generate sine wave within min/max bounds (ignoring noise)', () => {
        const profile = createProfile({ waveform: 'sine', min: -10, max: 10, frequency: 1, noise: 0 });
        // t=0, sin(0)=0. Base value is center (0) + 0 = 0?
        // Let's check impl: baseValue = center + amplitude * sin(...)
        // center = (-10+10)/2 = 0. amplitude = (10 - -10)/2 = 10.
        // t=0 -> 0 
        expect(generateValue(profile, 0)).toBe(0);

        // t=0.25s (250ms) -> sin(2pi * 1 * 0.25) = 1. Val = 10.
        expect(generateValue(profile, 250)).toBe(10);

        // t=0.75s (750ms) -> sin(2pi * 1 * 0.75) = -1. Val = -10.
        expect(generateValue(profile, 750)).toBe(-10);
    });

    it('should return number with max 4 decimal places', () => {
        const profile = createProfile({ waveform: 'random', min: 0, max: 1, noise: 0.123456 });
        const val = generateValue(profile, 0);
        // Check string representation length logic or just formatting check
        const decimalPart = val.toString().split('.')[1];
        if (decimalPart) {
            expect(decimalPart.length).toBeLessThanOrEqual(4);
        }
    });
});
