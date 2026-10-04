import type { PaymentPlan } from "@/lib/booking/payment";
/* ──────────────────────────────────────────────────────────────
   Vida Beauty — domain model
   Everything the demo stores or renders is typed here so the
   production API can replace the local demo store 1:1.
   ────────────────────────────────────────────────────────────── */

export type ServiceCategory = "brows" | "lips" | "eyes";

export interface Service {
  slug: string;
  title: string;
  latin: string;
  category: ServiceCategory;
  number: string; // editorial numeral, e.g. "01"
  short: string;
  long: string[];
  /** true until the owner confirms the exact technical description */
  copyIsPlaceholder?: boolean;
  durationMin: number;
  /** Price in Toman */
  price: number;
  /** DEMO: every price is a placeholder until real prices are provided */
  priceIsDemo: boolean;
  touchUp?: string;
  longevity?: string;
  steps: { title: string; text: string }[];
  image: MediaKey;
  gallery: MediaKey[];
  seo: { title: string; description: string };
}

export interface WorkingHours {
  /** 0 = Sunday … 6 = Saturday (JS getDay) */
  day: number;
  open: string | null; // "10:00" or null when not working
  close: string | null;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[]; // service slugs
  photo: MediaKey | null;
  documents: string[];
  hours: WorkingHours[];
  isPlaceholder: boolean;
  active: boolean;
}

export type BookingStatus =
  "pending" | "awaiting_payment" | "paid" | "confirmed" | "cancelled" | "refunded" | "completed" | "no_show" | "rejected";

export type BookingSource = "online" | "phone" | "admin";

export interface Booking {
  id: string; // VB-10245
  serviceSlug: string;
  specialistId: string;
  date: string; // YYYY-MM-DD (Gregorian, local)
  start: string; // "10:00"
  durationMin: number;
  customer: { name: string; phone: string };
  notes?: string;
  price: number;
  paid: number;
  refunded: number;
  status: BookingStatus;
  source: BookingSource;
  createdAt: string; // ISO
  history: { at: string; status: BookingStatus; note?: string }[];
  /** how it was paid (direct or SnappPay / DigiPay installments) */
  payment?: PaymentPlan;
  isDemo?: boolean;
}

export interface TimeBlock {
  id: string;
  specialistId: string | "all";
  date: string; // YYYY-MM-DD
  /** null start/end = whole day */
  start: string | null;
  end: string | null;
  reason?: string;
}

export interface CustomerMeta {
  phone: string;
  /** name the customer set in the user panel */
  name?: string;
  notes?: string;
  discounts?: string;
  /* ── Loyalty-ready fields (not active in the demo) ── */
  tier?: "standard" | "vip";
  birthday?: string;
  loyaltyPoints?: number;
  referralCode?: string;
  referredBy?: string;
  nextVisitDiscount?: number;
}

export interface Customer extends CustomerMeta {
  name: string;
  bookingCount: number;
  totalSpent: number;
  lastAppointment: string | null;
  servicesUsed: string[];
  cancelledCount: number;
  firstSeen: string;
}

export interface SmsMessage {
  id: string;
  to: string;
  bookingId: string;
  kind: "confirmation" | "reminder" | "cancellation";
  body: string;
  /** when it was / will be sent (ISO) */
  sendAt: string;
  status: "sent" | "scheduled";
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  service: string;
  isDemo: boolean;
  visible: boolean;
}

export interface Course {
  id: string;
  title: string;
  latin: string;
  summary: string;
  duration: string;
  format: string;
  price: number;
  priceIsDemo: boolean;
  includes: string[];
  image: MediaKey;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Settings {
  salonName: string;
  phone: string;
  bufferMin: number;
  cancellationWindowHours: number;
  cancellationFeePercent: number;
  bookingHorizonDays: number;
  slotStepMin: number;
}

/* ── Future commerce (architecture only — not built in the demo) ── */
export type ProductKind = "aftercare" | "cosmetic" | "package" | "course" | "digital";
export interface Product {
  id: string;
  kind: ProductKind;
  title: string;
  price: number;
  stock?: number;
  image?: MediaKey;
  /** a package can bundle services / products */
  bundle?: { serviceSlugs?: string[]; productIds?: string[] };
}

export type MediaKey = string;
