/* Persian formatting helpers — digits, prices, Jalali dates, times. */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function faNum(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** "۳,۹۰۰,۰۰۰" — Persian digits with comma grouping (house style) */
export function faPrice(toman: number): string {
  return faNum(Math.round(toman).toLocaleString("en-US"));
}

export function toman(amount: number): string {
  return `${faPrice(amount)} تومان`;
}

/* ── Dates (all keys are local Gregorian YYYY-MM-DD) ─────────── */

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12); // noon avoids DST edge cases
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

export function todayKey(): string {
  return dateKey(new Date());
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fa-IR-u-ca-persian", opts);
const fLong = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fWeekday = fmt({ weekday: "long" });
const fWeekdayShort = fmt({ weekday: "short" });
const fParts = new Intl.DateTimeFormat("en-US-u-ca-persian", { year: "numeric", month: "numeric", day: "numeric" });

function parts(key: string) {
  const p = fLong.formatToParts(fromKey(key));
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { weekday: get("weekday"), day: get("day"), month: get("month"), year: get("year") };
}

/** "سه‌شنبه ۸ مهر ۱۴۰۵" — composed from parts; engines disagree on the pattern order */
export function faDateLong(key: string): string {
  const p = parts(key);
  return `${p.weekday} ${p.day} ${p.month} ${p.year}`;
}
/** "۸ مهر" */
export function faDayMonth(key: string): string {
  const p = parts(key);
  return `${p.day} ${p.month}`;
}
export function faWeekday(key: string): string {
  return fWeekday.format(fromKey(key));
}
export function faWeekdayShort(key: string): string {
  return fWeekdayShort.format(fromKey(key));
}
export function faMonthYear(key: string): string {
  const p = parts(key);
  return `${p.month} ${p.year}`;
}

/** Jalali year/month/day numbers for a key */
export function jalali(key: string): { y: number; m: number; d: number } {
  const parts = fParts.formatToParts(fromKey(key));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value.replace(/\D/g, ""));
  return { y: get("year"), m: get("month"), d: get("day") };
}

/** Column in a Saturday-first week (Sat=0 … Fri=6) */
export function satIndex(key: string): number {
  return (fromKey(key).getDay() + 1) % 7;
}

/* ── Times ───────────────────────────────────────────────────── */

export function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
export function toTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
/** "۱۰:۳۰" wrapped in bidi isolates so neighbouring numbers never reorder it */
export function faTime(t: string): string {
  return `\u2068${faNum(t)}\u2069`;
}

export function durationLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${faNum(m)} دقیقه`;
  if (!m) return `${faNum(h)} ساعت`;
  return `${faNum(h)} ساعت و ${faNum(m)} دقیقه`;
}

/** Appointment start as a Date */
export function appointmentDate(date: string, start: string): Date {
  const d = fromKey(date);
  const m = toMin(start);
  d.setHours(Math.floor(m / 60), m % 60, 0, 0);
  return d;
}

export function normalizeDigits(s: string): string {
  return s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function isValidMobile(s: string): boolean {
  return /^09\d{9}$/.test(normalizeDigits(s).replace(/[\s-]/g, ""));
}
