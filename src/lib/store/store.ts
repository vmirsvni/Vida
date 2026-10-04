"use client";

/* ──────────────────────────────────────────────────────────────
   DEMO REPOSITORY — localStorage-backed.
   All reads/writes go through this module, so production can swap it
   for API calls (same function names) without touching the UI.
   ────────────────────────────────────────────────────────────── */

import { useMemo, useSyncExternalStore } from "react";
import type {
  Booking,
  BookingSource,
  BookingStatus,
  Course,
  Customer,
  CustomerMeta,
  Service,
  Settings,
  SmsMessage,
  Specialist,
  Testimonial,
  TimeBlock,
} from "@/data/types";
import { services as baseServices } from "@/data/services";
import { specialists as baseSpecialists } from "@/data/specialists";
import { courses as baseCourses, testimonials as baseTestimonials } from "@/data/content";
import { defaultSettings, site } from "@/data/site";
import { appointmentDate, faDateLong, faNum, faTime } from "@/lib/format";
import { refundQuote } from "@/lib/booking/policy";
import { buildPlan, METHODS, paidOf, type PaymentMethod, type PaymentPlan } from "@/lib/booking/payment";
import { seedData } from "./seed";
import { demoFromPath } from "@/lib/demo";

/* Each demo keeps its own data so the two presentations never mix bookings. */
const KEYS = { "demo-2": "vida-demo2-v1", "demo-3": "vida-demo3-v1", "demo-4": "vida-demo4-v1" } as const;
const currentKey = () => KEYS[demoFromPath(window.location.pathname)];

export interface DemoState {
  version: 1;
  bookings: Booking[];
  blocks: TimeBlock[];
  sms: SmsMessage[];
  services: Service[];
  specialists: Specialist[];
  testimonials: Testimonial[];
  courses: Course[];
  settings: Settings;
  customerMeta: Record<string, CustomerMeta>;
  /** signed-in customer (user panel, mock OTP) */
  account?: { phone: string } | null;
  /** demo 4 shop */
  cart?: CartItem[];
  orders?: Order[];
  nextId: number;
  seededAt: string;
}

function fresh(): DemoState {
  const seed = seedData();
  return {
    version: 1,
    bookings: seed.bookings,
    blocks: seed.blocks,
    sms: [],
    services: baseServices,
    specialists: baseSpecialists,
    testimonials: baseTestimonials,
    courses: baseCourses,
    settings: defaultSettings,
    customerMeta: {},
    nextId: seed.nextId,
    seededAt: new Date().toISOString(),
  };
}

/** Server snapshot: static data, no bookings (they depend on "today") */
const serverState: DemoState = {
  version: 1,
  bookings: [],
  blocks: [],
  sms: [],
  services: baseServices,
  specialists: baseSpecialists,
  testimonials: baseTestimonials,
  courses: baseCourses,
  settings: defaultSettings,
  customerMeta: {},
  nextId: 10001,
  seededAt: "",
};

const cache: Record<string, DemoState | undefined> = {};
const listeners = new Set<() => void>();

function load(): DemoState {
  try {
    const raw = localStorage.getItem(currentKey());
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed?.version === 1 && Array.isArray(parsed.bookings)) {
        // Saved states from older builds still carry «[…]» placeholder specialists — refresh their copy.
        parsed.specialists = parsed.specialists.map((x) =>
          x.title.startsWith("[") ? (baseSpecialists.find((b) => b.id === x.id) ?? x) : x,
        );
        return parsed;
      }
    }
  } catch {
    /* private mode / corrupted — fall through to a fresh seed */
  }
  const s = fresh();
  persist(s);
  return s;
}

function persist(s: DemoState) {
  try {
    localStorage.setItem(currentKey(), JSON.stringify(s));
  } catch {
    /* storage full or blocked — the demo keeps working in memory */
  }
}

export function getState(): DemoState {
  if (typeof window === "undefined") return serverState;
  const key = currentKey();
  if (!cache[key]) cache[key] = load();
  return cache[key]!;
}

function emit() {
  listeners.forEach((l) => l());
}

export function update(fn: (s: DemoState) => DemoState) {
  const next = fn(getState());
  cache[currentKey()] = next;
  persist(next);
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key && (Object.values(KEYS) as string[]).includes(e.key)) {
      cache[e.key] = undefined;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useDemo(): DemoState {
  return useSyncExternalStore(subscribe, getState, () => serverState);
}

/** true once the client store has loaded (avoids flashing empty admin tables) */
export function useHydrated(): boolean {
  const s = useDemo();
  return s !== serverState;
}

export function resetDemo() {
  const s = fresh();
  cache[currentKey()] = s;
  persist(s);
  emit();
}

/* ── Bookings ────────────────────────────────────────────────── */

export interface BookingDraft {
  serviceSlug: string;
  specialistId: string;
  date: string;
  start: string;
  customer: { name: string; phone: string };
  notes?: string;
  source: BookingSource;
  status?: BookingStatus;
}

export function createBooking(d: BookingDraft): Booking {
  const s = getState();
  const svc = s.services.find((x) => x.slug === d.serviceSlug)!;
  const now = new Date().toISOString();
  const status = d.status ?? "awaiting_payment";
  const b: Booking = {
    id: `VB-${s.nextId}`,
    serviceSlug: d.serviceSlug,
    specialistId: d.specialistId,
    date: d.date,
    start: d.start,
    durationMin: svc.durationMin,
    customer: d.customer,
    notes: d.notes,
    price: svc.price,
    paid: status === "paid" || status === "confirmed" ? svc.price : 0,
    refunded: 0,
    status,
    source: d.source,
    createdAt: now,
    history: [{ at: now, status }],
  };
  update((st) => ({ ...st, bookings: [...st.bookings, b], nextId: st.nextId + 1 }));
  if (status === "confirmed") queueSms(b.id);
  return b;
}

export function getBooking(id: string) {
  return getState().bookings.find((b) => b.id === id);
}

export function setStatus(id: string, status: BookingStatus, note?: string, patch: Partial<Booking> = {}) {
  update((s) => ({
    ...s,
    bookings: s.bookings.map((b) =>
      b.id === id ? { ...b, ...patch, status, history: [...b.history, { at: new Date().toISOString(), status, note }] } : b,
    ),
  }));
}

export function removeBooking(id: string) {
  update((s) => ({ ...s, bookings: s.bookings.filter((b) => b.id !== id) }));
}

/** Mock gateway success → paid → confirmed + SMS.
    Direct = full price now; SnappPay / DigiPay = first installment now, the rest monthly. */
export function completePayment(id: string, ref: string, method: PaymentMethod = "direct") {
  const b = getBooking(id);
  if (!b) return;
  const plan = buildPlan(b.price, method);
  plan.installments[0].paidAt = new Date().toISOString();
  const label = method === "direct" ? "پرداخت آزمایشی" : `قسط اول ${METHODS[method].title} (آزمایشی)`;
  setStatus(id, "paid", `${label} · کد پیگیری ${ref}`, { paid: paidOf(plan), payment: plan });
  setStatus(id, "confirmed", "تأیید خودکار پس از پرداخت");
  queueSms(id);
}

/** User panel: pay the next open installment (mock). */
export function payInstallment(id: string, n: number) {
  const b = getBooking(id);
  if (!b?.payment) return;
  const plan = {
    ...b.payment,
    installments: b.payment.installments.map((i) => (i.n === n && !i.paidAt ? { ...i, paidAt: new Date().toISOString() } : i)),
  };
  update((s) => ({
    ...s,
    bookings: s.bookings.map((x) =>
      x.id === id
        ? {
            ...x,
            payment: plan,
            paid: paidOf(plan),
            history: [...x.history, { at: new Date().toISOString(), status: x.status, note: `پرداخت قسط ${faNum(n)} (آزمایشی)` }],
          }
        : x,
    ),
  }));
  addSms({
    to: b.customer.phone,
    bookingId: id,
    kind: "confirmation",
    body: `Vida Beauty\nقسط ${faNum(n)} رزرو ${id} پرداخت شد.\nمبلغ: ${faNum((plan.installments[n - 1]?.amount ?? 0).toLocaleString("en-US"))} تومان`,
    sendAt: new Date().toISOString(),
    status: "sent",
  });
}

/* ── Shop (demo 4) ──────────────────────────────────────────── */
export interface CartItem {
  id: string;
  qty: number;
}
export type ShopDelivery = "pickup" | "courier" | "post";
export type OrderStatus = "awaiting_payment" | "processing" | "shipped" | "delivered" | "cancelled";
export interface Order {
  id: string;
  createdAt: string;
  items: { id: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: { name: string; phone: string };
  delivery: { method: ShopDelivery; city: string; address: string; postal: string };
  status: OrderStatus;
  payment?: PaymentPlan;
  paid: number;
  ref?: string;
}

export function addToCart(id: string, qty = 1) {
  update((s) => {
    const cart = s.cart ?? [];
    const hit = cart.find((c) => c.id === id);
    return { ...s, cart: hit ? cart.map((c) => (c.id === id ? { ...c, qty: Math.min(9, c.qty + qty) } : c)) : [...cart, { id, qty }] };
  });
}
export function setCartQty(id: string, qty: number) {
  update((s) => ({
    ...s,
    cart: qty <= 0 ? (s.cart ?? []).filter((c) => c.id !== id) : (s.cart ?? []).map((c) => (c.id === id ? { ...c, qty: Math.min(9, qty) } : c)),
  }));
}
export function clearCart() {
  update((s) => ({ ...s, cart: [] }));
}

export function createOrder(d: Omit<Order, "id" | "createdAt" | "status" | "paid">): Order {
  const order: Order = {
    ...d,
    id: `VO-${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: "awaiting_payment",
    paid: 0,
  };
  update((s) => ({ ...s, orders: [order, ...(s.orders ?? [])] }));
  return order;
}
export function removeOrder(id: string) {
  update((s) => ({ ...s, orders: (s.orders ?? []).filter((o) => o.id !== id) }));
}

/** Mock gateway success: first installment (or full amount) paid, cart emptied, SMS sent. */
export function completeOrderPayment(id: string, ref: string, method: PaymentMethod = "direct") {
  const o = getState().orders?.find((x) => x.id === id);
  if (!o) return;
  const plan = buildPlan(o.total, method);
  plan.installments[0].paidAt = new Date().toISOString();
  update((s) => ({
    ...s,
    cart: [],
    orders: (s.orders ?? []).map((x) => (x.id === id ? { ...x, status: "processing", payment: plan, paid: paidOf(plan), ref } : x)),
  }));
  addSms({
    to: o.customer.phone,
    bookingId: id,
    kind: "confirmation",
    body: `Vida Beauty\nسفارش ${id} ثبت شد.\nمبلغ پرداخت‌شده: ${faNum(paidOf(plan).toLocaleString("en-US"))} تومان`,
    sendAt: new Date().toISOString(),
    status: "sent",
  });
}

export function payOrderInstallment(id: string, n: number) {
  update((s) => ({
    ...s,
    orders: (s.orders ?? []).map((o) => {
      if (o.id !== id || !o.payment) return o;
      const plan = { ...o.payment, installments: o.payment.installments.map((i) => (i.n === n && !i.paidAt ? { ...i, paidAt: new Date().toISOString() } : i)) };
      return { ...o, payment: plan, paid: paidOf(plan) };
    }),
  }));
}

/* ── Customer session (mock OTP) ────────────────────────────── */
export function signIn(phone: string) {
  update((s) => ({ ...s, account: { phone } }));
}
export function signOut() {
  update((s) => ({ ...s, account: null }));
}

/** Admin cancel with policy-based refund */
export function cancelBooking(id: string, byCustomer = true) {
  const s = getState();
  const b = s.bookings.find((x) => x.id === id);
  if (!b) return;
  const q = refundQuote(b, s.settings);
  const refund = byCustomer ? q.refund : b.paid; // salon-side cancel refunds in full
  setStatus(
    id,
    "cancelled",
    byCustomer ? `لغو توسط مشتری · قابل بازپرداخت ${faNum(refund.toLocaleString("en-US"))} تومان` : "لغو توسط سالن",
  );
  if (b.paid > 0 && refund > 0) {
    setStatus(id, "refunded", "بازپرداخت انجام شد", { refunded: refund });
  }
  addSms({
    to: b.customer.phone,
    bookingId: id,
    kind: "cancellation",
    body: `Vida Beauty\nرزرو ${id} لغو شد.${refund ? `\nمبلغ بازپرداخت: ${faNum(refund.toLocaleString("en-US"))} تومان` : ""}`,
    sendAt: new Date().toISOString(),
    status: "sent",
  });
}

/* ── SMS (simulated) ────────────────────────────────────────── */

function addSms(m: Omit<SmsMessage, "id">) {
  update((s) => ({ ...s, sms: [...s.sms, { ...m, id: `sms-${s.sms.length + 1}-${Date.now()}` }] }));
}

export function smsBodies(b: Booking) {
  const s = getState();
  const svc = s.services.find((x) => x.slug === b.serviceSlug);
  const sp = s.specialists.find((x) => x.id === b.specialistId);
  return {
    confirmation: [
      "Vida Beauty",
      "رزرو شما با موفقیت ثبت شد.",
      `خدمت: ${svc?.title ?? ""}`,
      `متخصص: ${sp?.name ?? ""}`,
      `تاریخ: ${faDateLong(b.date)}`,
      `ساعت: ${faTime(b.start)}`,
      `کد رزرو: ${b.id}`,
      ...(b.payment && b.payment.method !== "direct"
        ? [`پرداخت: ${METHODS[b.payment.method].title} · ${faNum(b.payment.installments.length)} قسط`]
        : []),
    ].join("\n"),
    reminder: ["یادآوری نوبت Vida Beauty", `فردا ساعت ${faTime(b.start)} منتظر شما هستیم.`, `کد رزرو: ${b.id}`].join("\n"),
  };
}

function queueSms(id: string) {
  const b = getBooking(id);
  if (!b) return;
  const bodies = smsBodies(b);
  addSms({
    to: b.customer.phone,
    bookingId: id,
    kind: "confirmation",
    body: bodies.confirmation,
    sendAt: new Date().toISOString(),
    status: "sent",
  });
  const remindAt = new Date(appointmentDate(b.date, b.start).getTime() - 24 * 36e5);
  addSms({
    to: b.customer.phone,
    bookingId: id,
    kind: "reminder",
    body: bodies.reminder,
    sendAt: remindAt.toISOString(),
    status: remindAt > new Date() ? "scheduled" : "sent",
  });
}

/* ── Blocks, catalogue, settings ─────────────────────────────── */

export function addBlock(b: Omit<TimeBlock, "id">) {
  update((s) => ({ ...s, blocks: [...s.blocks, { ...b, id: `blk-${Date.now()}` }] }));
}
export function removeBlock(id: string) {
  update((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== id) }));
}
export function saveSpecialist(sp: Specialist) {
  update((s) => ({ ...s, specialists: s.specialists.map((x) => (x.id === sp.id ? sp : x)) }));
}
export function saveService(svc: Service) {
  update((s) => ({ ...s, services: s.services.map((x) => (x.slug === svc.slug ? svc : x)) }));
}
export function saveTestimonial(t: Testimonial) {
  update((s) => ({ ...s, testimonials: s.testimonials.map((x) => (x.id === t.id ? t : x)) }));
}
export function saveCourse(c: Course) {
  update((s) => ({ ...s, courses: s.courses.map((x) => (x.id === c.id ? c : x)) }));
}
export function saveSettings(settings: Settings) {
  update((s) => ({ ...s, settings }));
}
export function saveCustomerMeta(phone: string, meta: Partial<CustomerMeta>) {
  update((s) => ({
    ...s,
    customerMeta: { ...s.customerMeta, [phone]: { ...s.customerMeta[phone], ...meta, phone } },
  }));
}

/* ── Derived: customers ─────────────────────────────────────── */

const SPENT: BookingStatus[] = ["paid", "confirmed", "completed", "no_show"];

export function deriveCustomers(s: DemoState): Customer[] {
  const map = new Map<string, Customer>();
  const sorted = [...s.bookings].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  for (const b of sorted) {
    const c =
      map.get(b.customer.phone) ??
      ({
        ...s.customerMeta[b.customer.phone],
        name: b.customer.name,
        phone: b.customer.phone,
        bookingCount: 0,
        totalSpent: 0,
        lastAppointment: null,
        servicesUsed: [],
        cancelledCount: 0,
        firstSeen: b.createdAt,
      } as Customer);
    c.bookingCount++;
    if (SPENT.includes(b.status)) c.totalSpent += b.paid;
    if (b.status === "refunded" || b.status === "cancelled") {
      c.cancelledCount++;
      c.totalSpent += b.paid - b.refunded;
    }
    if (["completed", "confirmed", "paid"].includes(b.status)) c.lastAppointment = b.date;
    if (!c.servicesUsed.includes(b.serviceSlug)) c.servicesUsed.push(b.serviceSlug);
    if (b.createdAt < c.firstSeen) c.firstSeen = b.createdAt;
    map.set(b.customer.phone, c);
  }
  return [...map.values()];
}

export function useCustomers() {
  const s = useDemo();
  return useMemo(() => deriveCustomers(s), [s]);
}

export const salonPhone = site.phone;
