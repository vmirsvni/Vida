"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getMedia4 } from "@/data/media4";
import { D4 } from "@/lib/demo";
import { team4 } from "./data4";

const W = "mx-auto max-w-[1320px] px-4 lg:px-8";

/* Our specialists: a name list beside one large portrait. Choosing a name swaps the
   portrait (crossfade); caption sits under the photo, never on it. */
export function Team4() {
  const [active, setActive] = useState(0);
  const cur = team4[active];
  return (
    <section id="team" aria-labelledby="tm4-title" className={`${W} py-16 lg:py-24`}>
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 lg:pt-6">
          <h2 id="tm4-title" className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.35]">
            متخصصان ما
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-8 text-charcoal">هر نوبت را یکی از متخصصان Vida از مشاوره تا مراقبت پس از خدمت همراهی می‌کند.</p>
          <ul className="mt-8 divide-y divide-line border-y border-line" aria-label="فهرست متخصصان">
            {team4.map((t, k) => {
              const m = getMedia4(t.img);
              const on = k === active;
              return (
                <li key={t.img}>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls="tm4-portrait"
                    onClick={() => setActive(k)}
                    onMouseEnter={() => setActive(k)}
                    className="group flex w-full items-center gap-4 py-4 text-right"
                  >
                    <span className={`relative block size-12 shrink-0 overflow-hidden rounded-full ring-2 transition-colors ${on ? "ring-champagne" : "ring-transparent"}`}>
                      <Image src={m.src} alt="" fill sizes="48px" className="object-cover" style={{ objectPosition: m.focal }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[17px] font-medium transition-colors ${on ? "text-espresso" : "text-charcoal group-hover:text-espresso"}`}>{t.name}</span>
                      <span className="block text-[13px] text-muted">{t.role}</span>
                    </span>
                    <span aria-hidden className={`text-[14px] transition-colors ${on ? "text-champagne" : "text-line-strong"}`}>
                      ←
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[12px] text-faint">تصاویر و نام‌ها نمایشی هستند.</p>
        </div>

        <figure className="order-first lg:order-none lg:col-span-5 lg:col-start-8">
          <div id="tm4-portrait" className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-cream" aria-live="polite">
            {team4.map((t, k) => {
              const m = getMedia4(t.img);
              return (
                <Image
                  key={t.img}
                  src={m.src}
                  alt={k === active ? m.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  placeholder={m.blur ? "blur" : "empty"}
                  blurDataURL={m.blur}
                  className={`object-cover transition-opacity duration-500 ${k === active ? "opacity-100" : "opacity-0"}`}
                  style={{ objectPosition: "50% 30%" }}
                />
              );
            })}
          </div>
          <figcaption className="mt-5 flex items-start justify-between gap-4 px-1">
            <span>
              <span className="block text-[20px] font-medium">{cur.name}</span>
              <span className="block text-[13px] text-muted">{cur.role}</span>
              <span className="mt-2 block max-w-sm text-[14px] leading-7 text-charcoal">{cur.note}</span>
            </span>
            {active < 3 && (
              <Link href={`${D4}/booking`} className="btn btn-ghost shrink-0 whitespace-nowrap px-5 text-[13px] text-espresso">
                رزرو نوبت
              </Link>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
