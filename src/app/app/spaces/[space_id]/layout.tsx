import { cookies } from "next/headers";
import Pomodoro from "./pomodoro";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cs = await cookies(); // cookie store
  const lastPomodoroType = cs.get("last-pomodoro.type")?.value;
  const lastPomodoroId = cs.get("last-pomodoro.id")?.value;
  const lastPomodoroTime = cs.get("last-pomodoro.time")?.value;

  return (
    <>
      <Pomodoro
        lastPomodoro={{
          time: lastPomodoroTime,
          id: lastPomodoroId,
          type: lastPomodoroType,
        }}
      />
      {children}
    </>
  );
}
