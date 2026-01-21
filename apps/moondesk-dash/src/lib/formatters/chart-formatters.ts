/**
 * Chart value formatter utilities for Tremor components.
 * Provides consistent data formatting across all dashboard visualizations.
 */

/**
 * Formats a number as currency (USD).
 * Uses Intl.NumberFormat for locale-aware currency formatting.
 *
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 *
 * @example
 * currencyFormatter(1234.56) // "$1,235"
 * currencyFormatter(1000000) // "$1,000,000"
 */
export const currencyFormatter = (value: number): string => {
  return `${Intl.NumberFormat("us").format(value).toString()}`;
};

/**
 * Formats a number as a percentage.
 * Appends the percentage symbol to the value.
 *
 * @param value - The numeric value to format (e.g., 45 for 45%)
 * @returns Formatted percentage string (e.g., "45%")
 *
 * @example
 * percentageFormatter(45) // "45%"
 * percentageFormatter(99.5) // "99.5%"
 */
export const percentageFormatter = (value: number): string => {
  return `${value}%`;
};

/**
 * Creates a formatter function that appends a unit suffix to values.
 * Factory function for creating unit-specific formatters.
 *
 * @param unit - The unit label to append (e.g., "kWh", "°C", "PSI")
 * @returns A formatter function that appends the unit to values
 *
 * @example
 * const energyFormatter = unitFormatter('kWh');
 * energyFormatter(123.45) // "123.45 kWh"
 *
 * const pressureFormatter = unitFormatter('PSI');
 * pressureFormatter(50) // "50 PSI"
 */
export const unitFormatter =
  (unit: string) =>
  (value: number): string => {
    return `${value} ${unit}`;
  };

/**
 * Formats large numbers using compact notation.
 * Converts numbers to abbreviated form (K, M, B, T).
 *
 * @param value - The numeric value to format
 * @returns Formatted compact string (e.g., "1.2K", "3.4M")
 *
 * @example
 * compactFormatter(1234) // "1.2K"
 * compactFormatter(1234567) // "1.2M"
 * compactFormatter(1234567890) // "1.2B"
 */
export const compactFormatter = (value: number): string => {
  return Intl.NumberFormat("us", { notation: "compact" }).format(value).toString();
};

/**
 * Creates a formatter function that formats numbers with fixed decimal places.
 * Factory function for creating decimal-specific formatters.
 *
 * @param decimals - Number of decimal places to display (default: 2)
 * @returns A formatter function that formats values with specified decimals
 *
 * @example
 * const twoDecimalFormatter = decimalFormatter(2);
 * twoDecimalFormatter(123.456) // "123.46"
 *
 * const oneDecimalFormatter = decimalFormatter(1);
 * oneDecimalFormatter(123.456) // "123.5"
 */
export const decimalFormatter =
  (decimals: number = 2) =>
  (value: number): string => {
    return value.toFixed(decimals);
  };

/**
 * Formats temperature values in Celsius.
 * Displays one decimal place with the °C symbol.
 *
 * @param value - The temperature value to format
 * @returns Formatted temperature string (e.g., "23.5°C")
 *
 * @example
 * temperatureFormatter(23.456) // "23.5°C"
 * temperatureFormatter(100) // "100.0°C"
 */
export const temperatureFormatter = (value: number): string => {
  return `${value.toFixed(1)}°C`;
};

/**
 * Formats energy values in kilowatt-hours (kWh).
 * Displays two decimal places with the kWh unit.
 *
 * @param value - The energy value to format
 * @returns Formatted energy string (e.g., "123.45 kWh")
 *
 * @example
 * energyFormatter(123.456) // "123.46 kWh"
 * energyFormatter(1000) // "1000.00 kWh"
 */
export const energyFormatter = (value: number): string => {
  return `${value.toFixed(2)} kWh`;
};
