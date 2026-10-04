"use client";

import Image from "next/image";
import Link from "next/link";
import { getMedia4 } from "@/data/media4";
import { setCartQty, useDemo, useHydrated } from "@/lib/store/store";
import { D4 } from "@/lib/demo";
import { faNum, toman } from "@/lib/format";
import { cartLines, FREE_SHIPPING_FROM } from "../products4";

export function Cart4() {
  const s = useDemo();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-[60vh]" />;
  const lines = cartLines(s.cart);
  const subtotal = lines.reduce((t, l) => t + l.total, 0);
  const toFree = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-24 text-center lg:px-8">
        <h1 className="text-[clamp(30px,3.6vw,44px)] font-medium">سبد خرید خالی است.</h1>
        <p className="mt-3 text-[14px] text-charcoal">محصولات منتخب سالن را ببینید.</p>
        <Link href={`${D4}/shop`} className="btn btn-primary mt-8 px-7">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-12">
      <h1 className="text-[clamp(32px,4vw,52px)] font-medium">سبد خرید</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <ul className="divide-y divide-line lg:col-span-8">
          {lines.map(({ product: p, qty, total }) => {
            const m = getMedia4(p.image);
            return (
              <li key={p.id} className="flex gap-4 py-5 first:pt-0">
                <Link href={`${D4}/shop/${p.id}`} className="relative block size-24 shrink-0 overflow-hidden rounded-2xl bg-cream sm:size-28">
                  <Image src={m.src} alt="" fill sizes="112px" className="object-cover" style={{ objectPosition: m.focal }} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="nuve-latin text-[12px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
                        {p.brand}
                      </p>
                      <Link href={`${D4}/shop/${p.id}`} className="text-[16px] font-medium hover:text-champagne">
                        {p.name}
                      </Link>
                      <p className="text-[12px] text-muted">{p.size}</p>
                    </div>
                    <p className="shrink-0 text-[15px] font-medium">{toman(total)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div className="flex h-10 items-center rounded-full border border-line-strong" role="group" aria-label={`تعداد ${p.name}`}>
                      <button type="button" onClick={() => setCartQty(p.id, qty + 1)} aria-label="افزایش" className="flex size-10 items-center justify-center">
                        +
                      </button>
                      <span className="w-6 text-center text-[14px]">{faNum(qty)}</span>
                      <button type="button" onClick={() => setCartQty(p.id, qty - 1)} aria-label="کاهش" className="flex size-10 items-center justify-center">
                        −
                      </button>
                    </div>
                    <button type="button" onClick={() => setCartQty(p.id, 0)} className="rounded-full px-3 py-1.5 text-[12px] text-danger hover:bg-danger-soft">
                      حذف
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:col-span-4">
          <div className="rounded-[28px] bg-cream p-6 lg:sticky lg:top-6">
            <dl className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-charcoal">جمع کالاها</dt>
                <dd>{toman(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal">ارسال</dt>
                <dd className="text-muted">در مرحله بعد</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-line pt-4 text-[12px] leading-6 text-muted">
              {toFree ? `با ${toman(toFree)} خرید بیشتر، ارسال رایگان می‌شود.` : "ارسال این سفارش رایگان است."}
            </p>
            <Link href={`${D4}/checkout`} className="btn btn-primary mt-6 w-full">
              ادامه و ثبت سفارش
            </Link>
            <Link href={`${D4}/shop`} className="mt-3 block text-center text-[13px] text-charcoal underline underline-offset-4">
              ادامه خرید
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
