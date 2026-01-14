import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config";

import { RegisterForm } from "../../_components/register-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export default async function RegisterV2() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard/iiot");
  }

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">Create your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to register.</p>
        </div>
        <div className="space-y-4">
          <GoogleButton className="w-full" />
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
          </div>
          <RegisterForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link className="text-foreground" href="login">
            Login
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="text-muted-foreground size-4" />
          ENG
        </div>
      </div>
    </>
  );
}
