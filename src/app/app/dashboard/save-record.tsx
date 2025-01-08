"use client";

import { Button } from "@/components/ui/button";
import saveRecord from "@/db/actions/habits/save-record";
import { toast } from "sonner";
import * as m from "@/paraglide/messages";

export default function SaveRecord({ habitId }: { habitId: string }) {
  const makeRecord = async (id: string) => {
    const result = await saveRecord(id);

    if (result) {
      toast.success("Record saved");
      window.location.reload();
    } else toast.error("Something went wrong"); // TODO: implement live preview
  };

  return <Button onClick={() => makeRecord(habitId)}>{m.saveRecord()}</Button>;
}
