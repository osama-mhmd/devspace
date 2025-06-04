"use client";

import { AI } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

interface Plan {
  name: string;
  description?: string;
  features: string[];
  action?: (router: AppRouterInstance) => void;
  cost?: string;
  additionalInfo?: string;
  avaliable?: boolean;
  flag?: string;
}

const plans: Plan[] = [
  {
    name: "free",
    features: ["Core Functionality", "Unlimited Projects"],
    action: (router: AppRouterInstance) => {
      router.push("/?login");
    },
  },
  {
    name: "plus",
    description: "We really appreciate that",
    features: ["Execlusive emojis/badges", "Feedback priority"],
    flag: "DevSpace Supporter",
    cost: "starts from 5$",
    action: () => {},
  },
];

export default function Pricing() {
  const router = useRouter();

  return (
    <main className="py-16">
      <style jsx global>{`
        body {
          background-image: radial-gradient(#00000044 1px, #dddddd 1px);
          background-size: 20px 20px;
        }
        .dark body {
          background-image: radial-gradient(#ffffff44 1px, #252525 1px);
        }
      `}</style>
      <section>
        <div className="container overflow-hidden">
          <h1 className="text-center py-2 pb-6">Pricing</h1>
          <p className="text-center text-green-700 dark:text-green-400 max-w-prose mx-auto rounded-md mb-8">
            DevSpace is an open-source tool and is <b>completely free</b> to
            use. Supporting us is entirely optional, but we truly appreciate any
            contributions.
          </p>
          <div className="plans justify-center items-center lg:items-start flex flex-col lg:flex-row gap-4">
            {plans.map((plan) => {
              return (
                <div
                  key={plan.name}
                  className={plan.flag && "flag"}
                  data-flag={plan.flag}
                >
                  {plan.flag && (
                    <div className="absolute -top-1/4 -right-1/4 hidden sm:block">
                      <AI />
                    </div>
                  )}
                  <h2 className="mt-1 mb-0">
                    <span className="capitalize">{plan.name}</span>{" "}
                    {plan.cost && (
                      <span className="text-lg text-muted-foreground">
                        {plan.cost}
                      </span>
                    )}
                  </h2>
                  {plan.description && (
                    <p className="text-muted-foreground -translate-y-2">
                      {plan.description}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => {
                      return (
                        <li key={i} className="grid grid-cols-[20px,1fr] gap-2">
                          <Check size={20} className="mt-0.5" />
                          {feature}
                        </li>
                      );
                    })}
                  </ul>
                  {plan.additionalInfo && (
                    <p className="text-green-700 dark:text-green-400">
                      {plan.additionalInfo}
                    </p>
                  )}
                  <Button
                    variant={plan.flag ? "default" : "secondary"}
                    arrow="has"
                    onClick={() => plan.action && plan.action(router)}
                    disabled={plan.avaliable == false}
                  >
                    Get started
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
