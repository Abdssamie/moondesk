# Chart Data Validation

This module provides Zod schemas and utilities for validating chart data before passing it to Tremor components.

## Usage

### Basic Validation

```typescript
import { validateChartData, timeSeriesSchema } from '@/lib/validation';

// Validate time series data
const data = [
  { date: '2024-01-15', desktop: 100, mobile: 80 },
  { date: '2024-01-16', desktop: 120, mobile: 90 },
];

try {
  const validatedData = validateChartData(timeSeriesSchema, data);
  // Use validatedData with Tremor AreaChart
} catch (error) {
  console.error('Invalid chart data:', error.message);
}
```

### Safe Validation (No Exceptions)

```typescript
import { safeValidateChartData, metricTrendsSchema } from '@/lib/validation';

const result = safeValidateChartData(metricTrendsSchema, data);

if (result.success) {
  // Use result.data
  console.log('Valid data:', result.data);
} else {
  // Handle result.error
  console.error('Validation failed:', result.error.message);
}
```

## Available Schemas

### Time Series Data

- `timeSeriesPointSchema` - Single time series point with date and dynamic values
- `timeSeriesSchema` - Array of time series points

```typescript
// Valid time series point
{
  date: '2024-01-15',
  temperature: 24.5,
  humidity: 65
}
```

### Metric Trends

- `metricTrendSchema` - Single metric trend for dashboard cards
- `metricTrendsSchema` - Array of metric trends

```typescript
// Valid metric trend
{
  title: 'Total Readings',
  value: 1234,
  trend: 5.2,
  label: 'vs yesterday',
  status: 'up',
  description: 'Total data points collected',
  icon: 'activity'
}
```

### Pie/Donut Chart Data

- `pieChartDataSchema` - Single pie chart data point
- `pieChartDataArraySchema` - Array of pie chart data

```typescript
// Valid pie chart data
{
  name: 'Pumps',
  value: 15,
  fill: 'var(--chart-1)'
}
```

### Asset Table Data

- `assetTableRowSchema` - Single asset table row
- `assetTableRowsSchema` - Array of asset table rows

```typescript
// Valid asset table row
{
  id: '123',
  name: 'Pump A',
  status: 'Online',
  type: 'Pump',
  location: 'Building 1',
  lastReading: '24.5°C',
  lastSeen: '2024-01-15',
  activeAlerts: 2
}
```

## Error Handling

The validation utilities throw `ChartDataValidationError` which includes:
- Descriptive error message
- Original Zod error for detailed debugging

```typescript
try {
  validateChartData(schema, data);
} catch (error) {
  if (error instanceof ChartDataValidationError) {
    console.error('Validation error:', error.message);
    console.error('Zod details:', error.zodError);
  }
}
```

## Integration with Adapters

Use validation after adapter functions to ensure data integrity:

```typescript
import { adaptReadingsToTimeSeries } from '@/lib/adapters/dashboard-adapter';
import { validateChartData, timeSeriesSchema } from '@/lib/validation';

// Adapt and validate
const timeSeries = adaptReadingsToTimeSeries(readings);
const validatedData = validateChartData(timeSeriesSchema, timeSeries);

// Pass to Tremor component
<AreaChart data={validatedData} ... />
```
