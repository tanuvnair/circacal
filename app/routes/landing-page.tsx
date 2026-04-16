import type { Route } from "./+types/landing-page";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CircaCal" },
    { name: "description", content: "Welcome to CircaCal!" },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">CircaCal</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Your smart calorie companion. Organize your time, effortlessly.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link to="/sign-up">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
