import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";
import { getSession } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }
  return { user: { name: session.user.name, email: session.user.email } };
}

export default function AppLayout() {
  return <Outlet />;
}
