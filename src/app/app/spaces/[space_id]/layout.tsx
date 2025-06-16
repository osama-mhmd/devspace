import Pomodoro from "./pomodoro";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Pomodoro />
      {children}
    </>
  );
}
