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

const defaultPomodoroProps = {
  id: "",
  time: 0,
  type: "work" as "work" | "break",
  paused: true,
  timerMax,
  breakTimerMax,
};

export default function Pomodoro() {
  const [pomodoroProps, setPomodoroProps] = useState(defaultPomodoroProps);

  const [isInitialized, setIsInitialized] = useState(false);

  const minutesLeft = `${Math.floor(pomodoroProps.time / 60)}`.padStart(2, "0");
  const secondsLeft = `${pomodoroProps.time % 60}`.padStart(2, "0");

  // Initialize from localStorage on component mount
  useEffect(() => {
    const lastPomodoro = getLastPomodoro();

    setPomodoroProps((prev) => ({
      ...prev,
      id: lastPomodoro.id ?? "",
      time: lastPomodoro.time ? parseInt(lastPomodoro.time) : 0,
      type: (["work", "break"].includes(lastPomodoro.type ?? "")
        ? lastPomodoro.type
        : "work") as "work" | "break",
      paused: lastPomodoro.time ? false : true,
    }));

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

        if (prev.type === "work" && prev.time >= prev.timerMax) {
          const message = "Time's up! Take a 5 minutes break";

          // Notifications (toast, and web)
          toast.success(message);
          new Notification(message);

          // Reset localStorage, and Pomodoro
          saveLocally(0, "break", "");
          return { ...defaultPomodoroProps, type: "break" };
        }

        if (prev.type === "break" && prev.time >= prev.breakTimerMax) {
          const message = "Break finished! Let's start again";

          // TODO: this toast is triggered twise in development mode (coz of React.StrictMode)
          toast.success(message);
          new Notification(message);

          // Reset localStorage, and Pomodoro
          saveLocally(0, "work", "");
          return defaultPomodoroProps;
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
      <PanelBody className="absolute top-12">
        <PanelHeader>Pomodoro</PanelHeader>

        <div className="flex flex-col items-center space-y-2 py-6">
          <div
            onClick={() => {
              setPomodoroProps((prev) => ({ ...prev, paused: !prev.paused }));
            }}
            style={{
              background: `conic-gradient(
                ${
                  pomodoroProps.type === "work"
                    ? "hsl(15, 100%, 55%)"
                    : "hsl(120, 60%, 50%)"
                } ${
                  pomodoroProps.type === "work"
                    ? ((pomodoroProps.timerMax - pomodoroProps.time) /
                        pomodoroProps.timerMax) *
                      100
                    : ((pomodoroProps.breakTimerMax - pomodoroProps.time) /
                        pomodoroProps.breakTimerMax) *
                      100
                }%,
              hsl(var(--muted)) 0
            )`,
              transition: "all 0.3s ease-in-out",
            }}
            className="relative cursor-pointer rounded-full mx-auto border-8 border-background shadow-2xl flex items-center justify-center w-44 h-44 group"
          >
            <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                {pomodoroProps.paused ? (
                  <Play
                    fill={
                      pomodoroProps.type === "work"
                        ? "hsl(15, 100%, 55%)"
                        : "hsl(120, 60%, 50%)"
                    }
                    size={48}
                    stroke={
                      pomodoroProps.type === "work"
                        ? "hsl(15, 100%, 55%)"
                        : "hsl(120, 60%, 50%)"
                    }
                  />
                ) : (
                  <Pause
                    fill={
                      pomodoroProps.type === "work"
                        ? "hsl(15, 100%, 55%)"
                        : "hsl(120, 60%, 50%)"
                    }
                    size={48}
                    stroke={
                      pomodoroProps.type === "work"
                        ? "hsl(15, 100%, 55%)"
                        : "hsl(120, 60%, 50%)"
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="font-mono text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {minutesLeft}:{secondsLeft}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground mt-4">
                {pomodoroProps.type} Session
              </span>
            </div>
          </div>
          <div className="text-center">
            {pomodoroProps.type == "work" &&
              [-10, -5, 5, 10].map((el) => (
                <Button
                  variant="outline"
                  key={el}
                  onClick={() =>
                    setPomodoroProps((prev) => ({
                      ...prev,
                      timerMax: prev.timerMax + el * 60,
                    }))
                  }
                >
                  {el > 0 ? `+${el}` : el}
                </Button>
              ))}
            {pomodoroProps.type == "break" && (
              <Button
                variant="outline"
                onClick={() =>
                  setPomodoroProps({ ...defaultPomodoroProps, paused: false })
                }
              >
                Skip break
              </Button>
            )}
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
