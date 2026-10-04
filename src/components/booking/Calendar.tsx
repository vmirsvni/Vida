"use client";

import { useMemo, useState } from "react";
import { addDays, faNum, faMonthYear, jalali, satIndex, todayKey } from "@/lib/format";
import type { DayStatus } from "@/lib/booking/slots";

const WEEK = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const WEEK_FULL = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export interface DayInfo {
  status: DayStatus;
  available: number;
}

/** Jalali month grid. Shows every day — available, fully booked, closed. */
export function Calendar({
  value,
  onChange,
  horizonDays,
  getDay,
}: {
  value: string | null;
  onChange: (key: string) => void;
  horizonDays: number;
  getDay: (key: string) => DayInfo;
}) {
  const today = todayKey();
  const last = addDays(today, horizonDays - 1);

  // group the visible range into Jalali months
  const months = useMemo(() => {
    const out: { label: string; days: string[] }[] = [];
    // start from the first day of the current Jalali month
    let start = today;
    while (jalali(addDays(start, -1)).m === jalali(today).m) start = addDays(start, -1);
    let k = start;
    while (k <= last || jalali(k).m === jalali(last).m) {
      const jm = jalali(k);
      const cur = out[out.length - 1];
      if (!cur || cur.days.length === 0 || jalali(cur.days[0]).m !== jm.m) out.push({ label: faMonthYear(k), days: [] });
      out[out.length - 1].days.push(k);
      k = addDays(k, 1);
      if (out.length > 3) break;
    }
    return out;
  }, [today, last]);

  const initial = Math.max(
    0,
    months.findIndex((m) => value && m.days.includes(value)),
  );
  const [mi, setMi] = useState(initial);
  const month = months[mi] ?? months[0];
  const lead = satIndex(month.days[0]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMi((m) => Math.max(0, m - 1))}
          disabled={mi === 0}
          className="flex size-11 items-center justify-center text-wine disabled:opacity-20"
          aria-label="ماه قبل"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
        <p className="font-display text-[24px] text-espresso" aria-live="polite">
          {month.label}
        </p>
        <button
          type="button"
          onClick={() => setMi((m) => Math.min(months.length - 1, m + 1))}
          disabled={mi >= months.length - 1}
          className="flex size-11 items-center justify-center text-wine disabled:opacity-20"
          aria-label="ماه بعد"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
      </div>

      <div role="grid" aria-label={`تقویم ${month.label}`} className="mt-4">
        <div role="row" className="grid grid-cols-7 border-b border-line pb-2 text-center text-[12px] text-muted">
          {WEEK.map((d, i) => (
            <span role="columnheader" key={d} aria-label={WEEK_FULL[i]}>
              {d}
            </span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-y-1">
          {Array.from({ length: lead }).map((_, i) => (
            <span key={`e${i}`} />
          ))}
          {month.days.map((k) => {
            const past = k < today;
            const beyond = k > last;
            const info: DayInfo = past || beyond ? { status: "closed", available: 0 } : getDay(k);
            const selected = value === k;
            const d = jalali(k).d;
            const disabled = info.status === "closed"; // full days stay viewable (all slots shown as taken)
            const label = `${faNum(d)} ${month.label} — ${
              past
                ? "گذشته"
                : beyond
                  ? "خارج از بازه رزرو"
                  : info.status === "available"
                    ? `${faNum(info.available)} زمان خالی`
                    : info.status === "full"
                      ? "تکمیل ظرفیت"
                      : "بسته"
            }`;
            return (
              <button
                key={k}
                type="button"
                role="gridcell"
                aria-selected={selected}
                aria-label={label}
                aria-disabled={disabled}
                onClick={() => !disabled && onChange(k)}
                className={`relative mx-auto flex h-12 w-full max-w-12 flex-col items-center justify-center text-[15px] transition-colors duration-300 ${
                  selected
                    ? "bg-wine text-ivory"
                    : info.status === "available"
                      ? "text-espresso hover:bg-cream"
                      : info.status === "full"
                        ? "text-muted/70 hover:bg-cream"
                        : "cursor-not-allowed text-muted/35"
                } ${k === today && !selected ? "ring-1 ring-inset ring-champagne" : ""}`}
              >
                <span className={info.status === "full" && !selected ? "line-through decoration-wine/40" : ""}>{faNum(d)}</span>
                <span
                  aria-hidden
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    selected
                      ? "bg-champagne-light"
                      : info.status === "available"
                        ? "bg-champagne"
                        : info.status === "full"
                          ? "bg-wine/40"
                          : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-muted" aria-label="راهنما">
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-champagne" /> زمان خالی
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-wine/40" /> <span className="line-through">۱۲</span> تکمیل ظرفیت
        </li>
        <li className="flex items-center gap-2">
          <span className="text-muted/40">۱۲</span> بسته / تعطیل
        </li>
      </ul>
    </div>
  );
}
