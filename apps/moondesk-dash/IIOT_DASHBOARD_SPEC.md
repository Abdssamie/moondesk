# Industrial IoT Dashboard - Feature Specification

## Overview

Build a Next.js dashboard for monitoring and managing industrial assets (Solar Panels, PLCs, Sensors) with real-time telemetry visualization and device provisioning capabilities.

---

## 1. Navigation & Sidebar

### Requirements

- Add IIoT section to sidebar navigation
- Replace existing demo dashboards with IIoT-specific pages

### Implementation

**File:** `src/navigation/sidebar/sidebar-items.ts`

Add new navigation group:

```typescript
{
  id: 1,
  label: "Industrial IoT",
  items: [
    {
      title: "Overview",
      url: "/dashboard/iiot",
      icon: LayoutDashboard,
    },
    {
      title: "Devices",
      url: "/dashboard/iiot/devices",
      icon: Factory,
    },
    {
      title: "Analytics",
      url: "/dashboard/iiot/analytics",
      icon: ChartBar,
      comingSoon: true,
    },
  ],
}
```

---

## 2. IIoT Overview Page (Dashboard Home)

### Requirements

- Display grid of device status cards
- Show real-time device metrics (last reported value)
- Visual status indicators (Online/Offline/Alarm)
- Click card to navigate to device detail page

### Page Structure

**File:** `src/app/(main)/dashboard/iiot/page.tsx`

### Components Needed

1. **DeviceStatusCard** - Individual device widget
   - Device name
   - Device type badge (Solar/Sensor/PLC)
   - Status indicator (colored dot + text)
   - Last value display (e.g., "24.5 °C", "450W")
   - Last seen timestamp
   - Click to navigate to detail page

2. **DeviceGrid** - Responsive grid layout
   - 1 column on mobile
   - 2-3 columns on tablet
   - 3-4 columns on desktop

### Data Requirements

- Fetch devices for current organization
- Include last telemetry value for each device
- Real-time status updates (optional: use polling or WebSocket)

### Design Notes

- Industrial modern aesthetic
- Slate/Zinc color scheme
- Green for Online, Red for Alarm/Offline, Yellow for Maintenance
- Data-dense but clean layout

---

## 3. Devices Page (Inventory)

### Requirements

- Table listing all devices for current organization
- Sortable and filterable columns
- Search functionality
- "Add Device" button to open provisioning modal

### Page Structure

**File:** `src/app/(main)/dashboard/iiot/devices/page.tsx`

### Table Columns

1. **Name** - Device name (clickable to detail page)
2. **Type** - Badge showing Solar/Sensor/PLC
3. **Device ID** - Unique identifier
4. **Status** - Status badge with color
5. **Last Seen** - Relative time (e.g., "2 minutes ago")
6. **Actions** - Dropdown menu (View, Edit, Delete)

### Components Needed

1. **DevicesTable** - Uses existing `data-table` component
2. **DeviceTypeFilter** - Filter by device type
3. **StatusFilter** - Filter by status
4. **AddDeviceButton** - Opens provisioning modal

### Features

- Use TanStack Table (already installed)
- Pagination (10, 25, 50 per page)
- Column sorting
- Global search across name and ID
- Export to CSV (optional)

---

## 4. Device Provisioning Modal

### Requirements

- Modal/Dialog form to add new device
- Collect device name and type
- On success, display device credentials
- Credentials shown only once (copy-pasteable)

### Flow

1. User clicks "Add Device" button
2. Modal opens with form:
   - **Device Name** (text input, required)
   - **Device Type** (dropdown: Solar, Sensor, PLC)
   - **Submit** button

3. On submit:
   - POST to `/api/devices`
   - Show loading state

4. On success:
   - Show "Device Created" success state
   - Display credentials card with:
     - Host
     - Client ID
     - Username
     - Password/Token
   - Copy buttons for each field
   - Warning: "Save these credentials - they won't be shown again"
   - "Done" button to close modal

### Components Needed

**File:** `src/app/(main)/dashboard/iiot/devices/_components/add-device-modal.tsx`

1. **AddDeviceModal** - Main modal component
2. **DeviceForm** - Form with validation (react-hook-form + zod)
3. **CredentialsCard** - Display credentials with copy buttons

### Validation

- Device name: Required, 3-50 characters
- Device type: Required, one of enum values

---

## 5. Device Detail Page (Digital Twin)

### Requirements

- Show device metadata
- Display time-series chart (last 24 hours)
- Real-time current value
- Device actions (Edit, Delete, Restart)

### Page Structure

**File:** `src/app/(main)/dashboard/iiot/devices/[deviceId]/page.tsx`

### Layout Sections

#### A. Header Section

- Device name (editable inline)
- Device type badge
- Status indicator
- Last seen timestamp
- Action buttons (Edit, Delete, Restart)

#### B. Current Metrics Card

- Large display of current value
- Metric name and unit
- Trend indicator (up/down arrow)
- Comparison to previous value

#### C. Time-Series Chart

- Recharts line chart
- X-axis: Time (last 24 hours)
- Y-axis: Value with unit
- Responsive design
- Zoom/pan controls (optional)
- Time range selector (1h, 6h, 24h, 7d)

#### D. Device Information Card

- Device ID
- Organization
- Firmware version
- Location
- Model
- Created date
- Last updated

### Components Needed

1. **DeviceHeader** - Top section with name and actions
2. **CurrentMetricsCard** - Real-time value display
3. **TelemetryChart** - Recharts time-series visualization
4. **DeviceInfoCard** - Metadata display
5. **TimeRangeSelector** - Button group for time range

### Data Requirements

- Fetch device details by ID
- Fetch telemetry data for selected time range
- Real-time updates for current value (polling every 5-10s)

---

## 6. API Service Layer

### Requirements

- Centralized API client with Clerk JWT integration
- Type-safe API methods
- Error handling
- Mock data for development

### Files Structure

```
src/services/
├── api-client.ts          (✅ Already created)
├── devices-api.ts         (Device CRUD operations)
└── telemetry-api.ts       (Telemetry data fetching)
```

### API Methods Needed

#### devices-api.ts

```typescript
- getDevices(organizationId: string): Promise<Device[]>
- getDevice(deviceId: string): Promise<Device>
- createDevice(data: CreateDeviceRequest): Promise<DeviceCredentials>
- updateDevice(deviceId: string, data: Partial<Device>): Promise<Device>
- deleteDevice(deviceId: string): Promise<void>
```

#### telemetry-api.ts

```typescript
- getTelemetry(deviceId: string, timeRange: TimeRange): Promise<TelemetryData[]>
- getLatestValue(deviceId: string): Promise<TelemetryData>
```

### Mock Data Strategy

- Create mock data generators for development
- Use realistic industrial values:
  - Solar: 0-500W power output
  - Sensor: 15-35°C temperature
  - PLC: 0-100% utilization
- Add flag to switch between mock and real API

**File:** `src/services/mock-data.ts`

---

## 7. React Query Integration

### Requirements

- Use TanStack Query for data fetching
- Implement caching and refetching strategies
- Optimistic updates for mutations

### Query Keys Structure

```typescript
const queryKeys = {
  devices: {
    all: (orgId: string) => ["devices", orgId],
    detail: (deviceId: string) => ["devices", deviceId],
  },
  telemetry: {
    range: (deviceId: string, range: string) => ["telemetry", deviceId, range],
    latest: (deviceId: string) => ["telemetry", deviceId, "latest"],
  },
};
```

### Hooks to Create

**File:** `src/hooks/use-devices.ts`

```typescript
- useDevices(organizationId: string)
- useDevice(deviceId: string)
- useCreateDevice()
- useUpdateDevice()
- useDeleteDevice()
```

**File:** `src/hooks/use-telemetry.ts`

```typescript
- useTelemetry(deviceId: string, timeRange: TimeRange)
- useLatestValue(deviceId: string)
```

### Refetch Strategies

- Devices list: Refetch on window focus
- Device detail: Refetch every 10s
- Latest telemetry: Refetch every 5s
- Historical telemetry: Cache for 5 minutes

---

## 8. Type Definitions

### Files

**File:** `src/types/iiot.ts` (✅ Already created)

Ensure all types are defined:

- Device
- DeviceType
- DeviceStatus
- DeviceCredentials
- TelemetryData
- CreateDeviceRequest
- DeviceWithLastValue
- TimeRange

---

## 9. Styling & Design System

### Color Palette (Industrial Theme)

```css
/* Status Colors */
--status-online: #10b981 (green-500) --status-offline: #ef4444 (red-500) --status-alarm: #ef4444 (red-500)
  --status-maintenance: #f59e0b (amber-500) /* Device Type Colors */ --device-solar: #f59e0b (amber-500)
  --device-sensor: #3b82f6 (blue-500) --device-plc: #8b5cf6 (violet-500) /* Background */ Use existing slate/zinc from
  Tailwind;
```

### Component Styling Guidelines

- Use existing shadcn/ui components
- Consistent spacing (p-4, p-6 for cards)
- Border radius: rounded-lg
- Shadows: shadow-sm for cards
- Hover states on interactive elements
- Loading skeletons for async data

---

## 10. Error Handling & Loading States

### Requirements

- Loading skeletons for all async content
- Error boundaries for page-level errors
- Toast notifications for actions (success/error)
- Empty states for no data

### Components Needed

1. **DeviceCardSkeleton** - Loading state for device cards
2. **TableSkeleton** - Loading state for devices table
3. **ChartSkeleton** - Loading state for charts
4. **EmptyState** - No devices found
5. **ErrorState** - Error loading data

### Toast Messages

- Device created successfully
- Device updated successfully
- Device deleted successfully
- Failed to load devices
- Failed to create device
- Credentials copied to clipboard

---

## 11. Organization Context

### Requirements

- Get current organization from Clerk
- Filter all data by organization ID
- Handle organization switching

### Implementation

**File:** `src/hooks/use-organization.ts`

```typescript
export function useOrganization() {
  const { organization } = useOrganization();
  return {
    organizationId: organization?.id,
    organizationName: organization?.name,
  };
}
```

### Usage

- Pass organizationId to all API calls
- Refetch data when organization changes
- Show organization name in breadcrumbs

---

## 12. Breadcrumbs

### Requirements

- Show current page path
- Clickable navigation
- Update on route change

### Examples

- Overview: `Home / IIoT / Overview`
- Devices: `Home / IIoT / Devices`
- Device Detail: `Home / IIoT / Devices / [Device Name]`

**File:** Update existing breadcrumb component or create new one

---

## Implementation Priority

### Phase 1: Core Pages (MVP)

1. ✅ Clerk authentication setup
2. Update sidebar navigation
3. Create IIoT Overview page with device cards
4. Create Devices page with table
5. Implement mock API service

### Phase 2: Device Management

6. Add Device provisioning modal
7. Device detail page with metadata
8. Device CRUD operations
9. React Query hooks

### Phase 3: Visualization

10. Time-series chart with Recharts
11. Time range selector
12. Real-time updates

### Phase 4: Polish

13. Loading states and skeletons
14. Error handling
15. Empty states
16. Toast notifications
17. Responsive design refinement

---

## Testing Checklist

- [ ] Sign in/sign up flow works
- [ ] Organization switcher changes data
- [ ] Device cards display correctly
- [ ] Device table sorting/filtering works
- [ ] Add device modal creates device
- [ ] Credentials are copyable
- [ ] Device detail page loads
- [ ] Chart displays telemetry data
- [ ] Time range selector updates chart
- [ ] Real-time updates work
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Loading states show
- [ ] Error states show
- [ ] Empty states show

---

## Notes

- Start with mock data to build UI quickly
- Add `// TODO: Replace with real .NET API` comments
- Keep components small and focused
- Use existing shadcn/ui components
- Follow existing code patterns in the project
- Industrial aesthetic: clean, data-dense, professional
