/** `dateFromIso` / `dateToIso` are full instants (e.g. `toISOString()`), encoded in the query. */
export function bodyMetricListSearchString(opts: {
  page: number;
  pageSize: number;
  dateFromIso: string | null;
  dateToIso: string | null;
}): string {
  const p = new URLSearchParams();
  if (opts.page > 1) {
    p.set("page", String(opts.page));
  }
  if (opts.pageSize !== 10) {
    p.set("pageSize", String(opts.pageSize));
  }
  if (opts.dateFromIso) {
    p.set("dateFrom", opts.dateFromIso);
  }
  if (opts.dateToIso) {
    p.set("dateTo", opts.dateToIso);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}
