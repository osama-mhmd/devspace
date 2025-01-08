"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/db/actions/users/logout";
import { useState } from "react";
import { signOut } from "@/paraglide/messages";

export default function SignOut() {
  const [isLoading, setLoadingState] = useState(false);

  const onclick = async () => {
    setLoadingState(true);

    await logout();
  };

  return (
    <Button
      className="w-[15ch]"
      variant="destructive"
      loading={isLoading}
      onClick={async () => await onclick()}
    >
      {signOut()} <LogOut strokeWidth={1.5} className="ms-2" />
    </Button>
  );
}
