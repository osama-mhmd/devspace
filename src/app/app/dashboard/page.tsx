import { Button } from "@/components/ui/button";
import { validateRequest } from "@/db/auth";
import { redirect } from "next/navigation";
import Habits from "./habits";
import getHabits from "@/db/actions/habits/get-habits";
import Habit from "@/types/habit";
import * as m from "@/paraglide/messages";

export default async function Dashboard() {
  const { user } = await validateRequest();

  // just in case
  if (!user) redirect("/app");

  const habits = await getHabits();

  if (!habits) return false;

  return (
    <section>
      <div className="container my-12">
        <h1 className="mb-4">
          {m.hello()}, <span className="text-blue-500">{user.name}</span>
        </h1>
        <div className="flex flex-col gap-1 *:rounded-md *:p-4 *:px-6 *:flex *:pb-6 *:flex-col *:gap-4">
          <Habits habits={habits as Habit[]} />
          <p className="text-muted-foreground font-bold text-center my-1">
            ProTip 💡! Click on the habit label to go the full habit
          </p>
          <div className="bg-rose-200 dark:bg-rose-900">
            <h2 className="my-0">Notes 📝</h2>
            <p className="flex flex-col gap-2 items-center">
              <i>No Notes</i>
              <Button>Create your first note</Button>
            </p>
          </div>
          <div className="bg-blue-200 dark:bg-blue-900">
            <h2 className="my-0">Capture ✅</h2>
            <p className="flex flex-col gap-2 items-center">
              <i>No Captures</i>
              <Button>Create your first capture</Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
