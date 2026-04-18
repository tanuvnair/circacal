import { Outlet, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/layout";
import type { HandlerResult } from "~/types/handler-result";
import { ArrowLeftIcon } from "lucide-react";
import { getSession } from "~/lib/auth.server";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { CircaCalLogo } from "~/components/circacal-logo";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<HandlerResult | null> {
  const session = await getSession(request);
  if (session) {
    throw redirect("/dashboard");
  }

  return null;
}

export default function AuthLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeftIcon data-icon="inline-start" /> Back
        </Button>
        <Card>
          <CircaCalLogo to="/" className="py-2" />
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
