"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

const plans = [
  {
    name: "free",
    features: [
      "Project manager organized for different management techinques.",
      "Capture and notes DB.",
      "Habits tracker.",
      "Limited pro bundle. 5 AI requests per day.",
    ],
    action: () => {
      redirect("/auth/login");
    },
  },
  {
    name: "pro",
    description:
      "Don't throw your effort in the trash! Take Codra! Your assistance.",
    features: [
      "Free bundle included",
      "Features suggestions.",
      "Tasks, sub-tasks, and achievement points.",
      "Codra as assistance! From project bootstraping to project lunching.",
    ],
    flag: "popular",
    monthCost: 10,
    action: () => {},
  },
  {
    name: "ultimate",
    description:
      "You are no longer the only contributor to your project. Say welcome to Codra!",
    features: [
      "Pro bundle included.",
      "Codra can contribute to your projects, and make PRs.",
      "Codra can mentor you! Tests, exams, and periodic tests.",
      "Top priority when answering feed.",
    ],
    additionalInfo: "This bundle is not avaliable right now.",
    avaliable: false,
  },
];

export default function Pricing() {
  return (
    <main className="py-24">
      <section>
        <div className="container">
          <h1 className="text-center py-2 pb-6">Pricing</h1>
          <div className="plans justify-center items-center lg:items-start flex flex-col lg:flex-row gap-4">
            {plans.map((plan) => {
              return (
                <div key={plan.name} className={plan.flag}>
                  <h2 className="mt-1 mb-0">
                    <span className="capitalize">{plan.name}</span>{" "}
                    {plan.monthCost && (
                      <span className="text-lg text-muted-foreground">
                        {plan.monthCost}$/month
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
                    onClick={plan.action}
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
