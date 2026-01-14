import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <OrganizationProfile />
    </div>
  );
}
