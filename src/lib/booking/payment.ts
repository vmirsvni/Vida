/* ──────────────────────────────────────────────────────────────
   Payment methods — direct (bank IPG) or BNPL installments
   (SnappPay / DigiPay). Pure functions; the store and UI use them.
   ⚠️ Installment terms are DEMO terms — confirm with each provider.
   ────────────────────────────────────────────────────────────── */

export type PaymentMethod = "direct" | "snapppay" | "digipay";

export interface Installment {
  n: number; // 1-based
  amount: number; // toman
  due: string; // ISO date (YYYY-MM-DD)
  paidAt?: string; // ISO timestamp
}

export interface PaymentPlan {
  method: PaymentMethod;
  installments: Installment[];
}

export const METHODS: Record<
  PaymentMethod,
  { title: string; short: string; count: number; note: string; color: string }
> = {
  direct: {
    title: "پرداخت مستقیم",
    short: "درگاه بانکی",
    count: 1,
    note: "پرداخت کامل با همه کارت‌های عضو شتاب",
    color: "#35051F",
  },
  snapppay: {
    title: "اسنپ‌پی",
    short: "۴ قسط",
    count: 4,
    note: "۴ قسط ماهانه بدون کارمزد · قسط اول همین حالا",
    color: "#00D170",
  },
  digipay: {
    title: "دیجی‌پی",
    short: "۴ قسط",
    count: 4,
    note: "اعتبار خرید اقساطی · ۴ قسط ماهانه",
    color: "#1E5AFA",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");
function addMonths(d: Date, m: number): string {
  const x = new Date(d.getFullYear(), d.getMonth() + m, d.getDate());
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
}

/** Split a price into equal installments rounded to 1,000 toman; the first one absorbs the remainder. */
export function buildPlan(price: number, method: PaymentMethod, start = new Date()): PaymentPlan {
  const count = METHODS[method].count;
  const each = Math.floor(price / count / 1000) * 1000;
  const first = price - each * (count - 1);
  const installments: Installment[] = Array.from({ length: count }, (_, i) => ({
    n: i + 1,
    amount: i === 0 ? first : each,
    due: addMonths(start, i),
  }));
  return { method, installments };
}

export const paidOf = (p: PaymentPlan) => p.installments.reduce((t, i) => t + (i.paidAt ? i.amount : 0), 0);
export const remainingOf = (p: PaymentPlan) => p.installments.reduce((t, i) => t + (i.paidAt ? 0 : i.amount), 0);
export const nextDue = (p: PaymentPlan) => p.installments.find((i) => !i.paidAt);

export function isMethod(v: unknown): v is PaymentMethod {
  return v === "direct" || v === "snapppay" || v === "digipay";
}
