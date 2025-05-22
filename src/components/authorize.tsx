"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import GithubIcon from "@/components/icons/github";
import RocketIcon from "@/components/icons/rocket";

export default function CallAuthorize({
  onClick,
  children,
  ...props
}: ButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          setOpen(true);
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm sm:rounded-2xl sm:border sm:p-6 bg-background shadow-xl">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-3xl">
              <RocketIcon />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-center">
                Sign in to DevSpace
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground text-center">
                To continue, sign in with your GitHub account.
              </DialogDescription>
            </div>
          </DialogHeader>

          <Button
            onClick={() => {
              setLoading(true);
              window.location.href = "/api/auth/github";
            }}
            variant="outline"
            className="w-full mt-2 flex gap-2 items-center justify-center"
            loading={loading}
          >
            <span className="mb-0.5">
              <GithubIcon />
            </span>
            Continue with GitHub
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
