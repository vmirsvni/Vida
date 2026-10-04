/* ──────────────────────────────────────────────────────────────
   Slot engine (pure, framework-free).

   Rules
   • Every slot is shown — available, booked or closed — for transparency.
   • One customer per slot; overlaps are impossible.
   • After every booking a buffer (default 15 min) is reserved before
     the next bookable start.
   • Blocks (time ranges or whole days, per specialist or salon-wide)
     close the affected time.
   ────────────────────────────────────────────────────────────── */

import type { Booking, BookingStatus, Specialist, TimeBlock } from "@/data/types";
import { fromKey, toMin, toTime } from "@/lib/format";

export type SlotStatus = "available" | "booked" | "closed";
export interface Slot {
  start: string;
  end: string;
  status: SlotStatus;
  specialistId?: string;
  reason?: "past" | "blocked" | "booked";
}

/** statuses that occupy the calendar */
export const OCCUPYING: BookingStatus[] = ["pending", "awaiting_payment", "paid", "confirmed", "completed", "no_show"];

export function hoursFor(sp: Specialist, date: string): { open: number; close: number } | null {
  const day = fromKey(date).getDay();
  const h = sp.hours.find((x) => x.day === day);
  if (!h || !h.open || !h.close) return null;
  return { open: toMin(h.open), close: toMin(h.close) };
}

export function isDayBlocked(blocks: TimeBlock[], spId: string, date: string) {
  return blocks.some((b) => b.date === date && !b.start && (b.specialistId === spId || b.specialistId === "all"));
}

interface Ctx {
  date: string;
  durationMin: number;
  bookings: Booking[];
  blocks: TimeBlock[];
  bufferMin: number;
  now?: Date;
  /** ignore this booking id (used when an admin edits an existing booking) */
  ignoreId?: string;
}

const round5 = (m: number) => Math.ceil(m / 5) * 5;

export function specialistSlots(sp: Specialist, ctx: Ctx): Slot[] {
  const { date, durationMin: dur, bufferMin: buf } = ctx;
  const now = ctx.now ?? new Date();
  const hours = hoursFor(sp, date);
  if (!sp.active || !hours || isDayBlocked(ctx.blocks, sp.id, date)) return [];

  const today = new Date(now);
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (date < todayKey) return [];
  // same-day bookings need at least 60 minutes' notice
  const nowCut = date === todayKey ? now.getHours() * 60 + now.getMinutes() + 60 : -1;

  const busy = ctx.bookings
    .filter((b) => b.specialistId === sp.id && b.date === date && OCCUPYING.includes(b.status) && b.id !== ctx.ignoreId)
    .map((b) => ({ id: b.id, s: toMin(b.start), e: toMin(b.start) + b.durationMin }))
    .sort((a, b) => a.s - b.s);

  const blocked = ctx.blocks
    .filter((b) => b.date === date && b.start && b.end && (b.specialistId === sp.id || b.specialistId === "all"))
    .map((b) => ({ s: toMin(b.start!), e: toMin(b.end!) }))
    .sort((a, b) => a.s - b.s);

  const slots: Slot[] = [];
  const emitted = new Set<string>();
  let t = hours.open;

  while (t + dur <= hours.close) {
    const end = t + dur;
    const bk = busy.find((b) => t < b.e + buf && b.s < end + buf);
    if (bk) {
      if (!emitted.has(bk.id)) {
        emitted.add(bk.id);
        slots.push({ start: toTime(bk.s), end: toTime(bk.e), status: "booked", specialistId: sp.id, reason: "booked" });
      }
      t = round5(Math.max(t + 5, bk.e + buf));
      continue;
    }
    const bl = blocked.find((b) => t < b.e && b.s < end);
    if (bl) {
      const s = Math.max(t, bl.s);
      slots.push({ start: toTime(s), end: toTime(bl.e), status: "closed", specialistId: sp.id, reason: "blocked" });
      t = round5(Math.max(t + 5, bl.e));
      continue;
    }
    if (t < nowCut) {
      slots.push({ start: toTime(t), end: toTime(end), status: "closed", specialistId: sp.id, reason: "past" });
    } else {
      slots.push({ start: toTime(t), end: toTime(end), status: "available", specialistId: sp.id });
    }
    t = round5(end + buf);
  }

  // bookings that sit outside the walked chain (e.g. admin placed late in the day)
  for (const b of busy) {
    if (!emitted.has(b.id) && b.s >= hours.open && b.s < hours.close) {
      slots.push({ start: toTime(b.s), end: toTime(b.e), status: "booked", specialistId: sp.id, reason: "booked" });
    }
  }
  return slots.sort((a, b) => toMin(a.start) - toMin(b.start));
}

const rank: Record<SlotStatus, number> = { available: 3, booked: 2, closed: 1 };

/** Merge slots of several specialists ("فرقی ندارد"). Available wins. */
export function mergedSlots(sps: Specialist[], ctx: Ctx): Slot[] {
  const map = new Map<string, Slot>();
  for (const sp of sps) {
    for (const s of specialistSlots(sp, ctx)) {
      const cur = map.get(s.start);
      if (!cur || rank[s.status] > rank[cur.status]) map.set(s.start, s);
    }
  }
  return [...map.values()].sort((a, b) => toMin(a.start) - toMin(b.start));
}

export type DayStatus = "available" | "full" | "closed";

export function dayStatus(slots: Slot[]): { status: DayStatus; available: number } {
  const available = slots.filter((s) => s.status === "available").length;
  if (available) return { status: "available", available };
  if (slots.some((s) => s.status === "booked")) return { status: "full", available: 0 };
  return { status: "closed", available: 0 };
}

/** Double-check before committing a booking (race-safe for the demo store). */
export function canBook(sp: Specialist, start: string, ctx: Ctx): boolean {
  return specialistSlots(sp, ctx).some((s) => s.start === start && s.status === "available");
}

/** Validation for manual (admin) bookings at arbitrary times: no overlap incl. buffer. */
export function hasConflict(
  spId: string,
  date: string,
  start: string,
  dur: number,
  ctx: Omit<Ctx, "date" | "durationMin">,
): boolean {
  const s = toMin(start);
  const e = s + dur;
  const buf = ctx.bufferMin;
  return (
    ctx.bookings.some(
      (b) =>
        b.id !== ctx.ignoreId &&
        b.specialistId === spId &&
        b.date === date &&
        OCCUPYING.includes(b.status) &&
        s < toMin(b.start) + b.durationMin + buf &&
        toMin(b.start) < e + buf,
    ) ||
    ctx.blocks.some(
      (b) =>
        b.date === date &&
        (b.specialistId === spId || b.specialistId === "all") &&
        (!b.start || (s < toMin(b.end!) && toMin(b.start) < e)),
    )
  );
}
