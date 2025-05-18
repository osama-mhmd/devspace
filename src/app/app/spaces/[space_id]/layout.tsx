import { cookies } from "next/headers";
import Pomodoro from "./pomodoro";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lastPomodoroType = (await cookies()).get("last-pomodoro.type")?.value;
  const lastPomodoroId = (await cookies()).get("last-pomodoro.id")?.value;
  const lastPomodoroTime = (await cookies()).get("last-pomodoro.time")?.value;

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
