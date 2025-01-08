"use client";

import { Button } from "@/components/ui/button";
import { Trash, Trash2 } from "lucide-react";
import { deleteUser } from "@/db/actions/users/delete";
import { useState } from "react";
import { deleteAccount } from "@/paraglide/messages";

export default function DeleteAccount() {
  const [isLoading, setLoadingState] = useState(false);

  const onclick = async () => {
    setLoadingState(true);

    await deleteUser();
  };

  return (
    <Button
      variant="destructive"
      loading={isLoading}
      onClick={async () => await onclick()}
    >
      {deleteAccount()} <Trash2 strokeWidth={1.5} className="ms-2" />
    </Button>
  );
}
