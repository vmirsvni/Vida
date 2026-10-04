"use client";

import Image from "next/image";
import { CardIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMedia3 } from "@/data/media3";
import { buildPlan, isMethod, METHODS } from "@/lib/booking/payment";
import { completePayment, removeBooking, useDemo, useHydrated } from "@/lib/store/store";
import { durationLabel, faDateLong, faNum, faTime, toman } from "@/lib/format";
import { D3 } from "@/lib/demo";

/**
 * Demo 3 checkout — ⚠️ SIMULATED. Not connected to any bank, SnappPay or DigiPay,
 * and collects no card or account data. Production: redirect to the provider and verify on callback.
 */
export function Checkout3() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const raw = params.get("method");
  const method = isMethod(raw) ? raw : "direct";
  const M = METHODS[method];
  const s = useDemo();
  const hydrated = useHydrated();
  const b = s.bookings.find((x) => x.id === id);
  const svc = s.services.find((x) => x.slug === b?.serviceSlug);
  const sp = s.specialists.find((x) => x.id === b?.specialistId);
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [left, setLeft] = useState(600);

  useEffect(() => {
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!hydrated) return <div className="h-[100svh]" />;
  if (!b || b.status !== "awaiting_payment") {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="text-[22px] font-medium">{b ? "این رزرو قبلاً پرداخت یا بسته شده است." : "رزروی برای پرداخت پیدا نشد."}</p>
        <Link href={b ? `${D3}/booking/success/${b.id}` : `${D3}/booking`} className="btn btn-primary mt-8 px-7">
          {b ? "مشاهده رزرو" : "رزرو نوبت"}
        </Link>
      </div>
    );
  }

  const plan = buildPlan(b.price, method);
  const now = plan.installments[0].amount;
  const bnpl = method !== "direct";
  const img = svc ? getMedia3(svc.image) : null;

  function pay() {
    setPhase("processing");
    window.setTimeout(() => {
      completePayment(b!.id, String(Math.floor(100000000 + Math.random() * 899999999)), method);
      setPhase("done");
      try {
        sessionStorage.removeItem("vida-booking-draft/demo-3");
      } catch {}
      window.setTimeout(() => router.replace(`${D3}/booking/success/${b!.id}`), 900);
    }, 2400);
  }
  function cancel() {
    removeBooking(b!.id);
    router.replace(`${D3}/booking`);
  }

  return (
    <div className="min-h-[100svh] px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-[980px]">
        <header className="mb-6 flex items-center justify-between">
          <Link href={D3} className="flex items-center gap-2">
            <Image src="/brand/vida-logo-256.webp" alt="" width={32} height={32} className="size-8" />
            <span className="nue-latin text-[16px] font-medium" dir="ltr">
              Vida Beauty
            </span>
          </Link>
          <span className="flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1.5 text-[12px] text-charcoal">
            <span className="size-1.5 rounded-full bg-success" /> پرداخت امن · نسخه نمایشی
          </span>
        </header>

        <div className="grid overflow-hidden rounded-[28px] border border-line bg-surface lg:grid-cols-[1fr_1.1fr]">
          {/* order */}
          <section aria-label="سفارش" className="border-b border-line p-6 lg:border-b-0 lg:border-l sm:p-8">
            <p className="text-[15px] font-medium">سفارش شما</p>
            <div className="mt-5 flex items-center gap-4">
              {img && (
                <span className="relative block size-20 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={img.src} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: img.focal }} />
                </span>
              )}
              <div>
                <p className="text-[18px] font-medium">{svc?.title}</p>
                <p className="text-[12px] text-muted">
                  {svc ? durationLabel(svc.durationMin) : ""} · {sp?.name}
                </p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 text-[13px]">
              {[
                ["نوبت", `${faDateLong(b.date)} · ${faTime(b.start)}`],
                ["کد رزرو", b.id],
                ["مشتری", b.customer.name],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd dir={k === "کد رزرو" ? "ltr" : undefined}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 rounded-2xl bg-cream p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-muted">مبلغ کل</span>
                <span className="text-[22px] font-medium">{toman(b.price)}</span>
              </div>
              {bnpl && (
                <ol className="mt-4 space-y-2">
                  {plan.installments.map((i) => (
                    <li key={i.n} className="flex items-center gap-3 text-[12px]">
                      <span className={`flex size-6 items-center justify-center rounded-full text-[11px] ${i.n === 1 ? "bg-espresso text-surface" : "bg-surface text-charcoal ring-1 ring-line-strong"}`}>
                        {faNum(i.n)}
                      </span>
                      <span className="flex-1 text-charcoal">{i.n === 1 ? "امروز" : faDateLong(i.due)}</span>
                      <span className="font-medium">{toman(i.amount)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>

          {/* pay */}
          <section aria-label="پرداخت" className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl text-[18px] font-bold text-surface" style={{ background: method === "direct" ? "var(--color-espresso)" : M.color }}>
                  {method === "direct" ? <CardIcon size={20} /> : method === "snapppay" ? "S" : "D"}
                </span>
                <div>
                  <p className="text-[16px] font-medium">{bnpl ? M.title : "درگاه پرداخت بانکی"}</p>
                  <p className="text-[12px] text-muted">{M.note}</p>
                </div>
              </div>
              <span className="rounded-full bg-cream px-3 py-1 text-[12px] tabular-nums text-accent-deep">
                {faNum(String(Math.floor(left / 60)).padStart(2, "0"))}:{faNum(String(left % 60).padStart(2, "0"))}
              </span>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-dashed border-line-strong p-5">
              <p className="text-[12px] leading-6 text-charcoal">
                {bnpl
                  ? `این صفحه شبیه‌سازی ${M.title} است؛ در نسخه نهایی به حساب ${M.title} خود وارد می‌شوید.`
                  : "در نسخه نهایی به درگاه شاپرکی بانک منتقل می‌شوید."}
              </p>
              <div className="mt-4 space-y-2" aria-hidden>
                {(bnpl ? ["شماره موبایل حساب", "کد تأیید پیامکی"] : ["شماره کارت", "CVV2 و تاریخ انقضا", "رمز دوم پویا"]).map((l) => (
                  <div key={l} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-[12px] text-faint">
                    <span>{l}</span>
                    <span>غیرفعال در دمو</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-[13px] text-muted">{bnpl ? "پرداخت امروز" : "مبلغ قابل پرداخت"}</span>
              <span className="text-[26px] font-medium">{toman(now)}</span>
            </div>
            <button
              type="button"
              onClick={pay}
              disabled={phase !== "idle"}
              className="btn mt-4 w-full text-surface transition-colors"
              style={{ background: phase === "done" ? "var(--color-success)" : bnpl ? M.color : "var(--color-espresso)" }}
            >
              {phase === "idle" && (bnpl ? `پرداخت قسط اول ${toman(now)}` : `پرداخت ${toman(now)}`)}
              {phase === "processing" && (
                <>
                  <span className="size-4 animate-spin rounded-full border border-surface/40 border-t-surface" /> در حال تأیید…
                </>
              )}
              {phase === "done" && "✓ پرداخت موفق"}
            </button>
            <button type="button" onClick={cancel} disabled={phase !== "idle"} className="mt-3 w-full text-[13px] text-muted underline underline-offset-4">
              انصراف و آزاد کردن نوبت
            </button>
            <p className="mt-6 text-center text-[11px] leading-5 text-faint" aria-live="polite">
              {phase === "processing" ? "در حال تأیید پرداخت…" : "پرداخت نمایشی است؛ هیچ اطلاعات کارت یا حسابی دریافت یا ذخیره نمی‌شود."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
