import { Outlet, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/layout";
import { getSession } from "~/lib/auth.server";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export async function loader({ request }: Route.LoaderArgs) {
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
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Card>
          <div className="flex justify-center">
            <span className="text-xl font-bold tracking-tight">CircaCal</span>
          </div>
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
