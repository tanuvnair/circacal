import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Cake,
  ChartNoAxesColumn,
  ChartNoAxesColumnDecreasing,
  ChartNoAxesColumnIncreasing,
  Flame,
  Meh,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Dashboard - CircaCal" }];
}

type BalanceEstimate = "deficit" | "maintenance" | "surplus";

type EstimateColorScheme = "negative" | "neutral" | "positive";

const ESTIMATE_SCHEME_CARD: Record<
  EstimateColorScheme,
  { base: string; selected: string; icon: string }
> = {
  negative: {
    base: "border-destructive/30 bg-destructive/5 hover:bg-destructive/10",
    selected: "border-destructive bg-destructive/15 ring-2 ring-destructive/25",
    icon: "text-destructive",
  },
  neutral: {
    base: "border-border bg-muted/35 hover:bg-muted/55",
    selected: "border-primary/55 bg-primary/10 ring-2 ring-primary/25",
    icon: "text-muted-foreground",
  },
  positive: {
    base: "border-emerald-600/40 bg-emerald-500/10 hover:bg-emerald-500/16 dark:border-emerald-500/45 dark:bg-emerald-500/12 dark:hover:bg-emerald-500/18",
    selected:
      "border-emerald-600 bg-emerald-500/20 ring-2 ring-emerald-500/35 dark:border-emerald-400 dark:bg-emerald-500/18 dark:ring-emerald-400/35",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
};

const ESTIMATE_OPTIONS: {
  Icon: LucideIcon;
  colorScheme: EstimateColorScheme;
  value: BalanceEstimate;
  label: string;
  description: string;
}[] = [
  {
    Icon: ChartNoAxesColumnIncreasing,
    colorScheme: "positive",
    value: "surplus",
    label: "Surplus",
    description: "Roughly ate over maintenance today.",
  },
  {
    Icon: ChartNoAxesColumn,
    colorScheme: "neutral",
    value: "maintenance",
    label: "Maintenance",
    description: "Roughly around maintenance today.",
  },
  {
    Icon: ChartNoAxesColumnDecreasing,
    colorScheme: "negative",
    value: "deficit",
    label: "Deficit",
    description: "Roughly ate under maintenance today.",
  },
];

export default function Dashboard() {
  const [estimate, setEstimate] = useState<BalanceEstimate | null>(null);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Today
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Pick the option that best matches how you ate today. You can change it
          until the day resets.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground" id="estimate-label">
          How was today?
        </p>
        <div
          className="flex flex-col gap-3"
          role="radiogroup"
          aria-labelledby="estimate-label"
        >
          {ESTIMATE_OPTIONS.map((opt) => {
            const selected = estimate === opt.value;
            const scheme = ESTIMATE_SCHEME_CARD[opt.colorScheme];
            return (
              <div
                key={opt.value}
                role="radio"
                aria-checked={selected}
                tabIndex={0}
                className={cn(
                  "cursor-pointer rounded-xl border px-4 py-3 text-start outline-none transition-colors select-none touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-16",
                  "flex min-h-14 flex-row items-start gap-3",
                  selected ? scheme.selected : scheme.base,
                )}
                onClick={() => {
                  setEstimate(opt.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEstimate(opt.value);
                  }
                }}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-background/80",
                    scheme.icon,
                  )}
                  aria-hidden
                >
                  <opt.Icon className="size-5 stroke-[2]" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-base font-medium">{opt.label}</span>
                  <span className="text-pretty text-sm text-muted-foreground">
                    {opt.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-pretty text-xs text-muted-foreground">
          One log per day. Resets at midnight according to your time zone.
        </p>
      </div>
    </div>
  );
}
