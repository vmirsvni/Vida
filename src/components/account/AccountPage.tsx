"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { site } from "@/data/site";
import {
  cancelBooking,
  payInstallment,
  saveCustomerMeta,
  signIn,
  signOut,
  useDemo,
  useHydrated,
} from "@/lib/store/store";
import { refundQuote, statusLabel } from "@/lib/booking/policy";
import { METHODS, nextDue, remainingOf } from "@/lib/booking/payment";
import { PlanTable, MethodMark } from "@/components/booking/PaymentUI";
import { faDateLong, faNum, faTime, isValidMobile, normalizeDigits, toman } from "@/lib/format";
import { ArrowLeft, Phone } from "@/components/ui/Icons";
import { useDemoBase } from "@/lib/useDemoBase";
import type { Booking } from "@/data/types";

/**
 * Customer account — DEMO.
 * Sign-in is simulated (the one-time code is shown on screen instead of being texted).
 * Production: OTP via the SMS provider + a real session.
 */
export function AccountPage() {
  const s = useDemo();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-[70vh]" />;
  return s.account?.phone ? <Dashboard phone={s.account.phone} /> : <SignIn />;
}

/* ── Sign-in (mock OTP) ─────────────────────────────────────── */
const makeCode = () => String(Math.floor(10000 + Math.random() * 89999));

function SignIn() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const clean = normalizeDigits(phone).replace(/\D/g, "");

  function send() {
    if (!isValidMobile(clean)) return setErr("شماره موبایل معتبر نیست (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).");
    setErr(null);
    setCode(makeCode());
  }
  function verify() {
    if (normalizeDigits(typed).trim() !== code) return setErr("کد واردشده درست نیست.");
    signIn(clean);
  }

  return (
    <div className="wrap grid min-h-[70vh] items-center py-16 lg:grid-cols-12 lg:py-24">
      <div className="lg:col-span-5 lg:col-start-1">
        <p className="t-eyebrow text-gold-ink">My Vida</p>
        <h1 className="t-display mt-5 text-wine">پنل کاربر</h1>
        <p className="t-lead mt-5 text-charcoal">نوبت‌ها، اقساط و پیامک‌های خود را در یک‌جا ببینید.</p>
        <p className="mt-4 text-[13px] leading-7 text-muted">
          با همان شماره‌ای وارد شوید که هنگام رزرو ثبت کرده‌اید.
        </p>
      </div>
      <div className="mt-12 lg:col-span-5 lg:col-start-8 lg:mt-0">
        <div className="border border-line bg-ivory p-6 sm:p-8">
          {!code ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <label htmlFor="acc-phone" className="t-label">
                شماره موبایل
              </label>
              <input
                id="acc-phone"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                className="field mt-2 text-left"
                placeholder="09xx xxx xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {err && <p className="mt-2 text-[13px] text-wine">{err}</p>}
              <button type="submit" className="btn btn-primary mt-8 w-full">
                دریافت کد ورود <ArrowLeft className="arrow" size={16} />
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verify();
              }}
            >
              <div className="mb-6 rounded-2xl bg-cream px-4 py-3 text-[13px] leading-7">
                <span className="text-muted">پیامک آزمایشی به {faNum(clean)}:</span>
                <br />
                کد ورود Vida Beauty: <strong className="tracking-widest">{faNum(code)}</strong>
              </div>
              <label htmlFor="acc-code" className="t-label">
                کد ۵ رقمی
              </label>
              <input
                id="acc-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                dir="ltr"
                className="field mt-2 text-center tracking-[0.5em]"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
              />
              {err && <p className="mt-2 text-[13px] text-wine">{err}</p>}
              <button type="submit" className="btn btn-primary mt-8 w-full">
                ورود
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode(null);
                  setTyped("");
                }}
                className="mt-4 w-full text-[13px] text-muted underline underline-offset-4"
              >
                تغییر شماره
              </button>
            </form>
          )}
        </div>
        <p className="mt-4 text-center text-[12px] text-muted">ورود نمایشی — در نسخه نهایی کد واقعاً پیامک می‌شود.</p>
      </div>
    </div>
  );
}

/* ── Dashboard ───────────────────────────────────────────────── */
const TABS = [
  ["bookings", "نوبت‌های من"],
  ["payments", "پرداخت‌ها و اقساط"],
  ["sms", "پیامک‌ها"],
  ["profile", "پروفایل"],
] as const;
type Tab = (typeof TABS)[number][0];

const ACTIVE = new Set(["confirmed", "paid", "pending", "awaiting_payment"]);

function Dashboard({ phone }: { phone: string }) {
  const base = useDemoBase();
  const s = useDemo();
  const [tab, setTab] = useState<Tab>("bookings");
  const mine = useMemo(
    () =>
      s.bookings
        .filter((b) => b.customer.phone === phone)
        .sort((a, b) => (a.date + a.start < b.date + b.start ? 1 : -1)),
    [s.bookings, phone],
  );
  const name = s.customerMeta[phone]?.name ?? mine[0]?.customer.name ?? "";
  const upcoming = mine.filter((b) => ACTIVE.has(b.status));
  const plans = mine.filter((b) => b.payment && b.payment.method !== "direct");
  const due = plans.reduce((t, b) => t + (ACTIVE.has(b.status) ? remainingOf(b.payment!) : 0), 0);

  return (
    <div className="wrap py-12 lg:py-20">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="t-eyebrow text-gold-ink">My Vida</p>
          <h1 className="t-h2 mt-3 text-wine">{name ? `${name} عزیز، خوش آمدید` : "خوش آمدید"}</h1>
          <p className="mt-2 text-[14px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
            {faNum(phone)}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`${base}/booking`} className="btn btn-primary">
            رزرو نوبت جدید
          </Link>
          <button type="button" onClick={signOut} className="btn btn-ghost text-charcoal">
            خروج
          </button>
        </div>
      </header>

      <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-6">
        {[
          ["نوبت پیش‌رو", faNum(upcoming.length)],
          ["کل رزروها", faNum(mine.length)],
          ["اقساط باقی‌مانده", due ? toman(due) : "—"],
        ].map(([k, v]) => (
          <div key={k} className="border border-line bg-ivory p-4 sm:p-6">
            <dt className="text-[12px] text-muted sm:text-[13px]">{k}</dt>
            <dd className="mt-2 font-display text-[20px] text-espresso sm:text-[28px]">{v}</dd>
          </div>
        ))}
      </dl>

      <div role="tablist" aria-label="بخش‌های پنل" className="snap-x mt-10 flex gap-6 overflow-x-auto border-b border-line">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`min-h-12 shrink-0 border-b-2 pb-2 text-[15px] transition-colors ${
              tab === k ? "border-wine text-wine" : "border-transparent text-muted hover:text-espresso"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8" role="tabpanel">
        {tab === "bookings" && <BookingsTab list={mine} />}
        {tab === "payments" && <PaymentsTab list={mine} />}
        {tab === "sms" && <SmsTab phone={phone} />}
        {tab === "profile" && <ProfileTab phone={phone} name={name} />}
      </div>
      <p className="mt-14 text-center text-[12px] text-muted">پنل کاربر نمایشی است؛ داده‌ها فقط در همین مرورگر ذخیره می‌شوند.</p>
    </div>
  );
}

function Empty() {
  const base = useDemoBase();
  return (
    <div className="border border-dashed border-line px-6 py-14 text-center">
      <p className="text-charcoal">هنوز رزروی با این شماره ثبت نشده است.</p>
      <Link href={`${base}/booking`} className="btn btn-primary mt-6">
        رزرو اولین نوبت
      </Link>
    </div>
  );
}

function BookingsTab({ list }: { list: Booking[] }) {
  const s = useDemo();
  const [confirming, setConfirming] = useState<string | null>(null);
  if (!list.length) return <Empty />;
  return (
    <ul className="grid gap-4">
      {list.map((b) => {
        const svc = s.services.find((x) => x.slug === b.serviceSlug);
        const sp = s.specialists.find((x) => x.id === b.specialistId);
        const active = ACTIVE.has(b.status);
        const q = refundQuote(b, s.settings);
        return (
          <li key={b.id} className="border border-line bg-ivory p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-[22px] text-espresso">{svc?.title}</p>
                <p className="mt-1 text-[14px] text-charcoal">
                  {faDateLong(b.date)} · ساعت {faTime(b.start)} · {sp?.name}
                </p>
                <p className="mt-1 text-[12px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
                  {b.id}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[12px] ${active ? "bg-wine text-ivory" : "bg-cream text-muted"}`}
              >
                {statusLabel[b.status]}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted">
              <span>مبلغ: {toman(b.price)}</span>
              <span>پرداخت‌شده: {toman(b.paid)}</span>
              {b.payment && (
                <span className="flex items-center gap-2">
                  <MethodMark method={b.payment.method} size={18} /> {METHODS[b.payment.method].title}
                </span>
              )}
              {b.refunded > 0 && <span>بازپرداخت: {toman(b.refunded)}</span>}
            </div>
            {active && (
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                <a href={`tel:${site.phone}`} className="btn btn-ghost min-h-10 px-4 text-[13px] text-wine">
                  <Phone size={14} /> تغییر زمان (فقط تلفنی)
                </a>
                {confirming === b.id ? (
                  <span className="flex flex-wrap items-center gap-3 text-[13px]">
                    <span className="text-charcoal">
                      {q.eligible
                        ? `بازگشت ${toman(q.refund)} (کسر ${faNum(s.settings.cancellationFeePercent)}٪)`
                        : "کمتر از ۲۴ ساعت مانده؛ مبلغی بازگردانده نمی‌شود."}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        cancelBooking(b.id, true);
                        setConfirming(null);
                      }}
                      className="btn btn-primary min-h-10 px-4 text-[13px]"
                    >
                      تأیید لغو
                    </button>
                    <button type="button" onClick={() => setConfirming(null)} className="text-muted underline">
                      منصرف شدم
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(b.id)}
                    className="min-h-10 px-2 text-[13px] text-muted underline underline-offset-4"
                  >
                    لغو نوبت
                  </button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function PaymentsTab({ list }: { list: Booking[] }) {
  const s = useDemo();
  const paid = list.filter((b) => b.payment);
  if (!paid.length) return <Empty />;
  return (
    <ul className="grid gap-6">
      {paid.map((b) => {
        const svc = s.services.find((x) => x.slug === b.serviceSlug);
        const plan = b.payment!;
        const n = nextDue(plan);
        const live = ACTIVE.has(b.status);
        return (
          <li key={b.id} className="border border-line bg-ivory p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MethodMark method={plan.method} size={36} />
                <div>
                  <p className="text-[16px] text-espresso">
                    {METHODS[plan.method].title} · {svc?.title}
                  </p>
                  <p className="text-[12px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
                    {b.id}
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-muted">
                پرداخت‌شده {toman(b.paid)} از {toman(b.price)}
              </p>
            </div>
            <div className="mt-5">
              <PlanTable plan={plan} onPay={live ? (k) => payInstallment(b.id, k) : undefined} />
            </div>
            {live && n && (
              <p className="mt-3 text-[12px] text-muted">قسط بعدی: {faDateLong(n.due)} · پرداخت نمایشی است.</p>
            )}
            {!live && remainingOf(plan) > 0 && (
              <p className="mt-3 text-[12px] text-muted">این رزرو {statusLabel[b.status]} است؛ اقساط باقی‌مانده لغو شد.</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function SmsTab({ phone }: { phone: string }) {
  const s = useDemo();
  const list = s.sms.filter((m) => m.to === phone).slice().reverse();
  if (!list.length) return <p className="text-charcoal">پیامکی برای این شماره ثبت نشده است.</p>;
  return (
    <ul className="grid max-w-xl gap-3">
      {list.map((m) => (
        <li key={m.id} className="rounded-2xl bg-cream px-4 py-3">
          <p className="mb-1 text-[11px] text-muted">
            {m.status === "scheduled" ? "زمان‌بندی‌شده" : "ارسال‌شده"} · {faDateLong(m.sendAt.slice(0, 10))}
          </p>
          <p className="whitespace-pre-line text-[14px] leading-7 text-espresso">{m.body}</p>
        </li>
      ))}
    </ul>
  );
}

function ProfileTab({ phone, name }: { phone: string; name: string }) {
  const s = useDemo();
  const meta = s.customerMeta[phone];
  const [n, setN] = useState(name);
  const [bday, setBday] = useState(meta?.birthday ?? "");
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="grid max-w-md gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        saveCustomerMeta(phone, { name: n.trim(), birthday: bday || undefined });
        setSaved(true);
      }}
    >
      <div>
        <label htmlFor="p-name" className="t-label">
          نام و نام خانوادگی
        </label>
        <input id="p-name" className="field mt-1" value={n} onChange={(e) => setN(e.target.value)} />
      </div>
      <div>
        <label htmlFor="p-bday" className="t-label">
          تاریخ تولد (برای هدیه تولد)
        </label>
        <input id="p-bday" className="field mt-1" placeholder="مثلاً ۱۳۷۵/۰۶/۱۲" value={bday} onChange={(e) => setBday(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" className="btn btn-primary">
          ذخیره
        </button>
        {saved && (
          <span className="text-[13px] text-muted" aria-live="polite">
            ذخیره شد.
          </span>
        )}
      </div>
    </form>
  );
}
