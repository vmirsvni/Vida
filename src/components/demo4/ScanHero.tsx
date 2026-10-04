"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { specialists } from "@/data/specialists";
import { D4 } from "@/lib/demo";
import { faNum } from "@/lib/format";
import { services4 } from "./data4";
import track from "./track.json";

/* Hero: one model on video (AI-generated clip supplied by the client, played
   forward-and-back so the loop is seamless). The section takes the video's own
   studio colour and the video edges fade into it, so the clip reads as part of
   the page. Square scan boxes follow her right eye (eyeliner), brow and lips;
   positions come from track.json (OpenCV template matching, % of the frame,
   one entry per video frame). */

type Key = "brow" | "lash" | "lip";
type Side = "start" | "end" | "below";
const BOXES: { key: Key; s: number; dx: number; dy: number; label: string; value: string; delay: number; side: Side }[] = [
  { key: "lash", s: 12, dx: -0.5, dy: 0, label: "خط چشم", value: "ظریف و کشیده", delay: 0.6, side: "end" },
  { key: "brow", s: 17, dx: 0, dy: -1.5, label: "ویبروز ابرو", value: "تراکم و فرم", delay: 1.2, side: "start" },
  { key: "lip", s: 22, dx: 0, dy: 0, label: "شیدینگ لب", value: "رنگ طبیعی", delay: 1.8, side: "below" },
];
const T = track as { fps: number; n: number; points: Record<Key, number[][]> };
const SRC = "/images/d4b/scan";

const REDUCE = "(prefers-reduced-motion: reduce)";
const subReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

function at(key: Key, t: number): [number, number] {
  const pts = T.points[key];
  const f = (t * T.fps) % pts.length;
  const i = Math.floor(f);
  const j = (i + 1) % pts.length;
  const k = f - i;
  return [pts[i][0] + (pts[j][0] - pts[i][0]) * k, pts[i][1] + (pts[j][1] - pts[i][1]) * k];
}

export function ScanHero() {
  const reduce = useSyncExternalStore(
    subReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
  const [ready, setReady] = useState(false);
  const [loop, setLoop] = useState(0); // restarts the draw-on animation on every loop
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);

  // always playing, muted and looped; only parked while off-screen or in a hidden tab
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let inView = true;
    const sync = () => {
      if (inView && document.visibilityState === "visible") v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    if (root.current) io.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    v.addEventListener("canplay", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      v.removeEventListener("canplay", sync);
    };
  }, []);

  // follow the face — direct DOM writes, no re-render per frame
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const place = () => {
      const t = video.current?.currentTime ?? 0;
      if (t + 0.05 < last) setLoop((l) => l + 1);
      last = t;
      BOXES.forEach((b, n) => {
        const el = boxes.current[n];
        if (!el) return;
        const [x, y] = at(b.key, t);
        el.style.left = `${x + b.dx}%`;
        el.style.top = `${y + b.dy}%`;
      });
      raf = requestAnimationFrame(place);
    };
    raf = requestAnimationFrame(place);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section aria-labelledby="h4-title" className="relative mx-auto max-w-[1320px] px-4 pb-12 lg:px-8 lg:pb-0">
      <div className="grid items-center gap-y-8 lg:grid-cols-12 lg:gap-x-6">
        <div className="order-2 lg:order-none lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pb-16">
          <h1 id="h4-title" className="text-[clamp(34px,3.9vw,52px)] font-medium leading-[1.35] tracking-[-0.02em] text-espresso">
            {["زیبایی‌ات", "را", "دقیق‌تر", "بشناس."].map((w, n) => (
              <span key={w}>
                {n > 0 && " "}
                <span className="blur-word" style={{ ["--d" as string]: `${150 + n * 140}ms` }}>
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p className="blur-word mt-5 max-w-sm text-[15px] leading-8 text-charcoal" style={{ ["--d" as string]: "800ms" }}>
            طراحی خط چشم، ویبروز ابرو و شیدینگ لب، متناسب با فرم چهره شما.
          </p>
          <div className="blur-word mt-8 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "950ms" }}>
            <Link href={`${D4}/booking`} className="btn btn-primary px-7">
              رزرو مشاوره
            </Link>
            <Link href={`${D4}#services`} className="btn btn-ghost px-6 text-espresso">
              خدمات
            </Link>
          </div>
        </div>

        <div ref={root} className="order-1 lg:order-none lg:col-span-5 lg:col-start-5 lg:row-start-1">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[520px]">
            <div className="stage-fade absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${SRC}.jpg`} alt="" className="absolute inset-0 size-full object-cover" fetchPriority="high" />
              <video
                ref={video}
                className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                poster={`${SRC}.jpg`}
                onLoadedData={() => setReady(true)}
                aria-label="ویدیوی نمونه آنالیز چهره برای خط چشم، ویبروز ابرو و شیدینگ لب"
              >
                <source src={`${SRC}.webm`} type="video/webm" />
                <source src={`${SRC}.mp4`} type="video/mp4" />
              </video>
            </div>

            <div key={loop} className={`absolute inset-0 ${reduce ? "" : "scan-on"}`}>
              <span className="scan-line" aria-hidden />
              {BOXES.map((b, n) => (
                <div
                  key={b.key}
                  ref={(el) => {
                    boxes.current[n] = el;
                  }}
                  className="scan-box"
                  style={{
                    width: `${b.s}%`,
                    left: `${T.points[b.key][0][0] + b.dx}%`,
                    top: `${T.points[b.key][0][1] + b.dy}%`,
                    ["--d" as string]: `${b.delay}s`,
                  }}
                >
                  <span
                    className="scan-mesh absolute inset-[-20%] rounded-full"
                    style={{
                      backgroundImage: "radial-gradient(rgb(255 255 255 / .9) 1px, transparent 1.4px)",
                      backgroundSize: "7px 7px",
                    }}
                  />
                  <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
                    <rect
                      x="0.75"
                      y="0.75"
                      width="98.5"
                      height="98.5"
                      fill="rgb(255 255 255 / 0.08)"
                      stroke="white"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <span className="scan-dot absolute right-[8%] top-[8%] size-[7%] min-h-1 min-w-1 bg-surface" />
                  <span
                    className={`scan-label absolute whitespace-nowrap rounded-full bg-surface/90 px-2 py-0.5 text-[10px] leading-tight text-espresso lg:text-[11px] ${
                      b.side === "below"
                        ? "left-1/2 top-[calc(100%+6px)] -translate-x-1/2"
                        : b.side === "start"
                          ? "right-[calc(100%+6px)] top-1/2 -translate-y-1/2"
                          : "left-[calc(100%+6px)] top-1/2 -translate-y-1/2"
                    }`}
                  >
                    <b className="font-medium">{b.label}</b> · {b.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Stats />
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { n: services4.length, suffix: "", label: "خدمت تخصصی" },
    { n: specialists.length, suffix: "", label: "متخصص" },
    { n: 15, suffix: " دقیقه", label: "فاصله آرام بین نوبت‌ها" },
  ];
  return (
    <dl className="order-3 grid grid-cols-3 gap-4 border-t border-line-strong pt-6 lg:order-none lg:col-span-2 lg:col-start-11 lg:row-start-1 lg:grid-cols-1 lg:gap-8 lg:border-t-0 lg:pt-0">
      {items.map((it, k) => (
        <div key={it.label} className="blur-word" style={{ ["--d" as string]: `${1000 + k * 150}ms` }}>
          <dt className="sr-only">{it.label}</dt>
          <dd>
            <span className="block text-[28px] font-medium leading-none text-espresso lg:text-[34px]">
              <CountUp to={it.n} />
              <span className="text-[15px]">{it.suffix}</span>
            </span>
            <span aria-hidden className="mt-2 block text-[12px] leading-5 text-muted">
              {it.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{faNum(v)}</>;
}
