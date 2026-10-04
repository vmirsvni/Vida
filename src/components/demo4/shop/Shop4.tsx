"use client";

import { useState } from "react";
import { CATEGORIES4, products4, type ProductCategory } from "../products4";
import { ProductCard4 } from "./ProductCard4";

export function Shop4() {
  const [cat, setCat] = useState<ProductCategory | "all">("all");
  const list = cat === "all" ? products4 : products4.filter((p) => p.category === cat);
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-12">
      <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(34px,4.2vw,56px)] font-medium leading-[1.3]">محصولات</h1>
          <p className="mt-3 max-w-lg text-[15px] leading-8 text-charcoal">
            محصولات مراقبتی منتخب سالن. اگر به‌تازگی خدمت PMU انجام داده‌اید، پیش از استفاده روی ناحیه کار شده با متخصص هماهنگ کنید.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:col-span-5 lg:justify-end" role="group" aria-label="دسته‌بندی محصولات">
          {CATEGORIES4.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={cat === c.key}
              onClick={() => setCat(c.key)}
              className={`min-h-10 whitespace-nowrap rounded-full border px-4 text-[13px] transition-colors ${
                cat === c.key ? "border-espresso bg-espresso text-white" : "border-line-strong text-charcoal hover:border-espresso"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-14 lg:grid-cols-3 lg:gap-x-6">
        {list.map((p) => (
          <li key={p.id}>
            <ProductCard4 p={p} sizes="(min-width: 1024px) 30vw, 46vw" />
          </li>
        ))}
      </ul>
      <p className="mt-12 text-[12px] text-muted">قیمت‌ها و تصاویر نمونه هستند؛ نسخه نمایشی.</p>
    </div>
  );
}
