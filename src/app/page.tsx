"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Code2,
  Zap,
  Users,
  Sparkles,
  Rocket,
  Brain,
  Target,
  Coffee,
  Timer,
  Calendar,
  FileText,
  GitBranch,
  MessageSquare,
  Palette,
  Shield,
  Heart,
  icons,
} from "lucide-react";
import GithubIcon from "@/components/icons/github";
import Link from "next/link";
import MockWindow from "@/components/mock-window";

const features = [
  {
    icon: Target,
    title: "All in One Place",
    description:
      "Capture notes, track habits, manage projects, and write daily logs without leaving the app. Everything organized exactly how you need it.",
  },
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Let AI evaluate tasks, suggest features, estimate project duration, and help you make better decisions before investing effort.",
  },
  {
    icon: Code2,
    title: "Developer-First Design",
    description:
      "Built by developers, for developers. Enjoy a product that understands your workflow and adapts to your coding lifestyle.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description:
      "Tailor every aspect to your preferences. Themes, layouts, integrations - make DevSpace truly yours.",
  },
  {
    icon: Users,
    title: "Team & Individual",
    description:
      "Scale from personal productivity to team collaboration seamlessly. Perfect for solo developers and growing teams.",
  },
  {
    icon: Shield,
    title: "Open & Secure",
    description:
      "Fully open source with transparent development. Your data stays yours, always. No vendor lock-in, ever.",
  },
];

const counters = [
  { label: "Open Source", value: "100", suffix: "%" },
  { label: "Features", value: "50", suffix: "+" },
  { label: "Developers", value: "1000", suffix: "+" },
  { label: "GitHub Stars", value: "2500", suffix: "+" },
];

const features2 = [
  {
    icon: FileText,
    text: "Smart note organization and linking",
  },
  {
    icon: Timer,
    text: "Time tracking and productivity insights",
  },
  {
    icon: Calendar,
    text: "Project planning and milestone tracking",
  },
  {
    icon: GitBranch,
    text: "Git integration and branch management",
  },
  {
    icon: MessageSquare,
    text: "Team communication and updates",
  },
  {
    icon: Coffee,
    text: "Daily standup and retrospective tools",
  },
];

type LucideIcon = (typeof icons)[keyof typeof icons];

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card
      className={`group hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 bg-gradient-to-br from-background to-muted/50 border-2 hover:border-primary/50 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
          <Icon className="h-8 w-8 text-primary transition-transform duration-300" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

interface AnimatedCounterProps {
  end: number;
  suffix: string;
  duration?: number;
}

const AnimatedCounter = ({
  end,
  suffix = "",
  duration = 2000,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay: number;
  className?: string;
}

const FloatingElement = ({
  children,
  delay = 0,
  className = "",
}: FloatingElementProps) => {
  return (
    <div
      className={`animate-pulse opacity-20 absolute ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: "3s",
      }}
    >
      {children}
    </div>
  );
};

export default function AwesomeLandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden relative">
      {/* Floating Background Elements */}
      <FloatingElement delay={0} className="top-20 left-10">
        <Code2 className="h-12 w-12 text-primary" />
      </FloatingElement>
      <FloatingElement delay={1} className="top-40 right-20">
        <Zap className="h-8 w-8 text-primary" />
      </FloatingElement>
      <FloatingElement delay={2} className="bottom-40 left-20">
        <Rocket className="h-10 w-10 text-primary" />
      </FloatingElement>
      <FloatingElement delay={0.5} className="top-60 right-40">
        <Brain className="h-6 w-6 text-primary" />
      </FloatingElement>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center relative">
          <div
            className={`transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <Badge
              variant="secondary"
              className="mb-10 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Open Source & Developer-First
            </Badge>

            <h1 className="tracking-tight text-7xl md:text-6xl font-black pb-8 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              The only productivity tool you need for you
            </h1>

            <p className="text-lg md:text-xl mb-12 text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
              DevSpace: Open source, free, customizable, extendable, AI
              integration, developer-first, and available for teams/individuals.
              We missed anything?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button asChild size="lg">
                <Link href="/app">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Building
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>

              <Button variant="link" asChild className="gap-2" size="lg">
                <a href="https://github.com/osama-mhmd/devspace">
                  <span className="mb-1">
                    <GithubIcon />
                  </span>
                  Star on GitHub
                </a>
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {counters.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    <AnimatedCounter
                      end={parseInt(stat.value)}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl pb-6 font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Everything You Need
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A comprehensive productivity suite designed specifically for
                developers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, i) => (
                <FeatureCard
                  key={`feature-${i}`}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={(i + 1) * 100}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Zap className="mr-2 h-4 w-4" />
                  Productivity Features
                </Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Streamline Your Development Workflow
                </h3>
                <div className="space-y-2">
                  {features2.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 text-lg"
                    >
                      <div className="p-2 bg-primary/10 rounded-full">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <MockWindow />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Join thousands of developers who&lsquo;ve already revolutionized
                their productivity with DevSpace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg">Get Started Free</Button>

                <Button variant="outline" size="lg">
                  <Heart className="mr-2 size-5" fill="red" stroke="red" />
                  Support Us
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-8">
                No credit card required • Open source forever • Start in seconds
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
