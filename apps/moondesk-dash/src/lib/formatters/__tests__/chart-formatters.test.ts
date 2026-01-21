/**
 * Property-based tests for chart formatter utilities.
 * Tests universal properties that should hold for all valid inputs.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  currencyFormatter,
  percentageFormatter,
  unitFormatter,
  compactFormatter,
  decimalFormatter,
  temperatureFormatter,
  energyFormatter,
} from '../chart-formatters';

describe('Property Tests: Chart Formatters', () => {
  /**
   * Feature: tremor-dashboard-migration
   * Property 14: Currency formatter correctness
   * Validates: Requirements 10.1
   */
  it('Property 14: Currency formatter should always return valid format', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1000000, noNaN: true }), (value) => {
        const result = currencyFormatter(value);

        // Should be a non-empty string
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // Should contain only valid characters (digits, commas, periods)
        expect(result).toMatch(/^[\d,\.]+$/);

        // Should be parseable back to a number
        const parsed = parseFloat(result.replace(/,/g, ''));
        expect(parsed).toBeCloseTo(value, 0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tremor-dashboard-migration
   * Property 15: Percentage formatter correctness
   * Validates: Requirements 10.2
   */
  it('Property 15: Percentage formatter should always append %', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 100, noNaN: true }), (value) => {
        const result = percentageFormatter(value);

        // Should be a non-empty string
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // Should end with %
        expect(result).toMatch(/%$/);

        // Should contain the value
        expect(result).toContain(value.toString());

        // Should be parseable back to a number
        const parsed = parseFloat(result.replace('%', ''));
        expect(parsed).toBe(value);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tremor-dashboard-migration
   * Property 16: Unit formatter correctness
   * Validates: Requirements 10.3
   */
  it('Property 16: Unit formatter should append correct unit', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1000, noNaN: true }),
        fc.constantFrom('kWh', '°C', 'MB', 'ms', 'PSI', 'Hz'),
        (value, unit) => {
          const formatter = unitFormatter(unit);
          const result = formatter(value);

          // Should be a non-empty string
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);

          // Should end with the unit
          expect(result).toContain(unit);

          // Should contain the value
          expect(result).toContain(value.toString());

          // Should follow format: "value unit"
          expect(result).toMatch(new RegExp(`^${value} ${unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tremor-dashboard-migration
   * Property 17: Compact number formatter correctness
   * Validates: Requirements 10.4
   */
  it('Property 17: Compact formatter should use compact notation', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1000000000, noNaN: true }), (value) => {
        const result = compactFormatter(value);

        // Should be a non-empty string
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // For large numbers, should contain compact notation (K, M, B, T)
        if (value >= 1000) {
          expect(result).toMatch(/[KMBT]$/);
        }

        // Should contain only valid characters
        expect(result).toMatch(/^[\d.,KMBT]+$/);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tremor-dashboard-migration
   * Property 18: Date formatter consistency (decimal formatter as proxy)
   * Validates: Requirements 10.5
   */
  it('Property 18: Decimal formatter should format consistently', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1000, noNaN: true }),
        fc.integer({ min: 0, max: 5 }),
        (value, decimals) => {
          const formatter = decimalFormatter(decimals);
          const result = formatter(value);

          // Should be a non-empty string
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);

          // Should have correct number of decimal places
          const parts = result.split('.');
          if (decimals === 0) {
            expect(parts.length).toBe(1);
          } else {
            expect(parts.length).toBe(2);
            expect(parts[1].length).toBe(decimals);
          }

          // Should be parseable back to a number
          const parsed = parseFloat(result);
          expect(parsed).toBeCloseTo(value, decimals);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Temperature formatter consistency
   */
  it('Temperature formatter should always format with 1 decimal and °C', () => {
    fc.assert(
      fc.property(fc.float({ min: -50, max: 150, noNaN: true }), (value) => {
        const result = temperatureFormatter(value);

        // Should be a non-empty string
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // Should end with °C
        expect(result).toMatch(/°C$/);

        // Should have exactly 1 decimal place
        const numericPart = result.replace('°C', '');
        const parts = numericPart.split('.');
        expect(parts.length).toBe(2);
        expect(parts[1].length).toBe(1);

        // Should be parseable back to a number
        const parsed = parseFloat(numericPart);
        expect(parsed).toBeCloseTo(value, 1);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Energy formatter consistency
   */
  it('Energy formatter should always format with 2 decimals and kWh', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 10000, noNaN: true }), (value) => {
        const result = energyFormatter(value);

        // Should be a non-empty string
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // Should end with kWh
        expect(result).toMatch(/kWh$/);

        // Should have exactly 2 decimal places
        const numericPart = result.replace(' kWh', '');
        const parts = numericPart.split('.');
        expect(parts.length).toBe(2);
        expect(parts[1].length).toBe(2);

        // Should be parseable back to a number
        const parsed = parseFloat(numericPart);
        expect(parsed).toBeCloseTo(value, 2);
      }),
      { numRuns: 100 }
    );
  });
});
