# Clerk Authentication Setup

## ✅ What's Been Configured

### 1. Clerk Integration

- ✅ `@clerk/nextjs` installed
- ✅ `ClerkProvider` wrapping the app in `src/app/layout.tsx`
- ✅ `proxy.ts` middleware configured (Next.js 16+)

### 2. Authentication Components

- ✅ **ClerkAuth** - Sign In/Sign Up buttons + UserButton in header
- ✅ **ClerkOrgSwitcher** - Organization switcher in header for multi-tenancy
- ✅ **NavUserClerk** - Sidebar user menu with Clerk integration

### 3. Pages

- ✅ **Landing Page** (`/`) - Shows sign-in/sign-up for unauthenticated users
- ✅ **Dashboard** - Protected, redirects to `/dashboard/iiot` when signed in

## 🔧 Setup Instructions

### Step 1: Get Clerk Keys

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application (or use existing)
3. Copy your API keys from the dashboard

### Step 2: Configure Environment Variables

Create `.env.local` file in `apps/moondesk-dash/`:

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

Then add your Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 3: Enable Organizations in Clerk

1. In Clerk Dashboard, go to **Settings** → **Organizations**
2. Enable Organizations feature
3. Configure organization settings as needed

### Step 4: Run the App

```bash
pnpm dev
```

Visit `http://localhost:3000` - you should see the landing page with sign-in/sign-up buttons.

## 🎯 What's Next

Now that authentication is set up, you can:

1. **Create IIoT Dashboard Pages** - Device overview, device list, device details
2. **Implement API Integration** - Connect to your .NET backend
3. **Add Device Provisioning** - Modal for adding new devices
4. **Build Charts** - Time-series visualization with Recharts

## 📝 Key Files

- `src/proxy.ts` - Clerk middleware (Next.js 16+)
- `src/app/layout.tsx` - ClerkProvider wrapper
- `src/app/(main)/dashboard/layout.tsx` - Dashboard layout with auth components
- `src/app/(main)/dashboard/_components/sidebar/clerk-auth.tsx` - Auth components
- `src/app/(main)/dashboard/_components/sidebar/nav-user-clerk.tsx` - Sidebar user menu
- `src/app/(external)/page.tsx` - Landing page with auth redirect

## 🔐 How It Works

1. **Unauthenticated users** see the landing page with sign-in/sign-up buttons
2. **After signing in**, users are redirected to `/dashboard/iiot`
3. **Organization Switcher** in header allows switching between organizations
4. **All API calls** will include Clerk JWT token (via `src/services/api-client.ts`)
5. **User profile** accessible via UserButton in header or sidebar menu
