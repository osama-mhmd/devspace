import { cookies } from "next/headers";
import SubscribeToPomodoro from "./subscribe-to-pomodoro";
import Pomodoro from "./pomodoro";

export default function Layout({ children }: { children: React.ReactNode }) {
  const checked = cookies().get("subscribed-pomodoro")?.value;
  const lastPomodoro = cookies().get("last-pomodoro")?.value;
  const lastPomodoroId = cookies().get("last-pomodoro-id")?.value;

  return (
    <>
      <SubscribeToPomodoro checked={checked ? true : false} />
      {checked == "true" ? (
        <Pomodoro lastPomodoro={{ id: lastPomodoroId, time: lastPomodoro }} />
      ) : null}
      {children}
    </>
  );
}
