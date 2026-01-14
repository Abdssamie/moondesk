# Moondesk - Industrial IoT Dashboard

**Moondesk** is a modern Industrial IoT dashboard for monitoring and managing industrial assets in real-time.

## Features

- **Device Management**: Provision and monitor industrial devices (Solar Panels, PLCs, Sensors)
- **Real-time Monitoring**: Track telemetry data and device status
- **Multi-tenancy**: Secure organization-based access control via Clerk
- **Customizable Themes**: Multiple theme presets (default, brutalist, soft-pop, tangerine)
- **Responsive Design**: Mobile-first, works on all devices
- **Type-Safe**: Built with TypeScript for reliability

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Authentication**: Clerk
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd moondesk/apps/moondesk-dash
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.local.example` to `.env.local` and add your Clerk keys:

   ```bash
   cp .env.local.example .env.local
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (external)/         # Public pages (landing)
│   ├── (main)/             # Protected pages (dashboard)
│   ├── sign-in/            # Custom sign-in page
│   ├── sign-up/            # Custom sign-up page
│   └── organization/       # Organization management
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── data-table/         # Reusable table components
├── config/                 # App configuration
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── navigation/             # Navigation configuration
├── server/                 # Server actions
├── services/               # API clients
├── stores/                 # Zustand stores
├── styles/                 # Theme presets
└── types/                  # TypeScript types
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Type check with TypeScript

## Theme Customization

Moondesk includes multiple theme presets:

- **default** - Neutral gray theme
- **brutalist** - Bold orange/red with hard shadows
- **soft-pop** - Purple/violet theme
- **tangerine** - Orange theme

Switch themes in the app settings or create custom presets in `src/styles/presets/`.

## License

MIT
