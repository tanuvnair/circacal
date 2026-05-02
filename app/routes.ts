import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Landing
  index("routes/landing-page.tsx"),

  // Auth (redirects to dashboard if already logged in)
  layout("routes/auth/layout.tsx", [
    route("sign-in", "routes/auth/sign-in.tsx"),
    route("sign-up", "routes/auth/sign-up.tsx"),
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
    route("verify-email", "routes/auth/verify-email.tsx"),
  ]),

  // App (protected — auth guard in layout loader)
  layout("routes/app/layout.tsx", [
    route("dashboard", "routes/app/dashboard.tsx"),
    route("statistics", "routes/app/statistics.tsx"),
    route("settings", "routes/app/settings.tsx"),
  ]),

  // API
  route("api/auth/*", "routes/api/auth.$.ts"),
] satisfies RouteConfig;
