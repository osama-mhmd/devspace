"use client";

import { Button } from "@/components/ui/button";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PanelTrigger,
} from "@/components/ui/panel";
import createPomodoro from "@/db/actions/pomodoros/create";
import updatePomodoro from "@/db/actions/pomodoros/update";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const timerMax = 25;
const breakTimerMax = 5;

function setCookies(time?: number, type?: "work" | "break", id?: string) {
  if (time !== undefined) document.cookie = `last-pomodoro.time=${time}`;
  if (type) document.cookie = `last-pomodoro.type=${type}`;
  if (id !== undefined) document.cookie = `last-pomodoro.id=${id}`;
}

export default function Pomodoro({
  lastPomodoro,
}: {
  lastPomodoro: {
    id: string | undefined;
    time: string | undefined;
    type: string | undefined;
  };
}) {
  const [pomodoroProps, setPomodoroProps] = useState({
    id: lastPomodoro.id ?? "",
    time: lastPomodoro.time ? parseInt(lastPomodoro.time) : 0,
    type: (["work", "break"].includes(lastPomodoro.type ?? "")
      ? lastPomodoro.type
      : "work") as "work" | "break",
    paused: false,
  });

  const minutesLeft = `${Math.floor(pomodoroProps.time / 60)}`.padStart(2, "0");
  const secondsLeft = `${pomodoroProps.time % 60}`.padStart(2, "0");

  useEffect(() => {
    // Enable Notifications
    Notification.requestPermission().then((result) => console.log(result));

    if (lastPomodoro.time || lastPomodoro.type == "break") {
      toast("Resuming your last pomodoro");
    }

    const interval = setInterval(async () => {
      setPomodoroProps((prev) => {
        if (prev.paused) return prev;

        // saving to the db every minute in the work mode
        if (prev.time % 60 == 0 && prev.type === "work" && prev.time !== 0) {
          updatePomodoro(prev.id, prev.time)
            .then((result) => {
              if (!result) toast.error("Something went wrong!");
            })
            .catch(() => {
              toast.error("Something went wrong!");
            });
        }

        if (prev.type === "work" && prev.time >= timerMax) {
          const message = "Time's up! Take a 5 minutes break";

          // Notifications (toast, and web)
          toast.success(message);
          new Notification(message);

          // Reset Cookie, and Pomodoro
          setCookies(0, "break", "");
          return { id: "", type: "break", time: 0, paused: true };
        }

        if (prev.type === "break" && prev.time >= breakTimerMax) {
          const message = "Break finished! Let's start again";

          // TODO: this toast is triggered twise in development mode (coz of React.StrictMode)
          toast.success(message);
          new Notification(message);

          // Reset Cookies, and Pomodoro
          setCookies(0, "work", "");
          return { id: "", type: "work", time: 0, paused: true };
        }

        // update the cookies
        setCookies(prev.time + 1);

        return { ...prev, time: prev.time + 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!pomodoroProps.id && pomodoroProps.type == "work") {
      createPomodoro("work").then((id) => {
        if (!id) {
          toast.error(
            "Something went wrong! You work will not be saved! Please refresh the page",
          );
          return;
        }

        setCookies(undefined, undefined, id);
        setPomodoroProps((prev) => ({ ...prev, id }));
      });
    }
  }, [pomodoroProps.id, pomodoroProps.type]);

  return (
    <Panel>
      <PanelTrigger>
        <div className="fixed z-[23] top-2 right-2 rtl:left-2">
          <Button variant="secondary">
            {minutesLeft}:{secondsLeft}{" "}
            <Image
              alt="pomodoro"
              src="/pomodoro.png"
              width={35}
              height={35}
              className="ms-2"
            />
          </Button>
        </div>
      </PanelTrigger>
      <PanelBody>
        <PanelHeader>Pomodoro</PanelHeader>
        <div
          onClick={() => {
            setPomodoroProps((prev) => ({ ...prev, paused: !prev.paused }));
          }}
          style={{
            background: `conic-gradient(
              hsl(var(--primary)) ${((timerMax - pomodoroProps.time) / timerMax) * 100}%,
              transparent 0
            )`,
            transition: "background 0.5s linear",
          }}
          className="border-4 cursor-pointer hover:bg-muted/30 rounded-full mx-auto border-primary flex items-center justify-center w-36 h-36"
        >
          {pomodoroProps.paused ? (
            <Play fill="white" size={80} stroke="white" />
          ) : (
            <Pause fill="white" size={80} stroke="white" />
          )}
        </div>
        <h3 className="text-center mt-4">
          {minutesLeft}:{secondsLeft} - {pomodoroProps.type}
        </h3>
      </PanelBody>
    </Panel>
  );
}
