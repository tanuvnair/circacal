export type BodyMetricHistoryRow = {
  id: string;
  weight: string | null;
  weightUnit: string | null;
  height: string | null;
  heightUnit: string | null;
  notes: string | null;
  loggedAtLabel: string;
};

export type BodyMetricsActionResult =
  | { ok: true }
  | { ok: false; error: string };
