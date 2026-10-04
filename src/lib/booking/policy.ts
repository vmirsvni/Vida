import type { Booking, BookingStatus, Settings } from "@/data/types";
import { appointmentDate } from "@/lib/format";

/* Cancellation policy
   • ≥ 24h before the appointment → 20% fee, 80% refunded
   • <  24h                      → no refund
   Values come from Settings so the owner can change them later. */

export function refundQuote(b: Pick<Booking, "date" | "start" | "paid">, s: Settings, now = new Date()) {
  const hoursLeft = (appointmentDate(b.date, b.start).getTime() - now.getTime()) / 36e5;
  const eligible = hoursLeft >= s.cancellationWindowHours;
  const fee = eligible ? Math.round((b.paid * s.cancellationFeePercent) / 100) : b.paid;
  return { hoursLeft, eligible, fee, refund: b.paid - fee };
}

export const statusLabel: Record<BookingStatus, string> = {
  pending: "در انتظار بررسی",
  awaiting_payment: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  confirmed: "تأییدشده",
  cancelled: "لغوشده",
  refunded: "بازپرداخت‌شده",
  completed: "انجام‌شده",
  no_show: "عدم حضور",
  rejected: "ردشده",
};

/** Tone used by the admin UI (keeps colour meaning consistent) */
export const statusTone: Record<BookingStatus, "wine" | "gold" | "ok" | "muted" | "warn"> = {
  pending: "gold",
  awaiting_payment: "gold",
  paid: "wine",
  confirmed: "wine",
  cancelled: "muted",
  refunded: "muted",
  completed: "ok",
  no_show: "warn",
  rejected: "muted",
};

export const sourceLabel = { online: "آنلاین", phone: "تلفنی", admin: "ادمین" } as const;

/** Which status transitions the admin may perform */
export const transitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "awaiting_payment", "rejected", "cancelled"],
  awaiting_payment: ["paid", "cancelled", "rejected"],
  paid: ["confirmed", "cancelled", "refunded"],
  confirmed: ["completed", "no_show", "cancelled", "refunded"],
  cancelled: ["refunded"],
  refunded: [],
  completed: [],
  no_show: [],
  rejected: [],
};
