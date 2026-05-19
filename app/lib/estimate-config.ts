import {
  ChartNoAxesColumn,
  ChartNoAxesColumnDecreasing,
  ChartNoAxesColumnIncreasing,
  type LucideIcon,
} from "lucide-react";

export type BalanceEstimate = "deficit" | "maintenance" | "surplus";

export const ESTIMATE_CONFIG: Record<
  BalanceEstimate,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    bg: string;
    text: string;
    barBg: string;
    cardBase: string;
    cardSelected: string;
  }
> = {
  surplus: {
    label: "Surplus",
    description: "Roughly ate over maintenance today.",
    icon: ChartNoAxesColumnIncreasing,
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    barBg: "bg-emerald-500/60 dark:bg-emerald-400/50",
    cardBase:
      "border-emerald-600/40 bg-emerald-500/10 hover:bg-emerald-500/16 dark:border-emerald-500/45 dark:bg-emerald-500/12 dark:hover:bg-emerald-500/18",
    cardSelected:
      "border-emerald-600 bg-emerald-500/20 ring-2 ring-emerald-500/35 dark:border-emerald-400 dark:bg-emerald-500/18 dark:ring-emerald-400/35",
  },
  maintenance: {
    label: "Maintenance",
    description: "Roughly around maintenance today.",
    icon: ChartNoAxesColumn,
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    barBg: "bg-blue-500/60 dark:bg-blue-500/50",
    cardBase:
      "border-blue-600/30 bg-blue-500/10 hover:bg-blue-500/16 dark:border-blue-500/40 dark:bg-blue-500/10 dark:hover:bg-blue-500/16",
    cardSelected:
      "border-blue-600 bg-blue-500/20 ring-2 ring-blue-500/35 dark:border-blue-400 dark:bg-blue-500/20 dark:ring-blue-400/35",
  },
  deficit: {
    label: "Deficit",
    description: "Roughly ate under maintenance today.",
    icon: ChartNoAxesColumnDecreasing,
    bg: "bg-destructive/10 dark:bg-destructive/15",
    text: "text-destructive",
    barBg: "bg-destructive/60 dark:bg-destructive/50",
    cardBase:
      "border-destructive/30 bg-destructive/5 hover:bg-destructive/10 dark:border-destructive/30 dark:bg-destructive/5 dark:hover:bg-destructive/10",
    cardSelected:
      "border-destructive bg-destructive/15 ring-2 ring-destructive/25 dark:border-destructive dark:bg-destructive/15 dark:ring-destructive/25",
  },
};
