import { Button } from "@/components/ui/button";
import Link from "next/link";
import { merienda } from "@/lib/fonts";
import { validateRequest } from "@/db/auth";
import { Circle, Star } from "lucide-react";
import * as m from "@/paraglide/messages";

export default async function Home() {
  const { session } = await validateRequest();

  return (
    <main className="flex flex-col mt-6">
      <div className="container flex flex-col gap-4">
        <h1 className={"text-5xl sm:text-7xl mb-0 " + merienda}>
          {/* TODO: some effects (eg. realistic highlight) */}
          Nonote: <span className="text-primary">free, open source</span>, for
          developers note taking app
        </h1>
        <p className="text-muted-foreground max-w-prose mt-2">
          {m.nonoteDescription()}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {!session && (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">{m.login()}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">{m.createAccount()}</Link>
              </Button>
            </>
          )}
          {session && (
            <Button asChild>
              <Link href="/app">{m.app()}</Link>
            </Button>
          )}
          <Button variant="link" className="underline flex gap-2">
            <span className="relative">
              <Star fill="white" className="p-0.5" />
              <Circle
                fill="hsl(var(--primary))"
                className="-z-10 absolute top-0 left-0 w-full h-full"
              />
            </span>{" "}
            {m.starOnGithub()}
          </Button>
        </div>
        <div></div>
      </div>
    </main>
  );
}
