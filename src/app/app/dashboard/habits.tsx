import Habit from "@/types/habit";
import AddHabit from "./add-habit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SaveRecordButton from "./save-record";
import getRecords from "@/db/actions/habits/get-records";
import HabitLink from "./habit-link";
import { CircleCheck, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages";

export default async function Habits({ habits }: { habits: Habit[] }) {
  const today = new Date();

  return (
    <div className="bg-green-200 dark:bg-green-900/30">
      <h2 className="my-0">{m.habits()} 🔥</h2>
      <div className="flex *:w-full flex-col gap-2">
        {habits.map(async (habit, index) => {
          const records = await getRecords(habit.id);
          let done = false,
            streak = 0;

          const dates = records
            ? records.map((el) => {
                return el.record_date;
              })
            : [];

          if (dates[dates.length - 1]) {
            if (dates[dates.length - 1].getDate() == today.getDate())
              done = true;

            dates.reverse();
            for (let i = 0; i < dates.length; i++) {
              if (dates[i].getDate() == today.getDate() - i) streak++;
              else break;
            }
          }

          return (
            <Dialog key={index}>
              <DialogTrigger>
                <div
                  className={cn(
                    "rounded-md bg-green-300 flex justify-between items-center hover:ring-2 ring-black dark:ring-white dark:bg-green-800/30 py-3 px-4 cursor-pointer",
                    done && "opacity-50 hover:opacity-100 transition",
                  )}
                >
                  <div
                    className={cn(
                      "contain-icons !gap-2",
                      done && "line-through",
                    )}
                  >
                    {done && (
                      <CircleCheck className="text-green-700 dark:text-green-500/30" />
                    )}
                    <HabitLink name={habit.name} id={habit.id} />
                    <p className="text-muted-foreground">{habit.quote}</p>
                  </div>
                  <div className="contain-icons bg-green-200 dark:bg-green-900/30 px-3 py-2 rounded-md">
                    {streak}{" "}
                    {done ? (
                      <Flame fill="#22c55e" stroke="#22c55e" />
                    ) : (
                      <Flame />
                    )}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{habit.name}</DialogTitle>
                </DialogHeader>
                <p>{habit.quote}</p>
                <div className="m-1 rounded-md bg-muted/50 p-4 text-center">
                  {done ? (
                    <p className="text-muted-foreground font-bold">
                      <CircleCheck
                        size={80}
                        className="mx-auto mb-4 text-green-500"
                      />
                      {m.habitDone()}
                    </p>
                  ) : (
                    <div>
                      <p className="my-4 mb-6 text-7xl">🎯</p>
                      <SaveRecordButton habitId={habit.id} />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
        {!habits.length && <i>{m.noHabits()}</i>}
        <AddHabit />
      </div>
    </div>
  );
}
