"use client";

import { useState } from "react";

type R = { id: string; quote: string; author: string; service: string };

/* Two quotes per view with round arrow buttons, as in the reference. ⚠️ demo testimonials */
export function Reviews3Slider({ items }: { items: R[] }) {
  const pages = Math.max(1, Math.ceil(items.length / 2));
  const [p, setP] = useState(0);
  const view = items.slice(p * 2, p * 2 + 2);
  return (
    <div className="mt-12">
      <div className="grid gap-10 md:grid-cols-2 md:gap-0" aria-live="polite">
        {view.map((t, i) => (
          <figure key={t.id} className={`relative md:px-10 ${i === 0 ? "md:border-l md:border-on-dark/15" : ""}`}>
            <span aria-hidden className="nue-latin absolute -top-6 right-6 text-[120px] leading-none text-on-dark/[0.06]">
              “
            </span>
            <blockquote className="relative text-[15px] leading-8 text-on-dark/80">{t.quote}</blockquote>
            <figcaption className="mt-6 text-[14px]">
              {t.author} <span className="text-on-dark/55">· {t.service}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10 flex items-center justify-between">
        <span className="text-[12px] text-on-dark/60">نظرات نمونه برای نسخه نمایشی</span>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="نظرات قبلی"
            onClick={() => setP((x) => (x - 1 + pages) % pages)}
            className="flex size-10 items-center justify-center rounded-full bg-on-dark text-espresso"
          >
            →
          </button>
          <button
            type="button"
            aria-label="نظرات بعدی"
            onClick={() => setP((x) => (x + 1) % pages)}
            className="flex size-10 items-center justify-center rounded-full bg-on-dark text-espresso"
          >
            ←
          </button>
        </div>
      </div>
    </div>
  );
}
