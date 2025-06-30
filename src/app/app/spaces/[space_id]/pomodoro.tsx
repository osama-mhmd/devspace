"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import createPomodoro from "@/db/actions/pomodoros/create";
import updatePomodoro from "@/db/actions/pomodoros/update";
import { isNumericString } from "@/db/utils/utils";
import { AlarmClock, Pause, Play } from "lucide-react";
import { useEffect, useCallback, useState, useRef } from "react";
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
  const keys = Object.keys(defaultPomodoroProps);

  const result = {} as Pomodoro;

  for (const key of keys) {
    const value = localStorage.getItem(`last-pomodoro.${key}`);

    if (!value) continue;

    Object.defineProperty(result, key, {
      value: isNumericString(value) ? +value : value,
      enumerable: true,
    });
  }

  return result;
}

interface Pomodoro {
  id: string;
  time: number;
  type: "work" | "break";
  paused: boolean;
  timerMax: number;
  breakTimerMax: number;
}

const defaultPomodoroProps: Pomodoro = {
  id: "",
  time: 0,
  type: "work",
  paused: true,
  timerMax,
  breakTimerMax,
};

export default function Pomodoro() {
  const [pomodoroProps, setPomodoroProps] =
    useState<Pomodoro>(defaultPomodoroProps);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const pausedTime = useRef<number>(0);
  const pausedAt = useRef<number>(0);

  const minutesLeft = `${Math.floor(pomodoroProps.time / 60)}`.padStart(2, "0");
  const secondsLeft = `${pomodoroProps.time % 60}`.padStart(2, "0");

  useEffect(() => {
    const lastPomodoro = getLastPomodoro();

    setPomodoroProps({
      ...defaultPomodoroProps,
      ...lastPomodoro,
      paused: !lastPomodoro.time,
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

    const initialTime = Date.now() - pomodoroProps.time * 1000;
    pausedAt.current = Date.now();

    const interval = setInterval(async () => {
      setPomodoroProps((prev) => {
        if (prev.paused) return prev;

        const time = Math.floor(
          (Date.now() - (initialTime + pausedTime.current)) / 1000,
        );

        // saving to the db every minute in the work mode
        if (time % 60 == 0 && prev.type === "work" && time !== 0) {
          // FIX: Bad approach, I think :(
          setTimeout(async () => {
            try {
              const result = await updatePomodoro(prev.id, prev.time);
              if (!result) toast.error("Something went wrong!");
            } catch {
              toast.error("Something went wrong");
            }
          }, 500);
        }

        if (prev.type === "work" && time >= prev.timerMax) {
          const message = "Time's up! Take a 5 minutes break";

          // Notifications (toast, and web)
          toast.success(message);
          new Notification(message);

          // Reset localStorage, and Pomodoro
          saveLocally(0, "break", "");
          return { ...defaultPomodoroProps, type: "break" };
        }

        if (prev.type === "break" && time >= prev.breakTimerMax) {
          const message = "Break finished! Let's start again";

          toast.success(message);
          new Notification(message);

          // Reset localStorage, and Pomodoro
          saveLocally(0, "work", "");
          return defaultPomodoroProps;
        }

        // update the localStorage
        saveLocally(time);

        return { ...prev, time: time };
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

  const changeMax = useCallback(
    (timer: "timerMax" | "breakTimerMax", minutes: number) => {
      const proposedNewTime = pomodoroProps[timer] + minutes * 60;

      const thresholds = {
        timerMax: 15,
        breakTimerMax: 2,
      } as const;

      if (proposedNewTime < thresholds[timer] * 60) {
        toast(`Work timer cannot be less than ${thresholds[timer]} minutes`);
        return;
      }

      setPomodoroProps((prev) => ({
        ...prev,
        [timer]: proposedNewTime,
      }));
    },
    [pomodoroProps.timerMax, pomodoroProps.breakTimerMax],
  );

  console.log(pausedTime);

  const handlePause = useCallback(() => {
    if (!isInitialized) return;

    const paused = !pomodoroProps.paused;

    if (paused) pausedAt.current = Date.now();
    if (!paused) pausedTime.current += Date.now() - pausedAt.current;

    setPomodoroProps((prev) => ({ ...prev, paused }));
  }, [isInitialized, pomodoroProps.paused]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed z-[23] top-2 right-2 rtl:left-2">
          <Button variant="secondary" className="gap-2">
            {minutesLeft}:{secondsLeft}
            <AlarmClock size={18} className="mb-0.5" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pomodoro</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-2 py-6">
          <div
            onClick={handlePause}
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
                <span className="size-2 bg-blue-700 inline-block mx-2 rounded-full"></span>
                {(pomodoroProps.type == "work"
                  ? pomodoroProps.timerMax
                  : pomodoroProps.breakTimerMax) / 60}{" "}
                minute
              </span>
            </div>
          </div>
          <div className="text-center space-x-1">
            {pomodoroProps.type == "work" &&
              [-10, -5, 5, 10].map((el) => (
                <Button
                  variant="outline"
                  key={el}
                  onClick={() => changeMax("timerMax", el)}
                >
                  {el > 0 ? `+${el}` : el}
                </Button>
              ))}
            {pomodoroProps.type == "break" &&
              [-1, 1].map((el) => (
                <Button
                  variant="outline"
                  key={el}
                  onClick={() => changeMax("breakTimerMax", el)}
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
      </DialogContent>
    </Dialog>
  );
}
