import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Button } from "~/components/ui/button";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/circacal-icon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Oops!";
  let message = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "404" : `${error.status}`;
    message =
      error.status === 404
        ? "The page you're looking for doesn't exist."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-md">{message}</p>
        {stack && (
          <pre className="mt-4 max-w-2xl overflow-x-auto rounded-md bg-muted p-4 text-left text-sm">
            <code>{stack}</code>
          </pre>
        )}
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
