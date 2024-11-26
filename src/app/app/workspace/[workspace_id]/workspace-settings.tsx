"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import changeWorkspaceVisibility from "@/db/actions/workspaces/change-visibility";
import { toast } from "sonner";
import { Workspace } from "@/db/actions/workspaces/get-workspaces";
import * as m from "@/paraglide/messages";
import dir, { Direction } from "@/lib/dir";

type Access = "view" | "comment" | "edit";
export type Visibility =
  | "private"
  | "public-comment"
  | "public-view"
  | "public-edit";

export default function WorkspaceSettings({
  workspace,
}: {
  workspace: Workspace;
}) {
  const [visibility, setVisibility] = useState<"public" | "private">(
    workspace.visibility.split("-")[0] as "public" | "private",
  );
  const [access, setAccess] = useState<Access>(
    (workspace.visibility.split("-")[1] as Access) ?? "view",
  );

  async function changeVisibility(visibility: Visibility) {
    const result = await changeWorkspaceVisibility(visibility, workspace.id);

    if (result) toast.success("Visibility changed successfully");

    if (!result) toast.error("You are not the owner");
  }

  return (
    <div>
      <h3 className="my-0 mb-2">{m.visibility()}</h3>
      <RadioGroup
        defaultValue={visibility}
        className="gap-0"
        onValueChange={async (val: "public" | "private") => {
          setVisibility(val as "public" | "private");
          if (val == "private") await changeVisibility("private");
          else await changeVisibility(`${val}-${access}`);
        }}
        dir={dir() as Direction}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="public" />
          <label htmlFor="public">{m.publicVisibility()}</label>
          <Select
            defaultValue={access}
            onValueChange={async (val) => {
              setAccess(val as Access);
              await changeVisibility(`${visibility}-${val}` as Visibility);
            }}
            disabled={visibility !== "public"}
            dir={dir() as Direction}
          >
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-transparent">
              <SelectValue placeholder="Everyone access" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Access</SelectLabel>
                <SelectItem value="view">{m.view()}</SelectItem>
                <SelectItem value="comment">{m.comment()}</SelectItem>
                <SelectItem value="edit">{m.edit()}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="private" id="private" />
          <label htmlFor="private">{m.privateVisibility()}</label>
        </div>
      </RadioGroup>
    </div>
  );
}
