"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/data/types";

export function Accordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const uid = useId();
  return (
    <div className="border-t border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        const id = `${uid}-${i}`;
        return (
          <div key={it.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-p`}
                id={`${id}-b`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-right"
              >
                <span className="font-display text-[22px] leading-[1.5] text-espresso transition-colors group-hover:text-wine lg:text-[26px]">
                  {it.q}
                </span>
                <span aria-hidden className="relative size-4 flex-none text-wine">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span
                    className={`absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-500 ${isOpen ? "scale-y-0" : ""}`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-p`}
              role="region"
              aria-labelledby={`${id}-b`}
              className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-lux)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 text-charcoal">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
