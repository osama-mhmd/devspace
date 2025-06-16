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
import { AlarmClock, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const timerMax = 25 * 60;
const breakTimerMax = 5 * 60;

function saveLocally(time?: number, type?: "work" | "break", id?: string) {
  if (time !== undefined)
    localStorage.setItem("last-pomodoro.time", time.toString());
  if (type) localStorage.setItem("last-pomodoro.type", type);
  if (id !== undefined) localStorage.setItem("last-pomodoro.id", id);
}

function getLastPomodoro() {
  return {
    id: localStorage.getItem("last-pomodoro.id") || undefined,
    time: localStorage.getItem("last-pomodoro.time") || undefined,
    type: localStorage.getItem("last-pomodoro.type") || undefined,
  };
}

export default function Pomodoro() {
  const [pomodoroProps, setPomodoroProps] = useState({
    id: "",
    time: 0,
    type: "work" as "work" | "break",
    paused: true,
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const minutesLeft = `${Math.floor(pomodoroProps.time / 60)}`.padStart(2, "0");
  const secondsLeft = `${pomodoroProps.time % 60}`.padStart(2, "0");

  // Initialize from localStorage on component mount
  useEffect(() => {
    const lastPomodoro = getLastPomodoro();

    setPomodoroProps({
      id: lastPomodoro.id ?? "",
      time: lastPomodoro.time ? parseInt(lastPomodoro.time) : 0,
      type: (["work", "break"].includes(lastPomodoro.type ?? "")
        ? lastPomodoro.type
        : "work") as "work" | "break",
      paused: lastPomodoro.time ? false : true,
    });

    setIsInitialized(true);

    if (lastPomodoro.time || lastPomodoro.type == "break") {
      toast("Resuming your last pomodoro");
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Enable Notifications
    Notification.requestPermission().then((result) => console.log(result));

    const interval = setInterval(async () => {
      setPomodoroProps((prev) => {
        if (prev.paused) return prev;

        // saving to the db every minute in the work mode
        if (prev.time % 60 == 0 && prev.type === "work" && prev.time !== 0) {
          // FIX: Cannot update a component while rendering a different component
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

          // Reset localStorage, and Pomodoro
          saveLocally(0, "break", "");
          return { id: "", type: "break", time: 0, paused: true };
        }

        if (prev.type === "break" && prev.time >= breakTimerMax) {
          const message = "Break finished! Let's start again";

          // TODO: this toast is triggered twise in development mode (coz of React.StrictMode)
          toast.success(message);
          new Notification(message);

          // Reset localStorage, and Pomodoro
          saveLocally(0, "work", "");
          return { id: "", type: "work", time: 0, paused: true };
        }

        // update the localStorage
        saveLocally(prev.time + 1);

        return { ...prev, time: prev.time + 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!pomodoroProps.id && pomodoroProps.type == "work") {
      createPomodoro().then((id) => {
        if (!id) {
          toast.error(
            "Something went wrong! You work will not be saved! Please refresh the page",
          );
          return;
        }

        saveLocally(undefined, undefined, id);
        setPomodoroProps((prev) => ({ ...prev, id }));
      });
    }
  }, [pomodoroProps.id, pomodoroProps.type, isInitialized]);

  return (
    <Panel>
      <PanelTrigger>
        <div className="fixed z-[23] top-2 right-2 rtl:left-2">
          <Button variant="secondary" className="gap-2">
            {minutesLeft}:{secondsLeft}
            <AlarmClock size={18} className="mb-0.5" />
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
              hsl(var(--primary)) ${
                pomodoroProps.type == "work"
                  ? ((timerMax - pomodoroProps.time) / timerMax) * 100
                  : ((breakTimerMax - pomodoroProps.time) / breakTimerMax) * 100
              }%,
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
