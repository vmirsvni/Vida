"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMedia4 } from "@/data/media4";
import { CardIcon } from "@/components/ui/Icons";
import { buildPlan, isMethod, METHODS } from "@/lib/booking/payment";
import { completeOrderPayment, removeOrder, useDemo, useHydrated } from "@/lib/store/store";
import { faDateLong, faNum, toman } from "@/lib/format";
import { D4 } from "@/lib/demo";
import { getProduct4 } from "../products4";

/**
 * Demo 4 shop gateway — ⚠️ SIMULATED. Not connected to any bank, SnappPay or DigiPay,
 * and collects no card or account data. Same layout language as the booking gateway.
 */
export function ShopPay4() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const raw = params.get("method");
  const method = isMethod(raw) ? raw : "direct";
  const M = METHODS[method];
  const s = useDemo();
  const hydrated = useHydrated();
  const o = (s.orders ?? []).find((x) => x.id === id);
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [left, setLeft] = useState(600);

  useEffect(() => {
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!hydrated) return <div className="h-[100svh]" />;
  if (!o || o.status !== "awaiting_payment") {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center bg-cream px-6 text-center">
        <p className="text-[22px] font-medium">{o ? "این سفارش قبلاً پرداخت شده است." : "سفارشی برای پرداخت پیدا نشد."}</p>
        <Link href={o ? `${D4}/shop/success/${o.id}` : `${D4}/cart`} className="btn btn-primary mt-8 px-7">
          {o ? "مشاهده سفارش" : "سبد خرید"}
        </Link>
      </div>
    );
  }

  const plan = buildPlan(o.total, method);
  const now = plan.installments[0].amount;
  const bnpl = method !== "direct";

  function pay() {
    setPhase("processing");
    window.setTimeout(() => {
      completeOrderPayment(o!.id, String(Math.floor(100000000 + Math.random() * 899999999)), method);
      setPhase("done");
      window.setTimeout(() => router.replace(`${D4}/shop/success/${o!.id}`), 900);
    }, 2200);
  }
  function cancel() {
    removeOrder(o!.id);
    router.replace(`${D4}/checkout`);
  }

  return (
    <div className="min-h-[100svh] bg-cream px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-[980px]">
        <header className="mb-6 flex items-center justify-between">
          <Link href={D4} className="flex items-center gap-2">
            <Image src="/brand/vida-logo-256.webp" alt="" width={32} height={32} className="size-8" />
            <span className="nuve-latin text-[16px] font-medium" dir="ltr">
              Vida Beauty
            </span>
          </Link>
          <span className="rounded-full bg-surface px-3 py-1.5 text-[12px] text-charcoal">پرداخت امن · نسخه نمایشی</span>
        </header>

        <div className="grid overflow-hidden rounded-[28px] border border-line bg-surface lg:grid-cols-[1fr_1.1fr]">
          <section aria-label="سفارش" className="border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-l">
            <p className="text-[15px] font-medium">سفارش {o.id}</p>
            <ul className="mt-5 space-y-3">
              {o.items.map((it) => {
                const p = getProduct4(it.id);
                if (!p) return null;
                const m = getMedia4(p.image);
                return (
                  <li key={it.id} className="flex items-center gap-3 text-[13px]">
                    <span className="relative block size-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                      <Image src={m.src} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: m.focal }} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {p.name} <span className="text-muted">× {faNum(it.qty)}</span>
                    </span>
                    <span>{toman(it.price * it.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 rounded-2xl bg-cream p-4">
              <div className="flex items-baseline justify-between text-[13px]">
                <span className="text-muted">ارسال</span>
                <span>{o.shipping ? toman(o.shipping) : "رایگان"}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[13px] text-muted">مبلغ کل</span>
                <span className="text-[22px] font-medium">{toman(o.total)}</span>
              </div>
              {bnpl && (
                <ol className="mt-4 space-y-2">
                  {plan.installments.map((i) => (
                    <li key={i.n} className="flex items-center gap-3 text-[12px]">
                      <span className={`flex size-6 items-center justify-center rounded-full text-[11px] ${i.n === 1 ? "bg-espresso text-white" : "bg-surface text-charcoal ring-1 ring-line"}`}>{faNum(i.n)}</span>
                      <span className="flex-1 text-charcoal">{i.n === 1 ? "امروز" : faDateLong(i.due)}</span>
                      <span className="font-medium">{toman(i.amount)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>

          <section aria-label="پرداخت" className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl text-[18px] font-bold text-white" style={{ background: bnpl ? M.color : "var(--color-espresso)" }}>
                  {bnpl ? (method === "snapppay" ? "S" : "D") : <CardIcon size={20} />}
                </span>
                <div>
                  <p className="text-[16px] font-medium">{bnpl ? M.title : "درگاه پرداخت بانکی"}</p>
                  <p className="text-[12px] text-muted">{M.note}</p>
                </div>
              </div>
              <span className="rounded-full bg-cream px-3 py-1 text-[12px] text-accent-deep">
                {faNum(String(Math.floor(left / 60)).padStart(2, "0"))}:{faNum(String(left % 60).padStart(2, "0"))}
              </span>
            </div>
            <div className="mt-6 space-y-2 rounded-2xl border border-dashed border-line-strong p-5" aria-hidden>
              {(bnpl ? ["شماره موبایل حساب", "کد تأیید پیامکی"] : ["شماره کارت", "CVV2 و تاریخ انقضا", "رمز دوم پویا"]).map((l) => (
                <div key={l} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-[12px] text-faint">
                  <span>{l}</span>
                  <span>غیرفعال در دمو</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-[13px] text-muted">{bnpl ? "پرداخت امروز" : "مبلغ قابل پرداخت"}</span>
              <span className="text-[26px] font-medium">{toman(now)}</span>
            </div>
            <button
              type="button"
              onClick={pay}
              disabled={phase !== "idle"}
              className="btn mt-4 w-full whitespace-nowrap text-white transition-colors"
              style={{ background: phase === "done" ? "var(--color-success)" : bnpl ? M.color : "var(--color-espresso)" }}
            >
              {phase === "idle" && (bnpl ? `پرداخت قسط اول ${toman(now)}` : `پرداخت ${toman(now)}`)}
              {phase === "processing" && (
                <>
                  <span className="size-4 animate-spin rounded-full border border-white/40 border-t-white" /> در حال تأیید…
                </>
              )}
              {phase === "done" && "✓ پرداخت موفق"}
            </button>
            <button type="button" onClick={cancel} disabled={phase !== "idle"} className="mt-3 w-full text-[13px] text-muted underline underline-offset-4">
              انصراف و بازگشت
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
