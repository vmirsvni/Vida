"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMedia4 } from "@/data/media4";
import { CardIcon } from "@/components/ui/Icons";
import { buildPlan, METHODS, type PaymentMethod } from "@/lib/booking/payment";
import { createOrder, useDemo, useHydrated, type ShopDelivery } from "@/lib/store/store";
import { D4 } from "@/lib/demo";
import { faNum, isValidMobile, normalizeDigits, toman } from "@/lib/format";
import { cartLines, DELIVERY4, shippingFee } from "../products4";

const field = "mt-1.5 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] outline-none transition-colors focus:border-espresso";

export function ShopCheckout4() {
  const s = useDemo();
  const hydrated = useHydrated();
  const router = useRouter();
  const phone0 = s.account?.phone ?? "";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<ShopDelivery>("courier");
  const [city, setCity] = useState("سبزوار");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("direct");
  const [err, setErr] = useState<string | null>(null);

  if (!hydrated) return <div className="h-[70vh]" />;
  const lines = cartLines(s.cart);
  if (!lines.length) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-24 text-center lg:px-8">
        <h1 className="text-[clamp(28px,3.4vw,40px)] font-medium">سبد خرید خالی است.</h1>
        <Link href={`${D4}/shop`} className="btn btn-primary mt-8 px-7">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const nameV = name || s.customerMeta[phone0]?.name || "";
  const phoneV = phone || phone0;
  const subtotal = lines.reduce((t, l) => t + l.total, 0);
  const ship = shippingFee(delivery, subtotal);
  const total = subtotal + ship;
  const plan = buildPlan(total, method);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const ph = normalizeDigits(phoneV).replace(/\D/g, "");
    if (nameV.trim().length < 3) return setErr("نام و نام خانوادگی را کامل بنویسید.");
    if (!isValidMobile(ph)) return setErr("شماره موبایل درست نیست؛ مثلاً ۰۹۱۲۳۴۵۶۷۸۹.");
    if (delivery !== "pickup" && address.trim().length < 8) return setErr("نشانی را کامل بنویسید.");
    if (delivery === "post" && normalizeDigits(postal).replace(/\D/g, "").length !== 10) return setErr("کد پستی ده‌رقمی را وارد کنید.");
    setErr(null);
    const o = createOrder({
      items: lines.map((l) => ({ id: l.product.id, qty: l.qty, price: l.product.price })),
      subtotal,
      shipping: ship,
      total,
      customer: { name: nameV.trim(), phone: ph },
      delivery: { method: delivery, city: delivery === "pickup" ? "سبزوار" : city.trim(), address: delivery === "pickup" ? "" : address.trim(), postal: normalizeDigits(postal) },
    });
    router.push(`${D4}/shop/pay?id=${o.id}&method=${method}`);
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-[1320px] px-4 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-12">
      <h1 className="text-[clamp(32px,4vw,52px)] font-medium">ثبت سفارش</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-10 lg:col-span-7">
          <fieldset>
            <legend className="text-[20px] font-medium">اطلاعات گیرنده</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-charcoal">
                نام و نام خانوادگی
                <input className={field} value={nameV} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
              </label>
              <label className="block text-[13px] text-charcoal">
                شماره موبایل
                <input className={field} value={phoneV} onChange={(e) => setPhone(e.target.value)} inputMode="tel" dir="ltr" placeholder="09xx xxx xxxx" autoComplete="tel" required />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[20px] font-medium">روش تحویل</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(Object.keys(DELIVERY4) as ShopDelivery[]).map((k) => {
                const on = delivery === k;
                const fee = shippingFee(k, subtotal);
                return (
                  <label key={k} className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors ${on ? "border-espresso ring-1 ring-espresso" : "border-line hover:border-line-strong"}`}>
                    <input type="radio" name="delivery" value={k} checked={on} onChange={() => setDelivery(k)} className="sr-only" />
                    <span className="text-[14px] font-medium">{DELIVERY4[k].title}</span>
                    <span className="mt-1 text-[12px] leading-5 text-muted">{DELIVERY4[k].note}</span>
                    <span className="mt-3 text-[13px]">{fee ? toman(fee) : "رایگان"}</span>
                  </label>
                );
              })}
            </div>
            {delivery !== "pickup" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-6">
                <label className="block text-[13px] text-charcoal sm:col-span-2">
                  شهر
                  <input className={field} value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
                </label>
                <label className="block text-[13px] text-charcoal sm:col-span-4">
                  کد پستی {delivery === "courier" && <span className="text-muted">(اختیاری)</span>}
                  <input className={field} value={postal} onChange={(e) => setPostal(e.target.value)} inputMode="numeric" dir="ltr" autoComplete="postal-code" />
                </label>
                <label className="block text-[13px] text-charcoal sm:col-span-6">
                  نشانی کامل
                  <textarea className={`${field} h-24 py-3`} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
                </label>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="text-[20px] font-medium">روش پرداخت</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(Object.keys(METHODS) as PaymentMethod[]).map((k) => {
                const on = method === k;
                const first = buildPlan(total, k).installments[0].amount;
                return (
                  <label key={k} className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors ${on ? "border-espresso ring-1 ring-espresso" : "border-line hover:border-line-strong"}`}>
                    <input type="radio" name="method" value={k} checked={on} onChange={() => setMethod(k)} className="sr-only" />
                    <span className="flex size-9 items-center justify-center rounded-xl text-[14px] font-bold text-white" style={{ background: k === "direct" ? "var(--color-espresso)" : METHODS[k].color }}>
                      {k === "direct" ? <CardIcon size={18} /> : k === "snapppay" ? "S" : "D"}
                    </span>
                    <span className="mt-3 text-[14px] font-medium">{METHODS[k].title}</span>
                    <span className="mt-1 text-[11px] leading-5 text-muted">{METHODS[k].note}</span>
                    <span className="mt-3 text-[13px]">{k === "direct" ? toman(total) : `امروز ${toman(first)}`}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-[28px] bg-cream p-6 lg:sticky lg:top-6">
            <p className="text-[16px] font-medium">خلاصه سفارش</p>
            <ul className="mt-4 space-y-3">
              {lines.map(({ product: p, qty, total: t }) => {
                const m = getMedia4(p.image);
                return (
                  <li key={p.id} className="flex items-center gap-3 text-[13px]">
                    <span className="relative block size-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                      <Image src={m.src} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: m.focal }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{p.name}</span>
                      <span className="text-[12px] text-muted">{faNum(qty)} عدد</span>
                    </span>
                    <span>{toman(t)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-charcoal">جمع کالاها</dt>
                <dd>{toman(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal">ارسال</dt>
                <dd>{ship ? toman(ship) : "رایگان"}</dd>
              </div>
              <div className="flex justify-between pt-2 text-[17px] font-medium">
                <dt>مبلغ کل</dt>
                <dd>{toman(total)}</dd>
              </div>
            </dl>
            {method !== "direct" && (
              <ol className="mt-4 space-y-1.5 text-[12px] text-charcoal">
                {plan.installments.map((i) => (
                  <li key={i.n} className="flex justify-between">
                    <span>قسط {faNum(i.n)}{i.n === 1 ? " · امروز" : ""}</span>
                    <span>{toman(i.amount)}</span>
                  </li>
                ))}
              </ol>
            )}
            {err && (
              <p role="alert" className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-[13px] text-danger">
                {err}
              </p>
            )}
            <button type="submit" className="btn btn-primary mt-6 w-full whitespace-nowrap">
              {method === "direct" ? `پرداخت ${toman(total)}` : `پرداخت قسط اول ${toman(plan.installments[0].amount)}`}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted">پرداخت نمایشی است؛ هیچ اطلاعات کارتی دریافت نمی‌شود.</p>
          </div>
        </aside>
      </div>
    </form>
  );
}
