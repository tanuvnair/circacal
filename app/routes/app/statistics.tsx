import {
  ChartNoAxesColumn,
  ChartNoAxesColumnDecreasing,
  ChartNoAxesColumnIncreasing,
  Flame,
  Minus,
  Ruler,
  Scale,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { redirect, useLoaderData } from "react-router";

import type { Route } from "./+types/statistics";
import { Estimate } from "../../../generated/prisma/enums";
import {
  countConsecutiveStreakDays,
  listDailyEnergyRecordsInRange,
} from "~/db-repositories/daily-energy-record.repository.server";
import { getLatestBodyMetricLogs } from "~/db-repositories/body-metric-log.repository.server";
import { findUserById } from "~/db-repositories/user.repository.server";
import { getSession } from "~/lib/auth.server";
import { resolveStoredTimeZone } from "~/lib/user-time-zone";
import {
  isoDateOnlyToUtcMidnight,
  utcInstantToZonedDateOnly,
} from "~/lib/zoned-wall-time";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type PeriodKey = "7d" | "30d" | "all";

interface PeriodStats {
  totalDays: number;
  loggedDays: number;
  deficitCount: number;
  maintenanceCount: number;
  surplusCount: number;
}

interface BodyMetricSnapshot {
  weight: string | null;
  weightUnit: string | null;
  height: string | null;
  heightUnit: string | null;
  loggedAtLabel: string;
}

interface WeightChartPoint {
  dateLabel: string;
  weight: number;
}

interface StatisticsLoaderData {
  periods: Record<PeriodKey, PeriodStats>;
  streak: number;
  latestBodyMetric: BodyMetricSnapshot | null;
  previousBodyMetric: BodyMetricSnapshot | null;
  /** Ordered oldest→newest, last 30 days, for the visual bar */
  recentDailyEstimates: { date: string; estimate: "deficit" | "maintenance" | "surplus" }[];
  /** Weight data points for the chart, oldest→newest */
  weightChartData: WeightChartPoint[];
  /** Unit label for the weight chart Y axis */
  weightChartUnit: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const PRISMA_TO_LABEL: Record<Estimate, "deficit" | "maintenance" | "surplus"> = {
  DEFICIT: "deficit",
  MAINTENANCE: "maintenance",
  SURPLUS: "surplus",
};

function subtractCalendarDays(ymd: string, n: number): string {
  const d = new Date(`${ymd}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function countEstimates(records: { energyEstimate: Estimate }[]) {
  let deficit = 0;
  let maintenance = 0;
  let surplus = 0;
  for (const r of records) {
    switch (r.energyEstimate) {
      case "DEFICIT":
        deficit++;
        break;
      case "MAINTENANCE":
        maintenance++;
        break;
      case "SURPLUS":
        surplus++;
        break;
    }
  }
  return { deficit, maintenance, surplus };
}

// ─── Loader ─────────────────────────────────────────────────────────────────

export function meta() {
  return [{ title: "Statistics - CircaCal" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session) {
    throw redirect("/sign-in");
  }

  const user = await findUserById(session.user.id);
  const timeZone = resolveStoredTimeZone(user?.timeZone);
  const todayYmd = utcInstantToZonedDateOnly(new Date(), timeZone);
  const todayUtcMidnight = isoDateOnlyToUtcMidnight(todayYmd);

  // Date boundaries
  const ymd7 = subtractCalendarDays(todayYmd, 6); // 7 days including today
  const ymd30 = subtractCalendarDays(todayYmd, 29); // 30 days including today
  // Furthest back we care about for "all time" — use a very early date
  const ymdEarlyBound = "2020-01-01";

  const from7 = isoDateOnlyToUtcMidnight(ymd7);
  const from30 = isoDateOnlyToUtcMidnight(ymd30);
  const fromAll = isoDateOnlyToUtcMidnight(ymdEarlyBound);

  // Fetch all records in the widest range (all time) — we'll filter in memory for sub-ranges
  const [allRecords, streak, bodyMetricLogs, chartBodyMetrics] = await Promise.all([
    listDailyEnergyRecordsInRange(session.user.id, fromAll, todayUtcMidnight),
    countConsecutiveStreakDays(session.user.id, todayUtcMidnight),
    getLatestBodyMetricLogs(session.user.id, 2),
    getLatestBodyMetricLogs(session.user.id, 30),
  ]);

  // Filter for periods
  const from7Ms = from7.getTime();
  const from30Ms = from30.getTime();
  const records7 = allRecords.filter((r) => r.date.getTime() >= from7Ms);
  const records30 = allRecords.filter((r) => r.date.getTime() >= from30Ms);

  function buildPeriodStats(
    records: typeof allRecords,
    totalDays: number,
  ): PeriodStats {
    const c = countEstimates(records);
    return {
      totalDays,
      loggedDays: records.length,
      deficitCount: c.deficit,
      maintenanceCount: c.maintenance,
      surplusCount: c.surplus,
    };
  }

  // For "all time" total days: days between earliest record and today
  const earliestRecord = allRecords[0];
  const allTimeTotalDays = earliestRecord
    ? Math.floor(
        (todayUtcMidnight.getTime() - earliestRecord.date.getTime()) / 86_400_000,
      ) + 1
    : 0;

  const periods: Record<PeriodKey, PeriodStats> = {
    "7d": buildPeriodStats(records7, 7),
    "30d": buildPeriodStats(records30, 30),
    all: buildPeriodStats(allRecords, allTimeTotalDays),
  };

  // Recent daily estimates for the visual bar (last 30)
  const recentDailyEstimates = records30.map((r) => ({
    date: r.date.toISOString().slice(0, 10),
    estimate: PRISMA_TO_LABEL[r.energyEstimate],
  }));

  // Body metrics
  const dateFmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  });

  function toSnapshot(
    log: (typeof bodyMetricLogs)[number] | undefined,
  ): BodyMetricSnapshot | null {
    if (!log) return null;
    return {
      weight: log.weight?.toString() ?? null,
      weightUnit: log.weightUnit,
      height: log.height?.toString() ?? null,
      heightUnit: log.heightUnit,
      loggedAtLabel: dateFmt.format(log.createdAt),
    };
  }

  // Build weight chart data (oldest → newest) from the last 30 body metric logs
  const chartDateFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone,
  });

  const weightChartData: WeightChartPoint[] = chartBodyMetrics
    .filter((log) => log.weight != null)
    .reverse() // oldest first
    .map((log) => ({
      dateLabel: chartDateFmt.format(log.createdAt),
      weight: parseFloat(log.weight!.toString()),
    }));

  // Determine the weight unit from the most recent log that has one
  const weightChartUnit =
    chartBodyMetrics.find((l) => l.weightUnit != null)?.weightUnit ?? "";

  return {
    periods,
    streak,
    latestBodyMetric: toSnapshot(bodyMetricLogs[0]),
    previousBodyMetric: toSnapshot(bodyMetricLogs[1]),
    recentDailyEstimates,
    weightChartData,
    weightChartUnit,
  } satisfies StatisticsLoaderData;
}

// ─── UI Helpers ─────────────────────────────────────────────────────────────

const PERIOD_LABELS: Record<PeriodKey, string> = {
  "7d": "7 days",
  "30d": "30 days",
  all: "All time",
};

const ESTIMATE_COLORS: Record<
  "deficit" | "maintenance" | "surplus",
  { bg: string; text: string; barBg: string; icon: LucideIcon }
> = {
  deficit: {
    bg: "bg-destructive/10 dark:bg-destructive/15",
    text: "text-destructive",
    barBg: "bg-destructive/60 dark:bg-destructive/50",
    icon: ChartNoAxesColumnDecreasing,
  },
  maintenance: {
    bg: "bg-primary/10 dark:bg-primary/15",
    text: "text-primary dark:text-primary",
    barBg: "bg-primary/50 dark:bg-primary/40",
    icon: ChartNoAxesColumn,
  },
  surplus: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    barBg: "bg-emerald-500/60 dark:bg-emerald-400/50",
    icon: ChartNoAxesColumnIncreasing,
  },
};

function pct(n: number, total: number): number {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function EstimateCountCard({
  label,
  count,
  total,
  type,
}: {
  label: string;
  count: number;
  total: number;
  type: "deficit" | "maintenance" | "surplus";
}) {
  const colors = ESTIMATE_COLORS[type];
  const Icon = colors.icon;
  const percentage = pct(count, total);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
        colors.bg,
        "border-transparent",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg bg-background/80",
          colors.text,
        )}
      >
        <Icon className="size-5 stroke-[2]" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-xl font-semibold tabular-nums", colors.text)}>
            {count}
          </span>
          <span className="text-xs text-muted-foreground">
            {total > 0 ? `${percentage}%` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function EnergyBreakdownBar({ stats }: { stats: PeriodStats }) {
  const { deficitCount, maintenanceCount, surplusCount, loggedDays } = stats;
  if (loggedDays === 0) {
    return (
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-full" />
      </div>
    );
  }

  const segments: { type: "deficit" | "maintenance" | "surplus"; count: number }[] = [
    { type: "surplus", count: surplusCount },
    { type: "maintenance", count: maintenanceCount },
    { type: "deficit", count: deficitCount },
  ];

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
      {segments.map(
        (seg) =>
          seg.count > 0 && (
            <div
              key={seg.type}
              className={cn(
                "h-full transition-all duration-500",
                ESTIMATE_COLORS[seg.type].barBg,
              )}
              style={{ width: `${pct(seg.count, loggedDays)}%` }}
              title={`${seg.type}: ${seg.count} day${seg.count !== 1 ? "s" : ""}`}
            />
          ),
      )}
    </div>
  );
}

function BreakdownLegend() {
  const items: { type: "surplus" | "maintenance" | "deficit"; label: string }[] = [
    { type: "surplus", label: "Surplus" },
    { type: "maintenance", label: "Maintenance" },
    { type: "deficit", label: "Deficit" },
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {items.map((item) => (
        <div key={item.type} className="flex items-center gap-1.5">
          <div
            className={cn(
              "size-2.5 rounded-full",
              ESTIMATE_COLORS[item.type].barBg,
            )}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function InsightsCard({
  stats,
  streak,
}: {
  stats: PeriodStats;
  streak: number;
}) {
  const { loggedDays, totalDays, deficitCount, maintenanceCount, surplusCount } =
    stats;
  const consistency = pct(loggedDays, totalDays);

  // Most frequent estimate
  const max = Math.max(deficitCount, maintenanceCount, surplusCount);
  let mostFrequent: "deficit" | "maintenance" | "surplus" | null = null;
  if (max > 0) {
    if (max === surplusCount) mostFrequent = "surplus";
    else if (max === maintenanceCount) mostFrequent = "maintenance";
    else mostFrequent = "deficit";
  }

  const insights: { icon: LucideIcon; iconClass: string; label: string; value: string }[] = [
    {
      icon: Flame,
      iconClass: "text-amber-500 dark:text-amber-400",
      label: "Current streak",
      value: streak === 0 ? "No streak" : `${streak} day${streak !== 1 ? "s" : ""}`,
    },
    {
      icon: mostFrequent ? ESTIMATE_COLORS[mostFrequent].icon : ChartNoAxesColumn,
      iconClass: mostFrequent
        ? ESTIMATE_COLORS[mostFrequent].text
        : "text-muted-foreground",
      label: "Most frequent",
      value: mostFrequent
        ? `${mostFrequent.charAt(0).toUpperCase()}${mostFrequent.slice(1)}`
        : "—",
    },
  ];

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Insights</CardTitle>
        <CardDescription>Patterns and consistency</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Consistency bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Consistency
            </span>
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {totalDays > 0 ? `${consistency}%` : "—"}
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/70 transition-all duration-500"
              style={{ width: `${consistency}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {loggedDays} of {totalDays} day{totalDays !== 1 ? "s" : ""} logged
          </span>
        </div>

        <Separator />

        {/* Streak & most frequent */}
        <div className="flex flex-col gap-3">
          {insights.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60",
                  item.iconClass,
                )}
              >
                <item.icon className="size-4 stroke-[2]" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Weight Chart ───────────────────────────────────────────────────────────

const weightChartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function WeightTrendChart({
  data,
  unit,
}: {
  data: WeightChartPoint[];
  unit: string;
}) {
  if (data.length < 2) {
    return (
      <p className="text-pretty text-sm text-muted-foreground">
        {data.length === 0
          ? "No weight data logged yet."
          : "Log at least 2 weight entries to see a trend chart."}
      </p>
    );
  }

  // Compute Y domain with some padding
  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const pad = Math.max((maxW - minW) * 0.15, 0.5);

  return (
    <ChartContainer config={weightChartConfig} className="aspect-[2/1] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="dateLabel"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          width={40}
          domain={[Math.floor(minW - pad), Math.ceil(maxW + pad)]}
          tickFormatter={(v: number) => v.toFixed(0)}
          label={unit ? { value: unit, position: "insideLeft", offset: 10, angle: -90, style: { fontSize: 10, fill: "var(--muted-foreground)" } } : undefined}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value) =>
                `${Number(value).toFixed(1)} ${unit}`
              }
            />
          }
        />
        <defs>
          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          dataKey="weight"
          type="monotone"
          fill="url(#weightGradient)"
          stroke="var(--color-weight)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function BodyMetricsCard({
  latest,
  previous,
  weightChartData,
  weightChartUnit,
}: {
  latest: BodyMetricSnapshot | null;
  previous: BodyMetricSnapshot | null;
  weightChartData: WeightChartPoint[];
  weightChartUnit: string;
}) {
  if (!latest && weightChartData.length === 0) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Body Metrics</CardTitle>
          <CardDescription>Latest measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-pretty text-sm text-muted-foreground">
            No body metrics logged yet. Head to the Body Metrics tab to add your
            first entry.
          </p>
        </CardContent>
      </Card>
    );
  }

  function delta(
    current: string | null,
    prev: string | null,
  ): { value: number; formatted: string } | null {
    if (current == null || prev == null) return null;
    const c = parseFloat(current);
    const p = parseFloat(prev);
    if (isNaN(c) || isNaN(p)) return null;
    const diff = c - p;
    if (diff === 0) return null;
    const sign = diff > 0 ? "+" : "";
    return {
      value: diff,
      formatted: `${sign}${diff.toFixed(1)}`,
    };
  }

  const weightDelta = latest ? delta(latest.weight, previous?.weight ?? null) : null;
  const heightDelta = latest ? delta(latest.height, previous?.height ?? null) : null;

  const metrics: {
    icon: LucideIcon;
    iconClass: string;
    label: string;
    value: string;
    unit: string;
    delta: { value: number; formatted: string } | null;
  }[] = [];

  if (latest?.weight) {
    metrics.push({
      icon: Scale,
      iconClass: "text-blue-500 dark:text-blue-400",
      label: "Weight",
      value: parseFloat(latest.weight).toFixed(1),
      unit: latest.weightUnit ?? "",
      delta: weightDelta,
    });
  }

  if (latest?.height) {
    metrics.push({
      icon: Ruler,
      iconClass: "text-violet-500 dark:text-violet-400",
      label: "Height",
      value: parseFloat(latest.height).toFixed(1),
      unit: latest.heightUnit ?? "",
      delta: heightDelta,
    });
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Body Metrics</CardTitle>
        <CardDescription>Latest measurements</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {metrics.length > 0 && (
          <div className="flex flex-col gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/60",
                    m.iconClass,
                  )}
                >
                  <m.icon className="size-5 stroke-[2]" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-xs text-muted-foreground">
                    {m.label}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-semibold tabular-nums">
                      {m.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {m.unit}
                    </span>
                    {m.delta && (
                      <span
                        className={cn(
                          "ml-1 inline-flex items-center gap-0.5 text-xs font-medium",
                          m.delta.value > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive",
                        )}
                      >
                        {m.delta.value > 0 ? (
                          <TrendingUp className="size-3" />
                        ) : (
                          <TrendingDown className="size-3" />
                        )}
                        {m.delta.formatted}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weight trend chart */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Weight trend
          </span>
          <WeightTrendChart data={weightChartData} unit={weightChartUnit} />
        </div>

        {latest && (
          <p className="text-xs text-muted-foreground">
            Latest logged {latest.loggedAtLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function RecentDaysStrip({
  estimates,
}: {
  estimates: { date: string; estimate: "deficit" | "maintenance" | "surplus" }[];
}) {
  if (estimates.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Recent activity ({estimates.length} day{estimates.length !== 1 ? "s" : ""})
      </span>
      <div className="flex gap-[3px]">
        {estimates.map((e) => (
          <div
            key={e.date}
            className={cn(
              "h-6 flex-1 rounded-sm transition-colors",
              ESTIMATE_COLORS[e.estimate].barBg,
            )}
            title={`${e.date}: ${e.estimate}`}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Minus className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">No data yet</p>
      <p className="max-w-[28rem] text-pretty text-xs text-muted-foreground">
        Start logging your daily energy estimates on the Dashboard. Your trends,
        streaks, and insights will appear here automatically.
      </p>
    </div>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────

function PeriodTabContent({
  periodKey,
  stats,
  streak,
  recentDailyEstimates,
  latestBodyMetric,
  previousBodyMetric,
  weightChartData,
  weightChartUnit,
}: {
  periodKey: PeriodKey;
  stats: PeriodStats;
  streak: number;
  recentDailyEstimates: StatisticsLoaderData["recentDailyEstimates"];
  latestBodyMetric: BodyMetricSnapshot | null;
  previousBodyMetric: BodyMetricSnapshot | null;
  weightChartData: WeightChartPoint[];
  weightChartUnit: string;
}) {
  const hasData = stats.loggedDays > 0;

  if (!hasData) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Estimate count cards */}
      <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-3">
        <EstimateCountCard
          label="Surplus"
          count={stats.surplusCount}
          total={stats.loggedDays}
          type="surplus"
        />
        <EstimateCountCard
          label="Maintenance"
          count={stats.maintenanceCount}
          total={stats.loggedDays}
          type="maintenance"
        />
        <EstimateCountCard
          label="Deficit"
          count={stats.deficitCount}
          total={stats.loggedDays}
          type="deficit"
        />
      </div>

      {/* Energy breakdown bar */}
      <div className="flex flex-col gap-2">
        <EnergyBreakdownBar stats={stats} />
        <BreakdownLegend />
      </div>

      {/* Recent days strip — only shown in 30d view */}
      {periodKey === "30d" && (
        <RecentDaysStrip estimates={recentDailyEstimates} />
      )}

      <Separator />

      {/* Bottom cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InsightsCard stats={stats} streak={streak} />
        <BodyMetricsCard
          latest={latestBodyMetric}
          previous={previousBodyMetric}
          weightChartData={weightChartData}
          weightChartUnit={weightChartUnit}
        />
      </div>
    </div>
  );
}

export default function Statistics() {
  const {
    periods,
    streak,
    latestBodyMetric,
    previousBodyMetric,
    recentDailyEstimates,
    weightChartData,
    weightChartUnit,
  } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Statistics
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Your energy balance trends, streaks, and body metric progress.
        </p>
      </div>

      <Tabs defaultValue="7d">
        <TabsList className="w-full min-[480px]:w-auto">
          {(["7d", "30d", "all"] as const).map((key) => (
            <TabsTrigger key={key} value={key}>
              {PERIOD_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(["7d", "30d", "all"] as const).map((key) => (
          <TabsContent key={key} value={key}>
            <PeriodTabContent
              periodKey={key}
              stats={periods[key]}
              streak={streak}
              recentDailyEstimates={recentDailyEstimates}
              latestBodyMetric={latestBodyMetric}
              previousBodyMetric={previousBodyMetric}
              weightChartData={weightChartData}
              weightChartUnit={weightChartUnit}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
