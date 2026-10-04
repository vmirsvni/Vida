"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { getMedia3 } from "@/data/media3";
import { site } from "@/data/site";
import type { Booking } from "@/data/types";
import { METHODS, nextDue, remainingOf } from "@/lib/booking/payment";
import { refundQuote, statusLabel } from "@/lib/booking/policy";
import { cancelBooking, payInstallment, saveCustomerMeta, signIn, signOut, useDemo, useHydrated } from "@/lib/store/store";
import { appointmentDate, faDateLong, faNum, faTime, isValidMobile, normalizeDigits, toman } from "@/lib/format";
import { D3 } from "@/lib/demo";

/* Demo 3 user panel — own design (OTP digit boxes, next-appointment card,
   segmented tabs, installment rings, cancel sheet). Mock sign-in. */

const ACTIVE = new Set(["confirmed", "paid", "pending", "awaiting_payment"]);
const makeCode = () => String(Math.floor(10000 + Math.random() * 89999));

export function Account3() {
  const s = useDemo();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-[70vh]" />;
  return s.account?.phone ? <Dash phone={s.account.phone} /> : <SignIn />;
}

function SignIn() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [err, setErr] = useState<string | null>(null);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const clean = normalizeDigits(phone).replace(/\D/g, "");
  const hero = getMedia3("book");

  const cur = useRef(["", "", "", "", ""]); // latest digits, safe across fast keystrokes
  function setDigit(i: number, v: string) {
    const typed = normalizeDigits(v).replace(/\D/g, "");
    const next = [...cur.current];
    const prev = next[i];
    // a key typed into an already-filled box belongs to the following box(es)
    let add = typed;
    let start = i;
    if (prev && typed.length > prev.length && typed.startsWith(prev)) {
      add = typed.slice(prev.length);
      start = i + 1;
    }
    if (!add) next[i] = "";
    else add.slice(0, Math.max(0, 5 - start)).split("").forEach((c, k) => (next[start + k] = c)); // also handles paste
    cur.current = next;
    setDigits(next);
    if (add) boxes.current[Math.min(4, start + add.length)]?.focus();
    if (next.every(Boolean)) {
      if (next.join("") === code) signIn(clean);
      else setErr("کد واردشده درست نیست.");
    }
  }

  return (
    <div className="mx-auto grid max-w-[1100px] items-stretch gap-6 px-4 py-10 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-[28px] lg:block">
        <Image src={hero.src} alt="" fill sizes="45vw" className="object-cover" style={{ objectPosition: hero.focal }} placeholder={hero.blur ? "blur" : "empty"} blurDataURL={hero.blur} />
      </div>
      <div className="flex flex-col justify-center rounded-[28px] border border-line bg-surface p-6 sm:p-10">
        <h1 className="text-[clamp(28px,3.4vw,40px)] font-medium tracking-[-0.02em]">ورود به پنل کاربر</h1>
        <p className="mt-2 text-[14px] leading-7 text-charcoal">نوبت‌ها، اقساط و پیامک‌های شما در یک‌جا.</p>
        {!code ? (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isValidMobile(clean)) return setErr("شماره موبایل معتبر نیست.");
              setErr(null);
              setCode(makeCode());
              window.setTimeout(() => boxes.current[0]?.focus(), 50);
            }}
          >
            <label htmlFor="a4-phone" className="text-[13px] text-charcoal">
              شماره موبایلی که با آن رزرو کرده‌اید
            </label>
            <input
              id="a4-phone"
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09xx xxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-line-strong bg-cream px-4 py-4 text-left text-[18px] tracking-wider outline-none focus:border-champagne focus:bg-surface"
            />
            {err && <p className="mt-2 text-[12px] text-danger">{err}</p>}
            <button type="submit" className="btn btn-primary mt-6 w-full">
              ارسال کد ورود
            </button>
          </form>
        ) : (
          <div className="mt-8">
            <div className="bg-cream rounded-2xl px-4 py-3 text-[13px]" role="status">
              <span className="text-muted">پیامک آزمایشی:</span> کد ورود Vida <b className="tracking-[0.3em]">{faNum(code)}</b>
            </div>
            <p className="mt-6 text-[13px] text-charcoal">کد ۵ رقمی ارسال‌شده به {faNum(clean)}</p>
            <div className="mt-3 flex justify-between gap-2" dir="ltr">
              {digits.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    boxes.current[i] = el;
                  }}
                  aria-label={`رقم ${faNum(i + 1)}`}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  value={v}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !v && i > 0) boxes.current[i - 1]?.focus();
                  }}
                  className={`size-14 rounded-2xl border text-center text-[22px] outline-none transition-colors sm:size-16 ${v ? "border-espresso bg-surface" : "border-line-strong bg-cream"} focus:border-champagne`}
                />
              ))}
            </div>
            {err && <p className="mt-2 text-[12px] text-danger">{err}</p>}
            <button
              type="button"
              onClick={() => {
                setCode(null);
                cur.current = ["", "", "", "", ""];
                setDigits(["", "", "", "", ""]);
                setErr(null);
              }}
              className="mt-6 text-[13px] text-muted underline underline-offset-4"
            >
              تغییر شماره
            </button>
          </div>
        )}
        <p className="mt-8 text-[11px] text-faint">ورود نمایشی؛ در نسخه نهایی کد واقعاً پیامک می‌شود.</p>
      </div>
    </div>
  );
}

const TABS = [
  ["bookings", "نوبت‌ها"],
  ["payments", "اقساط"],
  ["sms", "پیامک‌ها"],
  ["profile", "پروفایل"],
] as const;
type Tab = (typeof TABS)[number][0];

function Dash({ phone }: { phone: string }) {
  const s = useDemo();
  const [tab, setTab] = useState<Tab>("bookings");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const mine = useMemo(() => s.bookings.filter((b) => b.customer.phone === phone).sort((a, b) => (a.date + a.start < b.date + b.start ? 1 : -1)), [s.bookings, phone]);
  const name = s.customerMeta[phone]?.name ?? mine[0]?.customer.name ?? "";
  const upcoming = mine.filter((b) => ACTIVE.has(b.status) && appointmentDate(b.date, b.start) > new Date()).sort((a, b) => (a.date + a.start > b.date + b.start ? 1 : -1));
  const next = upcoming[0];
  const due = mine.reduce((t, b) => t + (b.payment && ACTIVE.has(b.status) ? remainingOf(b.payment) : 0), 0);
  const svcOf = (b: Booking) => s.services.find((x) => x.slug === b.serviceSlug);
  const target = mine.find((b) => b.id === cancelId);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-8 lg:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(26px,3.2vw,38px)] font-medium tracking-[-0.02em]">{name ? `سلام ${name}` : "سلام"}</h1>
          <p className="mt-1 text-[13px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
            {faNum(phone)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`${D3}/booking`} className="btn btn-primary px-6">
            رزرو جدید
          </Link>
          <button type="button" onClick={signOut} className="btn btn-ghost px-5 text-espresso">
            خروج
          </button>
        </div>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="bg-cream relative overflow-hidden rounded-[28px] p-6 lg:col-span-2">
          {next ? (
            <NextCard b={next} title={svcOf(next)?.title ?? ""} img={svcOf(next)?.image} />
          ) : (
            <div>
              <p className="text-[13px] text-charcoal">نوبت پیش‌رویی ندارید.</p>
              <Link href={`${D3}/booking`} className="btn btn-primary mt-4 px-6">
                رزرو نوبت
              </Link>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <div className="rounded-[28px] border border-line bg-surface p-5">
            <p className="text-[12px] text-muted">کل رزروها</p>
            <p className="mt-1 text-[28px] font-medium">{faNum(mine.length)}</p>
          </div>
          <div className="rounded-[28px] border border-line bg-surface p-5">
            <p className="text-[12px] text-muted">اقساط باقی‌مانده</p>
            <p className="mt-1 text-[22px] font-medium">{due ? toman(due) : "-"}</p>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="بخش‌های پنل" className="mt-8 flex max-w-full overflow-x-auto rounded-full bg-cream p-1 sm:inline-flex">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-[13px] transition-colors sm:px-6 ${tab === k ? "bg-surface text-espresso shadow-sm" : "text-muted"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-6">
        {tab === "bookings" &&
          (mine.length ? (
            <ul className="grid gap-3 md:grid-cols-2">
              {mine.map((b) => {
                const svc = svcOf(b);
                const m = svc ? getMedia3(svc.image) : null;
                const live = ACTIVE.has(b.status);
                return (
                  <li key={b.id} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                    {m && (
                      <span className="relative block size-20 shrink-0 overflow-hidden rounded-2xl">
                        <Image src={m.src} alt="" fill sizes="80px" className={`object-cover ${live ? "" : "grayscale"}`} style={{ objectPosition: m.focal }} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[15px] font-medium">{svc?.title}</p>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] ${live ? "bg-tint text-accent-deep" : "bg-cream text-muted"}`}>{statusLabel[b.status]}</span>
                      </div>
                      <p className="mt-1 text-[12px] text-charcoal">
                        {faDateLong(b.date)} · {faTime(b.start)}
                      </p>
                      <p className="text-[11px] text-faint" dir="ltr" style={{ textAlign: "right" }}>
                        {b.id}
                      </p>
                      {live && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={`tel:${site.phone}`} className="rounded-full border border-line px-3 py-1.5 text-[12px]">
                            تغییر زمان (تلفنی)
                          </a>
                          <button type="button" onClick={() => setCancelId(b.id)} className="rounded-full px-3 py-1.5 text-[12px] text-danger hover:bg-danger-soft">
                            لغو نوبت
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty />
          ))}

        {tab === "payments" &&
          (mine.some((b) => b.payment) ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {mine
                .filter((b) => b.payment)
                .map((b) => {
                  const p = b.payment!;
                  const ratio = b.price ? b.paid / b.price : 0;
                  const n = nextDue(p);
                  const live = ACTIVE.has(b.status);
                  return (
                    <li key={b.id} className="rounded-2xl border border-line bg-surface p-5">
                      <div className="flex items-center gap-4">
                        <Ring ratio={ratio} />
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium">{svcOf(b)?.title}</p>
                          <p className="text-[12px] text-muted">
                            {METHODS[p.method].title} · {toman(b.paid)} از {toman(b.price)}
                          </p>
                        </div>
                      </div>
                      <ol className="mt-5 space-y-2">
                        {p.installments.map((i) => (
                          <li key={i.n} className="flex items-center gap-3 text-[12px]">
                            <span className={`flex size-6 items-center justify-center rounded-full text-[11px] ${i.paidAt ? "bg-espresso text-surface" : "bg-cream text-charcoal"}`}>{i.paidAt ? "✓" : faNum(i.n)}</span>
                            <span className="flex-1 text-charcoal">{faDateLong(i.due)}</span>
                            <span className="font-medium">{toman(i.amount)}</span>
                          </li>
                        ))}
                      </ol>
                      {live && n && (
                        <button type="button" onClick={() => payInstallment(b.id, n.n)} className="btn btn-primary mt-5 w-full">
                          پرداخت قسط {faNum(n.n)} · {toman(n.amount)}
                        </button>
                      )}
                      {!live && remainingOf(p) > 0 && <p className="mt-4 text-[12px] text-muted">این رزرو {statusLabel[b.status]} است؛ اقساط باقی‌مانده لغو شد.</p>}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <Empty />
          ))}

        {tab === "sms" && (
          <ul className="grid max-w-xl gap-3">
            {s.sms
              .filter((m) => m.to === phone)
              .slice()
              .reverse()
              .map((m) => (
                <li key={m.id} className="flex items-end gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint text-[11px] text-accent-deep">VB</span>
                  <p className="whitespace-pre-line rounded-2xl rounded-br-md bg-cream px-4 py-3 text-[13px] leading-6">{m.body}</p>
                </li>
              ))}
            {!s.sms.some((m) => m.to === phone) && <p className="text-[13px] text-muted">پیامکی ثبت نشده است.</p>}
          </ul>
        )}

        {tab === "profile" && <Profile phone={phone} name={name} />}
      </div>

      {target && <CancelSheet b={target} title={svcOf(target)?.title ?? ""} onClose={() => setCancelId(null)} />}
      <p className="mt-14 text-center text-[11px] text-faint">پنل کاربر نمایشی است؛ داده‌ها فقط در همین مرورگر ذخیره می‌شوند.</p>
    </div>
  );
}

function NextCard({ b, title, img }: { b: Booking; title: string; img?: string }) {
  const ms = appointmentDate(b.date, b.start).getTime() - new Date().getTime();
  const days = Math.max(0, Math.floor(ms / 864e5));
  const hours = Math.max(0, Math.floor((ms % 864e5) / 36e5));
  const m = img ? getMedia3(img) : null;
  return (
    <div className="flex items-center gap-5">
      {m && (
        <span className="relative hidden size-28 shrink-0 overflow-hidden rounded-2xl sm:block">
          <Image src={m.src} alt="" fill sizes="112px" className="object-cover" style={{ objectPosition: m.focal }} />
        </span>
      )}
      <div className="flex-1">
        <p className="text-[12px] text-champagne">نوبت بعدی شما</p>
        <p className="mt-1 text-[22px] font-medium">{title}</p>
        <p className="mt-1 text-[13px] text-charcoal">
          {faDateLong(b.date)} · ساعت {faTime(b.start)}
        </p>
      </div>
      <div className="flex gap-2 text-center">
        {[
          [days, "روز"],
          [hours, "ساعت"],
        ].map(([v, l]) => (
          <span key={l as string} className="border border-line bg-surface flex w-16 flex-col rounded-2xl py-2">
            <span className="text-[22px] font-medium">{faNum(v as number)}</span>
            <span className="text-[10px] text-charcoal">{l as string}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Ring({ ratio }: { ratio: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative flex size-14 shrink-0 items-center justify-center">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90" aria-hidden>
        <circle cx="28" cy="28" r={r} stroke="var(--color-cream)" strokeWidth="5" fill="none" />
        <circle cx="28" cy="28" r={r} stroke="var(--color-champagne)" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ratio)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <span className="absolute text-[11px] font-medium">{faNum(Math.round(ratio * 100))}٪</span>
    </span>
  );
}

function CancelSheet({ b, title, onClose }: { b: Booking; title: string; onClose: () => void }) {
  const s = useDemo();
  const q = refundQuote(b, s.settings);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/30 sm:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="لغو نوبت" className="w-full max-w-md rounded-t-[28px] bg-surface p-6 sm:rounded-[28px]" onClick={(e) => e.stopPropagation()}>
        <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-line-strong sm:hidden" />
        <p className="text-[18px] font-medium">لغو «{title}»؟</p>
        <p className="mt-1 text-[13px] text-charcoal">
          {faDateLong(b.date)} · {faTime(b.start)}
        </p>
        <div className={`mt-5 rounded-2xl p-4 text-[13px] leading-7 ${q.eligible ? "bg-success-soft" : "bg-danger-soft"}`}>
          {q.eligible ? (
            <>
              بیش از ۲۴ ساعت مانده است: {faNum(s.settings.cancellationFeePercent)}٪ کسر می‌شود و <b>{toman(q.refund)}</b> بازگردانده می‌شود.
            </>
          ) : (
            <>کمتر از ۲۴ ساعت مانده است؛ مبلغی بازگردانده نمی‌شود.</>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="btn btn-ghost text-espresso">
            منصرف شدم
          </button>
          <button
            type="button"
            onClick={() => {
              cancelBooking(b.id, true);
              onClose();
            }}
            className="btn bg-danger text-surface hover:bg-danger"
          >
            تأیید لغو
          </button>
        </div>
      </div>
    </div>
  );
}

function Profile({ phone, name }: { phone: string; name: string }) {
  const s = useDemo();
  const [n, setN] = useState(name);
  const [bday, setBday] = useState(s.customerMeta[phone]?.birthday ?? "");
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="grid max-w-md gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        saveCustomerMeta(phone, { name: n.trim(), birthday: bday || undefined });
        setSaved(true);
      }}
    >
      {[
        ["نام و نام خانوادگی", n, setN],
        ["تاریخ تولد (برای هدیه تولد)", bday, setBday],
      ].map(([l, v, set]) => (
        <label key={l as string} className="block">
          <span className="text-[12px] text-muted">{l as string}</span>
          <input
            value={v as string}
            onChange={(e) => (set as (x: string) => void)(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-line-strong bg-cream px-4 py-3.5 text-[15px] outline-none focus:border-champagne focus:bg-surface"
          />
        </label>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary px-7">
          ذخیره
        </button>
        {saved && <span className="text-[12px] text-muted">ذخیره شد.</span>}
      </div>
    </form>
  );
}

function Empty() {
  return (
    <div className="rounded-[28px] border border-dashed border-line-strong px-6 py-14 text-center">
      <p className="text-[14px] text-charcoal">هنوز رزروی با این شماره ثبت نشده است.</p>
      <Link href={`${D3}/booking`} className="btn btn-primary mt-5 px-7">
        رزرو نوبت
      </Link>
    </div>
  );
}
