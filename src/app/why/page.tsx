"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Rocket,
  Code2,
  Zap,
  Heart,
} from "lucide-react";
import Link from "next/link";

const styles = {
  storeSectionCard:
    "bg-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-foreground/10 hover:border-foreground/20 transition-all",
};

export default function Why() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pillars = [
    {
      title: "Simple",
      description: "The app I will use needs to be simple — not overwhelming.",
      icon: <Zap className="w-8 h-8" />,
      color: "from-blue-400 to-cyan-400",
    },
    {
      title: "Batteries Included",
      description:
        "However, the app needs to be powerful. I want to stay in one place as much as possible. As a developer, that means it should include essential tools — like project management.",
      icon: <Code2 className="w-8 h-8" />,
      color: "from-purple-400 to-pink-400",
    },
    {
      title: "Customizable",
      description:
        "I need to shape the app on my terms — not let it dictate how it should work.",
      icon: <Target className="w-8 h-8" />,
      color: "from-orange-400 to-red-400",
    },
  ];

  const apps = [
    {
      name: "Notion",
      score: "1/3",
      reason: "missing simplicity/customizability",
      passed: false,
    },
    {
      name: "Obsidian",
      score: "2/3",
      reason: "missing batteries",
      passed: false,
    },
    {
      name: "GitHub Projects/Jira",
      score: "1.5/3",
      reason: "incomplete solution",
      passed: false,
    },
  ];

  return (
    <section className="min-h-screen relative overflow-hidden">
      <style>{`
        bodys {
          background-image: linear-gradient(
            to bottom right,
            hsl(var(--background)),
            #f1f5f9,
            hsl(var(--background))
          ) !important;
        }
        .dark body {
          background-image: linear-gradient(
            to bottom right,
            hsl(var(--background)),
            #020617,
            hsl(var(--background))
          ) !important;
        }
      `}</style>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-100"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>

      <div
        className={`relative py-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-foreground/10 backdrop-blur-sm rounded-full border border-foreground/20">
              <Lightbulb className="size-5 text-yellow-700 dark:text-yellow-400 animate-pulse" />
              <span className="text-sm text-foreground/80">
                The Origin Story
              </span>
            </div>

            <h1 className="text-7xl font-bold pb-6 bg-gradient-to-r from-orange-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Why?
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every great app has a story. This is the story of DevSpace - born
              from frustration, built with purpose.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <div className={styles.storeSectionCard}>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-semibold">The Problem</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  None of the productivity tools fit me. I&#39;ve tried almost
                  all of them, but I still haven&#39;t found the right one. The
                  problem isn&#39;t that I haven&#39;t found the right tool —
                  the problem is, I don&#39;t know why I can&#39;t, or what
                  exactly I need.
                </p>
              </div>

              <div className={styles.storeSectionCard}>
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold">The Journey</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  I tried searching about productivity and became obsessed with
                  it — which eventually led to frustration (there&#39;s an
                  overwhelming amount of productivity content). But after
                  searching and searching, I finally found what I need.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-foreground/10 to-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-foreground/20">
              <h3 className="text-2xl font-bold mb-6 text-center">
                The Apps I Tried
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Notion",
                  "Obsidian",
                  "TickTick",
                  "Google Keep",
                  "Trello",
                  "Jira",
                  "GitHub Projects",
                  "Evernote",
                  "Anytype",
                  "Project Planner AI",
                  "Habitica",
                  "Calendar",
                  "Forest",
                ].map((app, index) => (
                  <div
                    key={app}
                    className="bg-foreground/5 rounded-lg p-3 text-center text-sm text-muted-foreground hover:bg-foreground/10 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {app}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4">
              The Three Pillars
            </h2>
            <p className="text-center text-foreground/70 mb-12 text-lg">
              The app that I will use should have the following characteristics:
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <div
                  key={index}
                  className={`relative bg-foreground/5 backdrop-blur-sm rounded-2xl p-8 border transition-all ${
                    activeSection === index
                      ? "border-foreground/30 bg-foreground/10"
                      : "border-foreground/10"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${pillar.color} mb-6`}
                  >
                    {pillar.icon}
                  </div>

                  <div className="text-2xl font-bold mb-2">
                    {index + 1}. {pillar.title}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>

                  {activeSection === index && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* App Evaluation */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center pb-2">The Verdict</h2>
            <p className="text-center text-white/70 mb-8">
              From these constraints, what apps do we have?
            </p>

            <div className="max-w-2xl mx-auto space-y-4">
              {apps.map((app, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-6 rounded-2xl border transition-all hover:ring-2 ${
                    app.passed
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {app.passed ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <span
                      className={`text-lg font-medium ${app.passed ? "text-green-800 dark:text-green-100" : "text-red-800 dark:text-red-100 line-through"}`}
                    >
                      {app.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">{app.score}</div>
                    <div className="text-xs text-muted-foreground">
                      {app.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="text-center mb-20">
            <div className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <h2 className="text-4xl font-bold text-white mb-6">
                The Solution: DevSpace
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
                So, I decided to build DevSpace — open-source and free. Finally,
                I wrote this page as a reminder — to look at it, see my goal,
                and remember why I should keep going.
              </p>

              <Link
                href="https://github.com/osama-mhmd/devspace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 rounded-full text-white font-medium"
              >
                <Rocket className="w-5 h-5" />
                Love the idea, Contribute with us?
              </Link>
            </div>
          </div>

          <Separator className="bg-white/20 mb-8" />

          {/* Footer */}
          <div className="text-center">
            <p className="text-white/60">
              First wrote on:{" "}
              <span className="text-white/80 font-medium">
                7 Dhu al-Hijjah 1446 (3 June 2025)
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
