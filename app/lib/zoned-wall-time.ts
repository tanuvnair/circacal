/** Calendar day in `timeZone`, formatted as YYYY-MM-DD (for date inputs). */
export function utcInstantToZonedDateOnly(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !d) {
    return instant.toISOString().slice(0, 10);
  }
  return `${y}-${m}-${d}`;
}

function isValidYmd(y: number, m: number, d: number): boolean {
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return false;
  }
  if (m < 1 || m > 12 || d < 1 || d > 31) {
    return false;
  }
  return true;
}

/**
 * UTC instant for a wall-clock time in `timeZone` (handles DST via iteration).
 */
export function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  timeZone: string,
): Date {
  if (timeZone === "UTC" || timeZone === "Etc/UTC") {
    return new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond),
    );
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const read = (t: number) => {
    const parts = formatter.formatToParts(new Date(t));
    const g = (ty: Intl.DateTimeFormatPartTypes) =>
      parseInt(parts.find((p) => p.type === ty)?.value ?? "NaN", 10);
    return {
      y: g("year"),
      mo: g("month"),
      d: g("day"),
      h: g("hour"),
      mi: g("minute"),
      s: g("second"),
    };
  };

  let t = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  for (let i = 0; i < 24; i++) {
    const p = read(t);
    if (
      p.y === year &&
      p.mo === month &&
      p.d === day &&
      p.h === hour &&
      p.mi === minute &&
      p.s === second
    ) {
      return new Date(t);
    }
    const gotTime = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s, millisecond);
    const wantAsIfUtc = Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      millisecond,
    );
    t += wantAsIfUtc - gotTime;
  }
  return new Date(t);
}

export function startOfZonedCalendarDayUtc(
  isoDateOnly: string,
  timeZone: string,
): Date | null {
  const [y, m, d] = isoDateOnly.split("-").map((x) => parseInt(x, 10));
  if (!isValidYmd(y, m, d)) {
    return null;
  }
  return zonedWallTimeToUtc(y, m, d, 0, 0, 0, 0, timeZone);
}

export function endOfZonedCalendarDayUtc(
  isoDateOnly: string,
  timeZone: string,
): Date | null {
  const [y, m, d] = isoDateOnly.split("-").map((x) => parseInt(x, 10));
  if (!isValidYmd(y, m, d)) {
    return null;
  }
  return zonedWallTimeToUtc(y, m, d, 23, 59, 59, 999, timeZone);
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses `dateFrom` / `dateTo` query values: full ISO instants are used as-is;
 * YYYY-MM-DD is interpreted as start or end of that calendar day in `timeZone`.
 */
export function parseBodyMetricFilterInstant(
  raw: string | null,
  endOfDay: boolean,
  timeZone: string,
): Date | undefined {
  if (raw === null || raw === "") {
    return undefined;
  }
  const decoded = raw.trim();
  if (DATE_ONLY.test(decoded)) {
    if (endOfDay) {
      return endOfZonedCalendarDayUtc(decoded, timeZone) ?? undefined;
    }
    return startOfZonedCalendarDayUtc(decoded, timeZone) ?? undefined;
  }
  const ms = Date.parse(decoded);
  if (Number.isNaN(ms)) {
    return undefined;
  }
  return new Date(ms);
}
