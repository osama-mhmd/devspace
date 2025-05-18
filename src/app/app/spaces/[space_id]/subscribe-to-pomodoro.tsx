"use client";

import { Button } from "@/components/ui/button";
import {
  Panel,
  PanelBody,
  PanelClose,
  PanelHeader,
} from "@/components/ui/panel";
import Image from "next/image";

export default function SubscribeToPomodoro() {
  const setSubscribe = async (sub: boolean) => {
    document.cookie = `subscribed-pomodoro=${sub}`;
    if (sub) window.location.reload();
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
            <PanelClose>
              <Button variant="outline" onClick={() => setSubscribe(false)}>
                Cancel
              </Button>
            </PanelClose>
            <PanelClose>
              <Button onClick={() => setSubscribe(true)}>Start</Button>
            </PanelClose>
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
