import { Button } from "@/components/ui/button";
import Link from "next/link";
import { lilita } from "@/lib/fonts";
import { validateRequest } from "@/db/auth";
import { Circle, Star } from "lucide-react";
import * as m from "@/paraglide/messages";
import { Rocket } from "@/components/icons";
import Image from "next/image";

export default async function Home() {
  const { session } = await validateRequest();

  return (
    <main className="flex flex-col pt-32 h-screen">
      <section>
        <div className="container flex justify-evenly gap-4">
          <div className="flex flex-col max-w-md">
            <h1
              className={
                "text-5xl flex items-center gap-2 sm:text-7xl mb-0 " + lilita
              }
            >
              DevSpace <Rocket />
            </h1>
            <p className={"text-muted-foreground text-2xl my-4 " + lilita}>
              {m.appDescription()}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {!session && (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/auth/login">See pricing</Link>
                  </Button>
                  <Button asChild arrow="has">
                    <Link href="/auth/register">Try it for free</Link>
                  </Button>
                </>
              )}
              {session && (
                <Button asChild>
                  <Link href="/app">{m.app()}</Link>
                </Button>
              )}
              <Button
                variant="link"
                className="underline flex gap-2 text-[#5be4aa]"
              >
                <span className="relative">
                  <Star
                    fill="hsl(var(--background))"
                    className="p-0.5 z-20 relative"
                  />
                  <Circle
                    fill="hsl(var(--primary))"
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </span>{" "}
                {m.starOnGithub()}
              </Button>
            </div>
          </div>
          <Image
            width={500}
            height={500}
            className="hidden lg:block"
            alt="design"
            src="/landing-image.png"
          />
        </div>
      </section>
      <Image
        width={50}
        height={50}
        className="w-full h-56 object-cover"
        alt="design"
        src="/from-1-to-2.svg"
      />
      <section className="bg-[#152227]">
        <div className="container"></div>
      </section>
    </main>
  );
}
