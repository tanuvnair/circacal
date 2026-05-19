import {
  ChartNoAxesColumn,
  ChartNoAxesColumnDecreasing,
  ChartNoAxesColumnIncreasing,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { redirect, useFetcher, useLoaderData } from "react-router";

import type { Route } from "./+types/dashboard";
import { ESTIMATE_CONFIG, type BalanceEstimate } from "~/lib/estimate-config";
import { Estimate } from "../../../generated/prisma/enums";
import {
  findDailyEnergyRecordForUserDate,
  upsertDailyEnergyRecord,
} from "~/db-repositories/daily-energy-record.repository.server";
import { findUserById } from "~/db-repositories/user.repository.server";
import { getSession } from "~/lib/auth.server";
import { resolveStoredTimeZone } from "~/lib/user-time-zone";
import {
  endOfZonedCalendarDayUtc,
  isoDateOnlyToUtcMidnight,
  startOfZonedCalendarDayUtc,
  utcInstantToZonedDateOnly,
} from "~/lib/zoned-wall-time";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Dashboard - CircaCal" }];
}

const ESTIMATE_KEYS: BalanceEstimate[] = ["surplus", "maintenance", "deficit"];
function formatTimeLeftUntil(nextMidnightUtcMs: number, nowMs: number): string {
  const ms = Math.max(0, nextMidnightUtcMs - nowMs);
  if (ms === 0) {
    return "The calendar day has rolled over in your time zone.";
  }
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) {
    return `${m}m left in your calendar day`;
  }
  return `${h}h ${m}m left in your calendar day`;
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }

  const user = await findUserById(session.user.id);
  const timeZone = resolveStoredTimeZone(user?.timeZone);

  const todayYmd = utcInstantToZonedDateOnly(new Date(), timeZone);
  const dateForDb = isoDateOnlyToUtcMidnight(todayYmd);

  const row = await findDailyEnergyRecordForUserDate(
    session.user.id,
    dateForDb,
  );

  const todayStart =
    startOfZonedCalendarDayUtc(todayYmd, timeZone) ?? new Date();
  const todayLongLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(todayStart);

  const compactDateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(todayStart);

  const endToday = endOfZonedCalendarDayUtc(todayYmd, timeZone);
  const nextMidnightUtcIso =
    endToday !== null
      ? new Date(endToday.getTime() + 1).toISOString()
      : null;

  const PRISMA_TO_BALANCE: Record<Estimate, BalanceEstimate> = {
    DEFICIT: "deficit",
    MAINTENANCE: "maintenance",
    SURPLUS: "surplus",
  };

  return {
    estimate: row ? PRISMA_TO_BALANCE[row.energyEstimate] : null,
    todayLongLabel,
    compactDateLabel,
    nextMidnightUtcIso,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }

  const user = await findUserById(session.user.id);
  const timeZone = resolveStoredTimeZone(user?.timeZone);

  const formData = await request.formData();
  const raw = formData.get("energyEstimate");
  if (
    typeof raw !== "string" ||
    (raw !== "deficit" && raw !== "maintenance" && raw !== "surplus")
  ) {
    return { ok: false as const, error: "Invalid estimate." };
  }
  const estimate = raw as BalanceEstimate;

  const todayYmd = utcInstantToZonedDateOnly(new Date(), timeZone);
  const dateForDb = isoDateOnlyToUtcMidnight(todayYmd);

  const BALANCE_TO_PRISMA: Record<BalanceEstimate, Estimate> = {
    deficit: Estimate.DEFICIT,
    maintenance: Estimate.MAINTENANCE,
    surplus: Estimate.SURPLUS,
  };

  await upsertDailyEnergyRecord(
    session.user.id,
    dateForDb,
    BALANCE_TO_PRISMA[estimate],
  );

  return { ok: true as const };
}

export default function Dashboard() {
  const {
    estimate: loadedEstimate,
    todayLongLabel,
    compactDateLabel,
    nextMidnightUtcIso,
  } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();

  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(Date.now());
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  let displayEstimate = loadedEstimate;
  const pending = fetcher.formData?.get("energyEstimate");
  if (
    fetcher.state !== "idle" &&
    typeof pending === "string" &&
    (pending === "deficit" || pending === "maintenance" || pending === "surplus")
  ) {
    displayEstimate = pending;
  }

  const nextMs = nextMidnightUtcIso ? Date.parse(nextMidnightUtcIso) : NaN;
  const timeLeftLabel =
    nextMidnightUtcIso !== null && !Number.isNaN(nextMs)
      ? formatTimeLeftUntil(nextMs, tick)
      : null;

  const busy = fetcher.state !== "idle";

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Today
          </h1>
          <span
            className="text-base font-medium tabular-nums text-foreground sm:text-lg"
            title={todayLongLabel}
          >
            {compactDateLabel}
          </span>
        </div>
        {timeLeftLabel !== null ? (
          <p className="text-sm text-muted-foreground">{timeLeftLabel}</p>
        ) : null}
        <p className="text-pretty text-sm text-muted-foreground">
          Pick the option that best matches how you ate today. You can change it
          until the day resets.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground" id="estimate-label">
          How was today?
        </p>
        <fetcher.Form
          method="post"
          className="flex flex-col gap-3"
          aria-busy={busy}
        >
          <div
            className="flex flex-col gap-3"
            role="radiogroup"
            aria-labelledby="estimate-label"
          >
            {ESTIMATE_KEYS.map((key) => {
              const selected = displayEstimate === key;
              const config = ESTIMATE_CONFIG[key];
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  type="submit"
                  name="energyEstimate"
                  value={key}
                  role="radio"
                  aria-checked={selected}
                  disabled={busy}
                  className={cn(
                    "cursor-pointer rounded-xl border px-4 py-3 text-start outline-none transition-colors select-none touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-16",
                    "flex min-h-14 flex-row items-start gap-3 disabled:pointer-events-none disabled:opacity-60",
                    selected ? config.cardSelected : config.cardBase,
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-background/80",
                      config.text,
                    )}
                    aria-hidden
                  >
                    <Icon className="size-5 stroke-[2]" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5 text-left">
                    <span className="text-base font-medium">{config.label}</span>
                    <span className="text-pretty text-sm text-muted-foreground">
                      {config.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </fetcher.Form>

        <p className="text-pretty text-xs text-muted-foreground">
          One log per day. Resets at midnight according to your time zone.
        </p>
      </div>
    </div>
  );
}
