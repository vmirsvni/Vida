"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { completePayment, removeBooking, useDemo, useHydrated } from "@/lib/store/store";
import { faDateLong, faNum, faTime, toman } from "@/lib/format";
import { Lock } from "@/components/ui/Icons";
import { useDemoBase } from "@/lib/useDemoBase";
import { buildPlan, isMethod, METHODS } from "@/lib/booking/payment";
import { MethodMark, PlanTable } from "@/components/booking/PaymentUI";

/**
 * ⚠️ SIMULATED PAYMENT GATEWAY — DEMO ONLY.
 * Not connected to any bank or Shaparak gateway and collects no card data.
 * Production: replace `pay()` with a redirect to the real IPG and verify on callback.
 */
export function MockGateway() {
  const base = useDemoBase();
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const rawMethod = params.get("method");
  const method = isMethod(rawMethod) ? rawMethod : "direct";
  const M = METHODS[method];
  const s = useDemo();
  const hydrated = useHydrated();
  const b = s.bookings.find((x) => x.id === id);
  const svc = s.services.find((x) => x.slug === b?.serviceSlug);
  const [phase, setPhase] = useState<"idle" | "processing">("idle");
  const [left, setLeft] = useState(600);

  useEffect(() => {
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!hydrated) return <div className="h-[80vh]" />;

  if (!b || b.status !== "awaiting_payment") {
    return (
      <div className="wrap py-32 text-center">
        <p className="t-h3 text-wine">{b ? "این رزرو قبلاً پرداخت یا بسته شده است." : "رزروی برای پرداخت پیدا نشد."}</p>
        <Link href={b ? `${base}/booking/success/${b.id}` : `${base}/booking`} className="btn btn-primary mt-8">
          {b ? "مشاهده رزرو" : "رزرو نوبت"}
        </Link>
      </div>
    );
  }

  function pay() {
    setPhase("processing");
    setTimeout(() => {
      const ref = String(Math.floor(100000000 + Math.random() * 899999999));
      completePayment(b!.id, ref, method);
      try {
        sessionStorage.removeItem(`vida-booking-draft${base}`);
      } catch {}
      router.replace(`${base}/booking/success/${b!.id}`);
    }, 2200);
  }

  function cancel() {
    removeBooking(b!.id); // release the held slot
    router.replace(`${base}/booking?step=5`);
  }

  const plan = buildPlan(b.price, method);
  const now = plan.installments[0].amount;
  const bnpl = method !== "direct";
  const mm = faNum(String(Math.floor(left / 60)).padStart(2, "0"));
  const ss = faNum(String(left % 60).padStart(2, "0"));

  return (
    <div className="min-h-[100svh] bg-[#f1ede7] px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-between text-[12px] text-muted">
          <span className="flex items-center gap-2">
            <Lock size={14} /> {bnpl ? `${M.title} — نسخه آزمایشی` : "درگاه پرداخت آزمایشی"}
          </span>
          <span className="bg-wine px-2 py-0.5 text-[11px] tracking-widest text-ivory">DEMO</span>
        </div>

        <div className="overflow-hidden border border-line bg-white">
          {bnpl && (
            <div className="flex items-center gap-3 px-5 py-4 text-white" style={{ background: M.color }}>
              <MethodMark method={method} size={36} />
              <div>
                <p className="text-[17px] font-bold">{M.title}</p>
                <p className="text-[12px] opacity-90">خرید اقساطی · {faNum(M.count)} قسط ماهانه</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 border-b border-line p-5">
            <Image src="/brand/vida-logo-256.webp" alt="" width={48} height={48} className="size-12" />
            <div className="flex-1">
              <p className="text-[13px] text-muted">پذیرنده</p>
              <p className="text-[16px]">Vida Beauty</p>
            </div>
            <div className="text-left">
              <p className="text-[12px] text-muted">زمان باقی‌مانده</p>
              <p className="text-[16px] tabular-nums">
                {mm}:{ss}
              </p>
            </div>
          </div>

          <div className="space-y-3 p-5 text-[14px]">
            <div className="flex justify-between">
              <span className="text-muted">شرح</span>
              <span>{svc?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">نوبت</span>
              <span>
                {faDateLong(b.date)} · {faTime(b.start)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">شماره رزرو</span>
              <span dir="ltr">{b.id}</span>
            </div>
            {bnpl && (
              <div className="flex justify-between">
                <span className="text-muted">مبلغ کل</span>
                <span>{toman(b.price)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-muted">{bnpl ? "پرداخت امروز (قسط اول)" : "مبلغ قابل پرداخت"}</span>
              <span className="text-[24px] text-wine">{toman(now)}</span>
            </div>
            {bnpl && (
              <div className="pt-2">
                <p className="mb-2 text-[13px] text-muted">برنامه اقساط</p>
                <PlanTable plan={plan} />
              </div>
            )}
          </div>

          <div className="border-t border-line bg-[#faf8f5] p-5">
            <p className="text-[13px] leading-7 text-charcoal">
              {bnpl
                ? `این صفحه شبیه‌سازی ${M.title} است و به سرویس واقعی متصل نیست. هیچ اطلاعات حساب یا کارتی دریافت نمی‌شود.`
                : "این یک درگاه نمایشی است و به هیچ بانک یا درگاه واقعی متصل نیست. هیچ اطلاعات کارتی دریافت یا ذخیره نمی‌شود."}
            </p>
            <div className="mt-4 space-y-3" aria-hidden>
              {(bnpl ? ["شماره موبایل حساب", "کد تأیید پیامکی"] : ["شماره کارت", "CVV2", "تاریخ انقضا", "رمز دوم"]).map((l) => (
                <div
                  key={l}
                  className="flex items-center justify-between border border-dashed border-line px-3 py-3 text-[13px] text-muted/80"
                >
                  <span>{l}</span>
                  <span>غیرفعال در دمو</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 p-5">
            <button
              type="button"
              onClick={pay}
              disabled={phase === "processing"}
              className="btn btn-primary"
              style={bnpl ? { background: M.color, borderColor: M.color } : undefined}
            >
              {phase === "processing" ? (
                <>
                  <span className="size-4 animate-spin rounded-full border border-ivory/40 border-t-ivory" /> در حال پردازش…
                </>
              ) : (
                <>{bnpl ? `پرداخت قسط اول ${toman(now)}` : `پرداخت آزمایشی ${toman(now)}`}</>
              )}
            </button>
            <button type="button" onClick={cancel} disabled={phase === "processing"} className="btn btn-ghost px-5 text-charcoal">
              انصراف
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-[12px] text-muted" aria-live="polite">
          {phase === "processing" ? "در حال تأیید پرداخت…" : bnpl ? `نسخه نهایی به سرویس ${M.title} متصل می‌شود.` : "نسخه نهایی به درگاه پرداخت بانکی متصل می‌شود."}
        </p>
      </div>
    </div>
  );
}
