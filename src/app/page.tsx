import { Button } from "@/components/ui/button";
import Link from "next/link";
import { validateRequest } from "@/db/auth";
import * as m from "@/paraglide/messages";
import { Rocket } from "@/components/icons";
import Image from "next/image";
import From1To2 from "./from-1-to-2";
import CallAuthorize from "@/components/authorize";
import Footer from "./footer";

export default async function Home() {
  const { session } = await validateRequest();

  return (
    <main className="flex flex-col">
      <section>
        <div className="container flex justify-evenly gap-4 mt-4">
          <div className="flex flex-col max-w-md">
            <h1 className="text-5xl flex items-center gap-2 sm:text-7xl mb-0 font-lilita">
              DevSpace <Rocket />
            </h1>
            <p className="text-muted-foreground text-2xl my-4 font-lilita">
              {m.appDescription()}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {!session && (
                <>
                  <CallAuthorize variant="outline">Login</CallAuthorize>
                  <CallAuthorize arrow="has">Sign up for free</CallAuthorize>
                </>
              )}
              {session && (
                <Button asChild>
                  <Link href="/app">{m.app()}</Link>
                </Button>
              )}
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
      <From1To2 />
      <section className="bg-muted dark:bg-muted/50">
        <div className="container">
          <h1 className="text-center mx-auto font-lilita max-w-prose text-balance">
            Join Our Community And Enjoy A Niche Productivty Tool For Developers
          </h1>
          <div className="features-grid">
            <div>
              <div>
                <Image
                  src="/landing-features-all-in-one.png"
                  width={300}
                  height={300}
                  alt="All in one"
                />
              </div>
              <article>
                <h3>All in one place</h3>
                <p>
                  Without leaving the app, your notes are organized. You can
                  capture, track habits, write daily standup, write daily log.
                  Let DevSpace manage your projects, tasks, and even plans.
                </p>
              </article>
            </div>
            <div>
              <div>
                <Image
                  src="/landing-features-ai.png"
                  width={300}
                  height={300}
                  alt="AI"
                />
              </div>
              <article>
                <h3>All in one place</h3>
                <div>
                  Let AI:
                  <ul>
                    <li>Evaluate tasks (points, subtasks, duration)</li>

                    <li>Suggest features</li>

                    <li>
                      Evaluate projects ideas before putting effort into it
                    </li>
                  </ul>
                </div>
              </article>
            </div>
            <div>
              <div>
                <Image
                  src="/landing-features-niche-product.png"
                  width={300}
                  height={300}
                  alt="All in one"
                />
              </div>
              <article>
                <h3>A niche product</h3>
                <p>
                  Enjoy using a product customized for you. If you have any
                  issues, or features, feel free to report about it.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="blurry-bg p-6">
        <h1 className="text-center font-lilita">
          Don{"'"}t waste your time and start using DevSpace today.
        </h1>
      </section>
      <Footer />
    </main>
  );
}
