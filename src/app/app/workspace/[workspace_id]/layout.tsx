import { cookies } from "next/headers";
import SubscribeToPomodoro from "./subscribe-to-pomodoro";
import Pomodoro from "./pomodoro";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const subscribed = (await cookies()).get("subscribed-pomodoro")?.value;
  const lastPomodoroType = (await cookies()).get("last-pomodoro.type")?.value;
  const lastPomodoroId = (await cookies()).get("last-pomodoro.id")?.value;
  const lastPomodoroTime = (await cookies()).get("last-pomodoro.time")?.value;

  return (
    <>
      {subscribed == undefined && <SubscribeToPomodoro />}
      {subscribed == "true" ? (
        <Pomodoro
          lastPomodoro={{
            time: lastPomodoroTime,
            id: lastPomodoroId,
            type: lastPomodoroType,
          }}
        />
      ) : null}
      {children}
    </>
  );
}
