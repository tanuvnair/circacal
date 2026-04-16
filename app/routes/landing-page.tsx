import type { Route } from "./+types/landing-page";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  FlameIcon,
  TargetIcon,
  TrendingUpIcon,
  UtensilsIcon,
} from "lucide-react";
import { CircaCalLogo } from "~/components/circacal-logo";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CircaCal — Smart Calorie Tracking" },
    {
      name: "description",
      content:
        "Track your calories effortlessly. Set goals, log meals, and see your progress.",
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
              Track Calories,
              <br />
              <span className="text-primary">Not Stress</span>
            </h1>
          </div>
          <p className="max-w-md text-lg text-muted-foreground">
            Your smart calorie companion. Log meals, set daily goals, and
            visualize your progress — all in one place.
          </p>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link to="/sign-up">
                Start Tracking <ArrowRightIcon data-icon="inline-end" />
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
              <UtensilsIcon className="text-primary" />
              <CardTitle>Log Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Quickly log what you eat throughout the day with a simple,
                intuitive interface.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TargetIcon className="text-primary" />
              <CardTitle>Set Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Define your daily calorie targets and stay on track with
                real-time feedback.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUpIcon className="text-primary" />
              <CardTitle>See Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize trends over time and understand your eating habits at
                a glance.
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
