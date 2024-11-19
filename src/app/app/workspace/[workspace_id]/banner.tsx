"use client";

import { Button } from "@/components/ui/button";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PanelTrigger,
} from "@/components/ui/panel";
import changeWorkspaceImage from "@/db/actions/workspaces/change-image";
import { Workspace } from "@/db/actions/workspaces/get-workspaces";
import { Permission } from "@/db/actions/workspaces/permission";
import { useState } from "react";
import { toast } from "sonner";
import * as m from "@/paraglide/messages";

const images = [
  "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
  "linear-gradient(to right, #93877f, #666365)",
  "linear-gradient(to right, #ec4899, #f97316)",
];

export default function Banner({
  workspace,
  permission,
}: {
  workspace: Workspace;
  permission: Permission;
}) {
  const [workpsaceImage, setWorkspaceImage] = useState(
    workspace.image ?? "linear-gradient(to right, #eee, #eee)",
  );

  return (
    <div
      className="h-48"
      style={{
        backgroundImage: workpsaceImage,
      }}
    >
      <div className="container relative h-full opacity-0 hover:opacity-100 transition">
        {permission == "owner" && (
          <Panel>
            <PanelTrigger>
              <Button variant="secondary" className="absolute bottom-2 end-2">
                {m.changeImage()}
              </Button>
            </PanelTrigger>
            <PanelBody>
              <PanelHeader>
                <h3 className="my-0">{m.changeImage()}</h3>
              </PanelHeader>
              <div className="common-grid gap-2">
                {images.map((image, index) => {
                  return (
                    <Image
                      image={image}
                      workspace={workspace}
                      setWorkspaceImage={setWorkspaceImage}
                      key={index}
                    />
                  );
                })}
              </div>
            </PanelBody>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Image({
  image,
  workspace,
  setWorkspaceImage,
}: {
  image: string;
  workspace: Workspace;
  setWorkspaceImage: (image: string) => void;
}) {
  async function changeImage() {
    const result = await changeWorkspaceImage(image, workspace.id);

    if (!result) toast.error("You cannot change the image 😞");
    if (result) {
      toast.success("Image changed successfully");
      setWorkspaceImage(image);
    }
  }

  return (
    <div
      className="rounded-md h-32 cursor-pointer"
      style={{
        backgroundImage: image,
      }}
      onClick={changeImage}
    ></div>
  );
}
