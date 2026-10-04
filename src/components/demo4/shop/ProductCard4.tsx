"use client";

import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { Check, Plus } from "@/components/ui/Icons";
import { addToCart, useDemo, useHydrated } from "@/lib/store/store";
import { D4 } from "@/lib/demo";
import { toman } from "@/lib/format";
import type { Product4 } from "../products4";

/* Product tile: photo first, caption and add button below (nothing laid over the photo). */
export function ProductCard4({ p, sizes, ratio = "4/5", large = false }: { p: Product4; sizes: string; ratio?: string; large?: boolean }) {
  return (
    <article className="nuve-card group">
      <Link href={`${D4}/shop/${p.id}`} className="block overflow-hidden rounded-[28px] bg-cream" tabIndex={-1} aria-hidden>
        <Figure name={p.image} set="demo4" ratio={ratio} sizes={sizes} className="!rounded-none" />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="nuve-latin text-[12px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
            {p.brand}
          </p>
          <h3 className={`mt-0.5 font-medium ${large ? "text-[22px]" : "text-[16px]"}`}>
            <Link href={`${D4}/shop/${p.id}`} className="hover:text-champagne">
              {p.name}
            </Link>
          </h3>
          {large && <p className="mt-1 text-[13px] text-charcoal">{p.short}</p>}
          <p className="mt-1.5 text-[14px] text-espresso">{toman(p.price)}</p>
        </div>
        <AddButton p={p} />
      </div>
    </article>
  );
}

export function AddButton({ p }: { p: Product4 }) {
  const s = useDemo();
  const hydrated = useHydrated();
  const inCart = hydrated && (s.cart ?? []).some((c) => c.id === p.id);
  return (
    <button
      type="button"
      onClick={() => addToCart(p.id)}
      aria-label={inCart ? `${p.name} در سبد است؛ یکی دیگر اضافه کنید` : `افزودن ${p.name} به سبد`}
      title={inCart ? "در سبد خرید" : "افزودن به سبد"}
      className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
        inCart ? "border-espresso bg-espresso text-white" : "border-line-strong text-espresso hover:border-espresso"
      }`}
    >
      {inCart ? <Check size={16} /> : <Plus size={16} />}
    </button>
  );
}
