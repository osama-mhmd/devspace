import { Button } from "@/components/ui/button";
import Link from "next/link";
import { lilita } from "@/lib/fonts";
import { validateRequest } from "@/db/auth";
import { Circle, Star } from "lucide-react";
import * as m from "@/paraglide/messages";
import Rocket from "@/components/icons/rocket";

export default async function Home() {
  const { session } = await validateRequest();

  return (
    <main
      className="flex flex-col pt-28 h-screen bg-gradient-to-br from-gray-900 to-blue-900"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, #1e3a8a 10%, #111827 65%)",
      }}
    >
      <div className="container flex items-center text-center flex-col gap-4">
        <h1
          className={
            "text-5xl flex items-center gap-2 sm:text-7xl mb-0 " + lilita
          }
        >
          DevSpace <Rocket />
        </h1>
        <p
          className={
            "text-muted-foreground text-2xl max-w-prose mb-2 " + lilita
          }
        >
          {m.appDescription()}
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
