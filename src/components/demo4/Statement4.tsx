"use client";

import { useEffect, useRef, useState } from "react";

const TEXT =
  "Vida به شما کمک می‌کند چهره‌تان را بهتر بشناسید [pill-217834] و زیبایی طبیعی‌اش را ماندگار کنید [pill-291832] با مشاوره دقیق، طراحی متناسب با فرم صورت [pill-267814] و اجرایی ظریف برای ابرو، مژه و لب.";

/* Words turn from grey to black as the paragraph passes the middle of the viewport.
   Driven by an IntersectionObserver on a thin band at mid-screen (no scroll listener). */
export function Statement4() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const steps = Array.from({ length: 41 }, (_, i) => i / 40);
    const io = new IntersectionObserver(
      ([e]) => {
        const mid = window.innerHeight / 2;
        const r = e.boundingClientRect;
        setP(Math.min(1, Math.max(0, (mid - r.top) / r.height)));
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: steps },
    );
    io.observe(el);
    // land in the right state when the page is opened already scrolled
    const r = el.getBoundingClientRect();
    if (r.bottom < window.innerHeight / 2) setP(1);
    return () => io.disconnect();
  }, []);
  const words = TEXT.split(" ");
  const lit = Math.round(p * words.length);
  return (
    <section aria-label="درباره Vida" className="relative mx-auto max-w-[1100px] px-5 py-20 lg:py-32">
      <div ref={ref}>
        <p className="text-center text-[clamp(26px,4vw,50px)] font-medium leading-[1.55] tracking-[-0.02em]">
          {words.map((w, k) => {
            const pill = w.match(/^\[(pill-\d+)\]$/);
            if (pill)
              return (
                <span key={k}>
                  <span
                    aria-hidden
                    className="nuve-pill-img transition-[opacity,filter] duration-500"
                    style={{
                      backgroundImage: `url(/_next/image?url=${encodeURIComponent(`/images/d4b/${pill[1]}.jpg`)}&w=256&q=80)`,
                      opacity: k < lit ? 1 : 0.35,
                      filter: k < lit ? "none" : "grayscale(1)",
                    }}
                  />{" "}
                </span>
              );
            return (
              <span key={k} className="transition-colors duration-500" style={{ color: k < lit ? "var(--color-espresso)" : "var(--color-line-strong)" }}>
                {w}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
