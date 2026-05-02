import {
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import type { Route } from "./+types/layout";
import { CircaCalLogo } from "~/components/circacal-logo";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth.client";
import { getSession } from "~/lib/auth.server";
import {
  APP_NAV_ITEMS,
  appRoutePath,
  getAppNavTabIdFromPathname,
  type AppNavTabId,
} from "~/lib/app-routes";
import { Card } from "~/components/ui/card";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }
  return { user: { name: session.user.name, email: session.user.email } };
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const tabValue = getAppNavTabIdFromPathname(location.pathname);

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
          <Tabs
            value={tabValue}
            onValueChange={(value) => {
              navigate(appRoutePath(value as AppNavTabId));
            }}
          >
            <TabsList
              variant="line"
              className="flex w-full min-w-0 justify-stretch gap-0 sm:justify-start sm:gap-1"
            >
              {APP_NAV_ITEMS.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="min-h-11 flex-1 touch-manipulation sm:min-h-9 sm:flex-none"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Outlet />
        </Card>
      </main>
    </div>
  );
}
