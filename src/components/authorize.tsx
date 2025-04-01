"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import GithubIcon from "@/components/icons/github";

// import { toast } from "sonner";
// import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { useState } from "react";
import BackDrop from "./ui/backdrop";
// import * as m from "@/paraglide/messages";

export default function CallAuthorize({
  onClick,
  children,
  ...props
}: ButtonProps) {
  const [visible, setVisibility] = useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          setVisibility(true);
          if (onClick) onClick(e);
        }}
        {...props}
      >
        {children}
      </Button>
      {visible && <Authorize closePanel={() => setVisibility(false)} />}
    </>
  );
}

function Authorize({ closePanel }: { closePanel: () => void }) {
  function signIn() {
    window.location.href = "/api/auth/github";
  }

  return createPortal(
    <BackDrop closePanel={closePanel}>
      <div className="animate-enter flex flex-col gap-2 w-full max-w-96 bg-background p-6 rounded-lg border">
        <div className="grid w-full max-w-96 mt-2 [&>*>svg]:me-1">
          <Button onClick={() => signIn()} variant="outline">
            <GithubIcon /> Continue with Github
          </Button>
        </div>
      </div>
    </BackDrop>,
    document.body,
  );
}
