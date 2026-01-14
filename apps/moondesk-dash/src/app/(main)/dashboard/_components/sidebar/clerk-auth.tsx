"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function ClerkAuth() {
  return (
    <>
      <SignedOut>
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="bg-primary text-primary-foreground">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-9 rounded-lg",
            },
          }}
        />
      </SignedIn>
    </>
  );
}

export function ClerkOrgSwitcher() {
  return (
    <SignedIn>
      <OrganizationSwitcher
        appearance={{
          elements: {
            rootBox: "flex items-center",
            organizationSwitcherTrigger:
              "rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3 py-2",
          },
        }}
        hidePersonal={false}
        afterCreateOrganizationUrl="/organization"
        afterSelectOrganizationUrl="/dashboard"
      />
    </SignedIn>
  );
}
