export type AppNavTabId =
  | "dashboard"
  | "statistics"
  | "bodyMetrics"
  | "settings";

export interface AppNavItem {
  readonly id: AppNavTabId;
  /** Path segment after the app root (e.g. "dashboard" -> "/dashboard"). */
  readonly segment: string;
  readonly label: string;
}

/** Ordered for tab UI (left to right). */
export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  { id: "dashboard", segment: "dashboard", label: "Dashboard" },
  { id: "statistics", segment: "statistics", label: "Statistics" },
  { id: "bodyMetrics", segment: "body-metrics", label: "Body Metrics" },
  { id: "settings", segment: "settings", label: "Settings" },
];

const DEFAULT_APP_NAV_TAB_ID: AppNavTabId = "dashboard";

const APP_NAV_BY_ID = new Map<AppNavTabId, AppNavItem>(
  APP_NAV_ITEMS.map((item) => [item.id, item]),
);

/** Non-default tabs: prefix-checked in this order before falling back to default. */
const PATH_PREFIX_TAB_IDS: readonly AppNavTabId[] = APP_NAV_ITEMS.filter(
  (item) => item.id !== DEFAULT_APP_NAV_TAB_ID,
).map((item) => item.id);

export function appRoutePath(tabId: AppNavTabId): string {
  const item = APP_NAV_BY_ID.get(tabId);
  if (!item) {
    throw new Error(`Unknown app nav tab: ${String(tabId)}`);
  }
  return `/${item.segment}`;
}

/**
 * Maps the current pathname to the active app nav tab. Paths that do not match
 * any non-default prefix use the default tab (dashboard), matching prior layout behavior.
 */
export function getAppNavTabIdFromPathname(pathname: string): AppNavTabId {
  for (const tabId of PATH_PREFIX_TAB_IDS) {
    const item = APP_NAV_BY_ID.get(tabId)!;
    if (pathname.startsWith(`/${item.segment}`)) {
      return tabId;
    }
  }
  return DEFAULT_APP_NAV_TAB_ID;
}
