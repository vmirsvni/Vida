"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Figure } from "@/components/ui/Figure";
import { buildPlan } from "@/lib/booking/payment";
import { addToCart, useDemo, useHydrated } from "@/lib/store/store";
import { D4 } from "@/lib/demo";
import { faNum, toman } from "@/lib/format";
import { CATEGORIES4, DELIVERY4, FREE_SHIPPING_FROM, getProduct4, products4 } from "../products4";
import { ProductCard4 } from "./ProductCard4";

export function ProductDetail4({ id }: { id: string }) {
  const p = getProduct4(id)!;
  const router = useRouter();
  const s = useDemo();
  const hydrated = useHydrated();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = hydrated ? ((s.cart ?? []).find((c) => c.id === p.id)?.qty ?? 0) : 0;
  const each = buildPlan(p.price * qty, "snapppay").installments[1].amount;
  const related = products4.filter((x) => x.id !== p.id).slice(0, 4);
  const cat = CATEGORIES4.find((c) => c.key === p.category)?.label;

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-6 lg:px-8 lg:pb-28 lg:pt-10">
      <nav aria-label="مسیر" className="text-[12px] text-muted">
        <Link href={`${D4}/shop`} className="hover:text-espresso">
          محصولات
        </Link>
        <span className="mx-2">/</span>
        <span>{cat}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <Figure name={p.image} set="demo4" ratio="4/5" sizes="(min-width: 1024px) 46vw, 100vw" priority />
        </div>

        <div className="lg:col-span-5 lg:pt-6">
          <p className="nuve-latin text-[14px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
            {p.brand}
          </p>
          <h1 className="mt-1 text-[clamp(32px,3.8vw,48px)] font-medium leading-[1.3]">{p.name}</h1>
          <p className="mt-2 text-[15px] text-charcoal">
            {p.short} · {p.size}
          </p>
          <p className="mt-6 text-[26px] font-medium">{toman(p.price * qty)}</p>
          <p className="mt-1 text-[13px] text-muted">یا ۴ قسط ماهانه با اسنپ‌پی و دی‌جی‌پی؛ هر قسط حدود {toman(each)}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-full border border-line-strong" role="group" aria-label="تعداد">
              <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="افزایش تعداد" className="flex size-12 items-center justify-center text-[18px]">
                +
              </button>
              <span className="w-8 text-center text-[15px]" aria-live="polite">
                {faNum(qty)}
              </span>
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="کاهش تعداد" disabled={qty <= 1} className="flex size-12 items-center justify-center text-[18px] disabled:text-faint">
                −
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                addToCart(p.id, qty);
                setAdded(true);
              }}
              className="btn btn-primary flex-1 whitespace-nowrap px-7 sm:flex-none"
            >
              افزودن به سبد
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(p.id, qty);
                router.push(`${D4}/checkout`);
              }}
              className="btn btn-ghost whitespace-nowrap px-6 text-espresso"
            >
              خرید و پرداخت
            </button>
          </div>
          <p className="mt-3 min-h-5 text-[13px] text-charcoal" aria-live="polite">
            {added || inCart ? (
              <>
                {faNum(inCart)} عدد در سبد شماست.{" "}
                <Link href={`${D4}/cart`} className="text-champagne underline underline-offset-4">
                  مشاهده سبد
                </Link>
              </>
            ) : null}
          </p>

          <dl className="mt-8 divide-y divide-line rounded-[28px] bg-cream px-6 text-[13px]">
            {(["pickup", "courier", "post"] as const).map((k) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="font-medium text-espresso">{DELIVERY4[k].title}</dt>
                <dd className="text-muted">{DELIVERY4[k].note}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-[12px] text-muted">ارسال برای سفارش‌های بالای {toman(FREE_SHIPPING_FROM)} رایگان است.</p>

          <div className="mt-10 space-y-6 text-[14px] leading-8">
            <section>
              <h2 className="text-[20px] font-medium">درباره محصول</h2>
              <p className="mt-2 text-charcoal">{p.description}</p>
            </section>
            <section>
              <h2 className="text-[20px] font-medium">روش استفاده</h2>
              <p className="mt-2 text-charcoal">{p.usage}</p>
            </section>
            {p.note && <p className="text-[12px] text-muted">{p.note}</p>}
          </div>
        </div>
      </div>

      <section aria-labelledby="rel4" className="mt-20 lg:mt-28">
        <h2 id="rel4" className="text-[clamp(26px,3vw,36px)] font-medium">
          محصولات دیگر
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {related.map((r) => (
            <li key={r.id}>
              <ProductCard4 p={r} ratio="1/1" sizes="(min-width: 1024px) 22vw, 46vw" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
