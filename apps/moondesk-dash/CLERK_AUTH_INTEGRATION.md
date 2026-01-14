# Clerk Authentication Integration

This document outlines the Clerk authentication integration into the existing custom auth components (v1 and v2).

## Changes Made

### 1. Updated App Configuration

- **File**: `src/config.ts`
- Changed app name from "Studio Admin" to "Moondesk"
- Updated meta title and description for Industrial IoT focus

### 2. Updated README

- **File**: `README.md`
- Replaced generic admin template content with Moondesk IIoT dashboard information
- Added proper tech stack and features for industrial IoT

### 3. Integrated Clerk into Login Form

- **File**: `src/app/(main)/auth/_components/login-form.tsx`
- Added Clerk's `useSignIn` hook
- Implemented email/password authentication with Clerk
- Added loading states and error handling
- Redirects to `/dashboard/iiot` on successful login

### 4. Integrated Clerk into Register Form

- **File**: `src/app/(main)/auth/_components/register-form.tsx`
- Added Clerk's `useSignUp` hook
- Implemented email/password registration with Clerk
- Added email verification flow (sends code, user verifies)
- Shows verification code input after initial registration
- Redirects to `/dashboard/iiot` after successful verification

### 5. Updated Google OAuth Button

- **File**: `src/app/(main)/auth/_components/social-auth/google-button.tsx`
- Integrated Clerk's OAuth authentication
- Uses `authenticateWithRedirect` for Google sign-in
- Redirects to SSO callback page

### 6. Created SSO Callback Page

- **File**: `src/app/sso-callback/page.tsx`
- Handles OAuth redirects from Google and other providers
- Uses Clerk's `AuthenticateWithRedirectCallback` component

### 7. Updated Auth Pages with Moondesk Branding

- **Files**:
  - `src/app/(main)/auth/v1/login/page.tsx`
  - `src/app/(main)/auth/v1/register/page.tsx`
  - `src/app/(main)/auth/v2/layout.tsx`
- Replaced generic Command icon with Factory icon (industrial theme)
- Updated copy to reflect Moondesk and Industrial IoT focus
- Maintained original v1 and v2 design layouts

### 8. Updated Sign-In/Sign-Up Pages

- **Files**:
  - `src/app/sign-in/[[...sign-in]]/page.tsx`
  - `src/app/sign-up/[[...sign-up]]/page.tsx`
- Added Moondesk branding and Factory icon
- Wrapped Clerk's default components with custom styling
- These are fallback pages; main auth uses v1/v2 custom components

## Authentication Flow

### Email/Password Login (v1 or v2)

1. User enters email and password
2. Form validates with Zod schema
3. Clerk's `signIn.create()` authenticates user
4. On success, redirects to `/dashboard/iiot`
5. On error, shows toast notification

### Email/Password Registration (v1 or v2)

1. User enters email, password, and confirms password
2. Form validates with Zod schema (including password match)
3. Clerk's `signUp.create()` creates account
4. Clerk sends verification code to email
5. User enters verification code
6. Clerk's `attemptEmailAddressVerification()` verifies code
7. On success, redirects to `/dashboard/iiot`

### Google OAuth

1. User clicks "Continue with Google"
2. Clerk redirects to Google OAuth
3. User authorizes on Google
4. Google redirects to `/sso-callback`
5. Clerk completes authentication
6. Redirects to `/dashboard/iiot`

## Available Auth Routes

- `/auth/v1/login` - Version 1 login page (split layout)
- `/auth/v1/register` - Version 1 register page (split layout)
- `/auth/v2/login` - Version 2 login page (centered with sidebar)
- `/auth/v2/register` - Version 2 register page (centered with sidebar)
- `/sign-in` - Fallback Clerk default sign-in (with custom wrapper)
- `/sign-up` - Fallback Clerk default sign-up (with custom wrapper)
- `/sso-callback` - OAuth callback handler

## Environment Variables Required

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/v2/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/v2/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/iiot
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/iiot
```

## Design Preserved

Both v1 and v2 auth page designs have been preserved:

- **v1**: Split layout with colored sidebar (left for login, right for register)
- **v2**: Centered form with large colored sidebar panel

All original styling, layouts, and visual designs remain intact. Only the authentication logic has been replaced with Clerk integration.

## Next Steps

1. Configure Clerk dashboard with Google OAuth provider
2. Test email verification flow
3. Test Google OAuth flow
4. Customize Clerk email templates (optional)
5. Add password reset functionality (optional)
6. Remove CRM/Finance dashboard placeholders if not needed
