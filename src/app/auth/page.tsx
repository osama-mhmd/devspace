"use client";

import { Button } from "@/components/ui/button";
import GithubIcon from "@/components/icons/github";

export default function LoginPage() {
  function signIn() {
    window.location.href = "/api/auth/github";
  }

  return (
    <div className="min-h-screen pt-36">
      <div className="w-full max-w-96 mx-auto">
        <div className="bg-card border rounded-lg shadow-sm p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="font-lilita mt-0 text-center">Welcome Back</h1>
            <p className="text-muted-foreground text-sm text-center">
              Sign in to your account
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={signIn}
              variant="outline"
              className="w-full contain-icons"
            >
              <GithubIcon />
              Continue with Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
