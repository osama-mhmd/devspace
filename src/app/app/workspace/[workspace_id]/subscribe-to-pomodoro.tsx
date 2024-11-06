"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Panel,
  PanelBody,
  PanelClose,
  PanelHeader,
} from "@/components/ui/panel";
import Image from "next/image";
import { useState } from "react";

export default function SubscribeToPomodoro() {
  const [checked, setChecked] = useState(false);

  const subscribe = async () => {
    if (checked) document.cookie = `subscribed-pomodoro=${checked}`;
    window.location.reload();
  };

  return (
    <Panel defaultValue={true}>
      <PanelBody>
        <PanelHeader>
          <h3 className="my-0">Hello!</h3>
        </PanelHeader>
        <div className="w-full flex flex-col items-center gap-3 rounded-md m-1 p-4 bg-muted/50">
          <p>
            Working with pomodoros is a new jump! Now, you can work with
            pomodoros and see your progress through the week.
          </p>
          <Image
            alt="Pomodoro timer"
            src="/pomodoro-timer.png"
            height={200}
            width={200}
            className="p-8 rounded-3xl bg-muted"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              onCheckedChange={(val: boolean) => setChecked(val)}
              id="always"
            />
            <label htmlFor="always">Treat my action as an always</label>
          </div>
          <div className="flex items-center space-x-2">
            <PanelClose>
              <Button variant="outline">Cancel</Button>
            </PanelClose>
            <PanelClose>
              <Button onClick={subscribe}>Start</Button>
            </PanelClose>
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
