import { NavLink, Outlet, redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/layout";
import { CircaCalLogo } from "~/components/circacal-logo";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth.client";
import { getSession } from "~/lib/auth.server";
import { APP_NAV_ITEMS, appRoutePath } from "~/lib/app-routes";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }
  return { user: { name: session.user.name, email: session.user.email } };
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6 sm:py-4">
          <CircaCalLogo
            to={appRoutePath("dashboard")}
            className="shrink-0 flex-row items-center"
          />
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="hidden max-w-[14rem] truncate text-sm text-muted-foreground sm:block md:max-w-[18rem]">
              {user.email}
            </span>

            <Button variant="destructive" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pb-10 pt-6 sm:gap-8 sm:px-6 sm:pb-12 sm:pt-8">
        <Card className="p-6">
          <nav
            aria-label="App sections"
            className="grid w-full grid-cols-2 gap-x-2 gap-y-3 pb-2 sm:grid-cols-4 sm:gap-x-1 sm:gap-y-0"
          >
            {APP_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={appRoutePath(item.id)}
                className={({ isActive }) =>
                  cn(
                    "relative inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-full border border-transparent px-2 py-1 text-center text-sm font-medium transition-all outline-none sm:min-h-9 sm:px-3 sm:whitespace-nowrap",
                    "touch-manipulation after:absolute after:inset-x-0 after:bottom-[-5px] after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity",
                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
                    isActive
                      ? "text-foreground after:opacity-100 dark:text-foreground"
                      : "text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Outlet />
        </Card>
      </main>
    </div>
  );
}
