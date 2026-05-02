export interface Timezone {
  value: string;
  label: string;
}
export const timezones: Timezone[] = [
  { value: "Pacific/Midway", label: "(UTC-11:00) Midway Island" },
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  {
    value: "America/Los_Angeles",
    label: "(UTC-08:00) Pacific Time (US & Canada)",
  },
  { value: "America/Phoenix", label: "(UTC-07:00) Arizona" },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "America/Mexico_City", label: "(UTC-06:00) Mexico City" },
  {
    value: "America/New_York",
    label: "(UTC-05:00) Eastern Time (US & Canada)",
  },
  { value: "America/Toronto", label: "(UTC-05:00) Toronto" },
  { value: "America/Bogota", label: "(UTC-05:00) Bogota, Lima" },
  { value: "America/Caracas", label: "(UTC-04:00) Caracas" },
  { value: "America/Santiago", label: "(UTC-04:00) Santiago" },
  { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time (Canada)" },
  { value: "America/Sao_Paulo", label: "(UTC-03:00) Brasilia, São Paulo" },
  { value: "America/Buenos_Aires", label: "(UTC-03:00) Buenos Aires" },
  { value: "Atlantic/Azores", label: "(UTC-01:00) Azores" },
  { value: "Europe/London", label: "(UTC+00:00) London, Dublin" },
  { value: "Atlantic/Reykjavik", label: "(UTC+00:00) Reykjavik" },
  { value: "Africa/Casablanca", label: "(UTC+01:00) Casablanca" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris, Madrid, Berlin" },
  { value: "Europe/Rome", label: "(UTC+01:00) Rome, Amsterdam, Brussels" },
  { value: "Europe/Vienna", label: "(UTC+01:00) Vienna, Zurich" },
  { value: "Europe/Warsaw", label: "(UTC+01:00) Warsaw, Prague, Budapest" },
  {
    value: "Europe/Stockholm",
    label: "(UTC+01:00) Stockholm, Oslo, Copenhagen",
  },
  { value: "Africa/Lagos", label: "(UTC+01:00) West Central Africa" },
  { value: "Africa/Algiers", label: "(UTC+01:00) Algiers" },
  { value: "Europe/Athens", label: "(UTC+02:00) Athens, Helsinki" },
  { value: "Europe/Istanbul", label: "(UTC+03:00) Istanbul" },
  { value: "Africa/Cairo", label: "(UTC+02:00) Cairo" },
  { value: "Africa/Johannesburg", label: "(UTC+02:00) Johannesburg" },
  { value: "Asia/Jerusalem", label: "(UTC+02:00) Jerusalem" },
  { value: "Europe/Moscow", label: "(UTC+03:00) Moscow, St. Petersburg" },
  { value: "Asia/Kuwait", label: "(UTC+03:00) Kuwait, Riyadh" },
  { value: "Africa/Nairobi", label: "(UTC+03:00) Nairobi" },
  { value: "Asia/Baghdad", label: "(UTC+03:00) Baghdad" },
  { value: "Asia/Tehran", label: "(UTC+03:30) Tehran" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Abu Dhabi, Dubai" },
  { value: "Asia/Kabul", label: "(UTC+04:30) Kabul" },
  { value: "Asia/Karachi", label: "(UTC+05:00) Karachi, Islamabad" },
  { value: "Asia/Kolkata", label: "(UTC+05:30) Mumbai, Kolkata, New Delhi" },
  { value: "Asia/Kathmandu", label: "(UTC+05:45) Kathmandu" },
  { value: "Asia/Dhaka", label: "(UTC+06:00) Dhaka" },
  { value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok, Jakarta" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Singapore, Kuala Lumpur" },
  { value: "Asia/Hong_Kong", label: "(UTC+08:00) Hong Kong, Beijing" },
  { value: "Asia/Taipei", label: "(UTC+08:00) Taipei" },
  { value: "Australia/Perth", label: "(UTC+08:00) Perth" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo, Seoul" },
  { value: "Australia/Adelaide", label: "(UTC+09:30) Adelaide" },
  { value: "Australia/Darwin", label: "(UTC+09:30) Darwin" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney, Melbourne" },
  { value: "Australia/Brisbane", label: "(UTC+10:00) Brisbane" },
  { value: "Pacific/Guam", label: "(UTC+10:00) Guam" },
  { value: "Pacific/Auckland", label: "(UTC+12:00) Auckland" },
  { value: "Pacific/Fiji", label: "(UTC+12:00) Fiji" },
];

const ALLOWED_TIMEZONE_VALUES = new Set(
  timezones.map((timezone) => timezone.value),
);

/** Returns true if `value` is an IANA zone from the app's picker list. */
export function isAllowedTimeZone(value: string): boolean {
  return ALLOWED_TIMEZONE_VALUES.has(value);
}
