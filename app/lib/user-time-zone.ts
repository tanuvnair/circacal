/**
 * Resolves `User.timeZone` from the database for date-range and display logic.
 * Accepts any IANA zone the runtime supports (not limited to the settings combobox list).
 * Empty / invalid values fall back to UTC — never the browser's local zone.
 */
export function resolveStoredTimeZone(
  stored: string | null | undefined,
): string {
  if (stored == null || typeof stored !== "string") {
    return "UTC";
  }
  const tz = stored.trim();
  if (tz === "") {
    return "UTC";
  }
  try {
    Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
    return tz;
  } catch {
    return "UTC";
  }
}
