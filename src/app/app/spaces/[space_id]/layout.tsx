import Pomodoro from "./pomodoro";

export default function Layout({ children }: HaveChild) {
  return (
    <>
      <Pomodoro />
      {children}
    </>
  );
}
