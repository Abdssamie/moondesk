"use client";

import { useSignIn } from "@clerk/nextjs";
import { siGoogle } from "simple-icons";
import { toast } from "sonner";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { signIn, isLoaded } = useSignIn();

  const signInWithGoogle = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard/iiot",
      });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      toast.error(error.errors?.[0]?.message ?? "Failed to sign in with Google");
    }
  };

  return (
    <Button variant="secondary" className={cn(className)} onClick={signInWithGoogle} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}
