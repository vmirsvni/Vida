import type { Booking, BookingStatus, TimeBlock } from "@/data/types";
import { services } from "@/data/services";
import { specialists } from "@/data/specialists";
import { defaultSettings } from "@/data/site";
import { addDays, dateKey, fromKey } from "@/lib/format";
import { specialistSlots } from "@/lib/booking/slots";

/* ⚠️ DEMO SEED — fictional customers (phones use the unassigned 0900 prefix). */

const names = [
  "سارا احمدی",
  "مریم کریمی",
  "نگار رضایی",
  "الهام موسوی",
  "نازنین حسینی",
  "فاطمه صادقی",
  "زهرا محمدی",
  "هانیه جعفری",
  "مهسا نوری",
  "پریسا اکبری",
  "آیدا رحیمی",
  "شیدا فرهادی",
  "یاسمن کاظمی",
  "ترانه قاسمی",
  "مینا شریفی",
  "رویا طاهری",
  "لیلا بهرامی",
  "نیلوفر امینی",
  "سمیرا یوسفی",
  "کیانا عباسی",
  "دریا مرادی",
  "بهاره نیک‌نام",
];
const phone = (i: number) => `0900000${String(1000 + i * 37).slice(-4)}`;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedData(now = new Date()) {
  const r = rng(20251028);
  const today = dateKey(now);
  const bookings: Booking[] = [];
  let id = 10102;

  // one salon-wide closed day and one specialist time-block (e.g. "Specialist 2, Tuesday 14–17")
  const blocks: TimeBlock[] = [];
  for (let i = 1; i < 10; i++) {
    const k = addDays(today, i);
    if (fromKey(k).getDay() === 2) {
      blocks.push({ id: "blk-1", specialistId: "s2", date: k, start: "14:00", end: "17:00", reason: "مرخصی (دمو)" });
      break;
    }
  }
  const holiday = addDays(today, 11);
  if (fromKey(holiday).getDay() !== 5) {
    blocks.push({ id: "blk-2", specialistId: "all", date: holiday, start: null, end: null, reason: "تعطیل رسمی (دمو)" });
  }

  const pastNow = new Date(now);
  for (let offset = -28; offset <= 20; offset++) {
    const date = addDays(today, offset);
    const past = offset < 0;
    for (const sp of specialists) {
      // walk the day, placing bookings one by one so buffers are respected
      for (let guard = 0; guard < 6; guard++) {
        const slug = sp.specialties[Math.floor(r() * sp.specialties.length)];
        const svc = services.find((s) => s.slug === slug)!;
        const ctx = {
          date,
          durationMin: svc.durationMin,
          bookings,
          blocks,
          bufferMin: defaultSettings.bufferMin,
          // evaluate past days (and today) as if we were standing on that morning
          now: offset <= 0 ? new Date(fromKey(date).setHours(6)) : pastNow,
        };
        const free = specialistSlots(sp, ctx).filter((s) => s.status === "available");
        if (!free.length) break;
        const fill = past ? 0.72 : offset === 0 ? 0.9 : offset < 7 ? 0.66 : 0.4;
        if (r() > fill) break;
        const slot = free[Math.floor(r() * free.length)];
        const who = Math.floor(r() * names.length);
        let status: BookingStatus;
        const x = r();
        const startedAlready =
          offset === 0 &&
          Number(slot.start.slice(0, 2)) * 60 + Number(slot.start.slice(3)) < now.getHours() * 60 + now.getMinutes();
        if (past) status = x < 0.84 ? "completed" : x < 0.9 ? "no_show" : x < 0.95 ? "cancelled" : "refunded";
        else if (startedAlready) status = "completed";
        else status = x < 0.78 ? "confirmed" : x < 0.88 ? "paid" : x < 0.94 ? "pending" : "awaiting_payment";
        const paid = status === "pending" || status === "awaiting_payment" ? 0 : svc.price;
        const refunded = status === "refunded" ? Math.round(svc.price * 0.8) : 0;
        const created = new Date(fromKey(addDays(date, -Math.ceil(r() * 12))).setHours(9 + Math.floor(r() * 10)));
        const src = r();
        bookings.push({
          id: `VB-${id++}`,
          serviceSlug: svc.slug,
          specialistId: sp.id,
          date,
          start: slot.start,
          durationMin: svc.durationMin,
          customer: { name: names[who], phone: phone(who) },
          price: svc.price,
          paid,
          refunded,
          status,
          source: src < 0.72 ? "online" : src < 0.92 ? "phone" : "admin",
          createdAt: created.toISOString(),
          history: [{ at: created.toISOString(), status }],
          isDemo: true,
        });
      }
    }
  }
  return { bookings, blocks, nextId: id };
}
