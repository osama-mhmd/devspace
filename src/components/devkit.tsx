import Link from "next/link";
import { ThemeToggle } from "./change-theme";
import { Button } from "./ui/button";

export default function DevKit() {
  if (process.env.NODE_ENV == "production") return;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-muted rounded-xl px-4 py-2 opacity-10 hover:opacity-100 flex gap-1 items-center">
      <Button asChild>
        <Link href="/">/</Link>
      </Button>
      <Button asChild>
        <Link href="/app">App</Link>
      </Button>
      <ThemeToggle />
    </div>
  );
}
