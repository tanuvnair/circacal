import type { Route } from "./+types/landing-page";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  RulerIcon,
  ScaleIcon,
  TrendingUpIcon,
} from "lucide-react";
import { CircaCalLogo } from "~/components/circacal-logo";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CircaCal — Daily energy balance, simplified" },
    {
      name: "description",
      content:
        "Each day, record whether you ate in a rough deficit, at maintenance, or in a surplus. Your pick resets nightly; statistics and body metrics help you stay honest over time.",
    },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <CircaCalLogo to="/" className="flex-row gap-2" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>

          <Button size="sm" asChild>
            <Link to="/sign-up">
              Get Started <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </header>

      <Separator />

      <main className="flex flex-1 flex-col items-center justify-center gap-16 px-4 py-16">
        <section className="flex max-w-2xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <CircaCalLogo to="/" iconOnly={true} />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Deficit, maintenance,
              <br />
              <span className="text-primary">or surplus</span>
            </h1>
          </div>

          <p className="max-w-md text-lg text-muted-foreground">
            Skip the spreadsheet. Every day, choose the label that best matches
            how you ate: under maintenance, about right, or over.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/sign-up">
                Start logging <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>

        <section className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <ScaleIcon className="text-primary" />
              <CardTitle>Three choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tap deficit, maintenance, or surplus as a rough honest snapshot.
                No calorie counting, just how today felt relative to your
                maintenance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUpIcon className="text-primary" />
              <CardTitle>Statistics over time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build a history of daily picks so you can spot streaks and
                patterns instead of relying on memory.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <RulerIcon className="text-primary" />
              <CardTitle>Your numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add your weight and related details under Body metrics to unlock
                more insights. We'll use your numbers to provide better trends,
                context, and long-term progress as you keep logging days.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Separator />

      <footer className="flex items-center justify-center px-6 py-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CircaCal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
