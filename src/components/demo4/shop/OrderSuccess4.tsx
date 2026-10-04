"use client";

import Image from "next/image";
import Link from "next/link";
import { getMedia4 } from "@/data/media4";
import { METHODS } from "@/lib/booking/payment";
import { useDemo, useHydrated } from "@/lib/store/store";
import { faDateLong, faNum, toman } from "@/lib/format";
import { D4 } from "@/lib/demo";
import { DELIVERY4, getProduct4 } from "../products4";
import { ORDER_STATUS4 } from "./orderStatus";

export function OrderSuccess4({ id }: { id: string }) {
  const s = useDemo();
  const hydrated = useHydrated();
  const o = (s.orders ?? []).find((x) => x.id === id);
  if (!hydrated) return <div className="h-[70vh]" />;
  if (!o) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <p className="text-[22px] font-medium">سفارشی با این کد پیدا نشد.</p>
        <Link href={`${D4}/shop`} className="btn btn-primary mt-8 px-7">
          محصولات
        </Link>
      </div>
    );
  }
  const plan = o.payment;
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-8 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="overflow-hidden rounded-[28px] border border-line bg-surface">
          <div className="flex items-center gap-5 bg-cream p-6 sm:p-8">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-espresso text-[22px] text-white">✓</span>
            <div>
              <p className="text-[13px] font-medium text-champagne">{ORDER_STATUS4[o.status]}</p>
              <h1 className="mt-1 text-[clamp(26px,3vw,36px)] font-medium">سفارش شما ثبت شد.</h1>
              <p className="mt-1 text-[13px] text-charcoal">جزئیات به {faNum(o.customer.phone)} پیامک شد.</p>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between rounded-2xl border border-dashed border-line-strong px-5 py-4">
              <span className="text-[12px] text-muted">کد سفارش</span>
              <span className="nuve-latin text-[26px] font-medium tracking-wide" dir="ltr">
                {o.id}
              </span>
            </div>
            <ul className="mt-6 divide-y divide-line">
              {o.items.map((it) => {
                const p = getProduct4(it.id);
                if (!p) return null;
                const m = getMedia4(p.image);
                return (
                  <li key={it.id} className="flex items-center gap-4 py-3">
                    <span className="relative block size-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
                      <Image src={m.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: m.focal }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium">{p.name}</span>
                      <span className="text-[12px] text-muted">
                        {p.brand} · {faNum(it.qty)} عدد
                      </span>
                    </span>
                    <span className="text-[14px]">{toman(it.price * it.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["تحویل", DELIVERY4[o.delivery.method].title],
                ["مبلغ کل", toman(o.total)],
                ["روش پرداخت", plan ? METHODS[plan.method].title : "-"],
                ["پرداخت‌شده", toman(o.paid)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-cream p-4">
                  <dt className="text-[11px] text-muted">{k}</dt>
                  <dd className="mt-1 text-[15px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            {o.delivery.method !== "pickup" && (
              <p className="mt-4 text-[13px] leading-7 text-charcoal">
                ارسال به: {o.delivery.city}، {o.delivery.address}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`${D4}/account`} className="btn btn-primary px-6">
                پنل کاربر
              </Link>
              <Link href={`${D4}/shop`} className="btn btn-ghost px-6 text-espresso">
                ادامه خرید
              </Link>
            </div>
          </div>
        </article>

        <aside className="rounded-[28px] border border-line bg-surface p-6 sm:p-8">
          <p className="text-[16px] font-medium">پرداخت</p>
          {plan && plan.method !== "direct" ? (
            <>
              <p className="mt-2 text-[13px] text-charcoal">
                {METHODS[plan.method].title} · باقی‌مانده {toman(o.total - o.paid)}
              </p>
              <ol className="mt-5 space-y-3">
                {plan.installments.map((i) => (
                  <li key={i.n} className="flex items-center gap-3 text-[13px]">
                    <span className={`flex size-7 items-center justify-center rounded-full text-[12px] ${i.paidAt ? "bg-espresso text-white" : "bg-cream text-charcoal"}`}>{i.paidAt ? "✓" : faNum(i.n)}</span>
                    <span className="flex-1 text-charcoal">{i.paidAt ? "پرداخت شد" : faDateLong(i.due)}</span>
                    <span className="font-medium">{toman(i.amount)}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[12px] leading-6 text-muted">اقساط بعدی را از پنل کاربر، بخش «سفارش‌ها» پرداخت کنید.</p>
            </>
          ) : (
            <p className="mt-2 text-[13px] leading-7 text-charcoal">مبلغ کامل پرداخت شد. کد پیگیری: {o.ref ? faNum(o.ref) : "-"}</p>
          )}
          <p className="mt-8 border-t border-line pt-5 text-[12px] leading-6 text-muted">سفارش نمایشی است و ارسالی انجام نمی‌شود.</p>
        </aside>
      </div>
    </div>
  );
}
