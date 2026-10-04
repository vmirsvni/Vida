"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMedia2 } from "@/data/media2";
import { faNum } from "@/lib/format";
import { D2 } from "@/lib/demo";
import { svcList } from "./data";
import { ArrowL, ArrowR, ArrowUpLeft, CalendarIcon, Close, Flower, Menu, Play, Search, User } from "./icons";

/* hero slideshow — one portrait per service, synced with the glass carousel */
const slides = ["hs-1", "hs-2", "hs-3", "hs-4", "hs-5"].map((k) => getMedia2(k));
const nav = [
  { href: "#top", label: "خانه" },
  { href: "#services", label: "خدمات" },
  { href: "#about", label: "درباره ما" },
];

export function Hero2() {
  const [i, setI] = useState(0);
  const [menu, setMenu] = useState(false);
  const n = svcList.length;
  const pair = [svcList[i % n], svcList[(i + 1) % n]];
  const progress = ((i + 1) / n) * 100;
  const [held, setHeld] = useState(0); // timestamp of the last manual navigation

  // gentle autoplay; pauses after manual navigation, for reduced motion and in background tabs
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (document.hidden || Date.now() - held < 12000) return;
      setI((x) => (x + 1) % n);
    }, 6500);
    return () => window.clearInterval(t);
  }, [held, n]);
  const go = (d: number) => {
    setHeld(Date.now());
    setI((x) => (x + d + n) % n);
  };

  return (
    <section
      id="top"
      aria-labelledby="h2-title"
      className="relative overflow-hidden rounded-[26px] bg-[#6f4541] text-white lg:rounded-[30px]"
    >
      {/* backdrop: mauve field + portrait anchored left, fading into the colour behind the copy */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_20%,#9a6a63_0%,#7a4c48_45%,#5b3431_100%)]"
      />
      <div className="absolute inset-x-0 top-0 h-[60%] [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)] sm:h-[66%] lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-[64%] lg:[mask-image:linear-gradient(to_left,transparent_0%,#000_38%)]">
        {slides.map((m, k) => (
          <Image
            key={m.src}
            src={m.src}
            alt={k === i ? m.alt : ""}
            aria-hidden={k !== i}
            fill
            priority={k === 0}
            loading={k === 0 ? undefined : "eager"}
            quality={88}
            sizes="(min-width: 1024px) 64vw, 100vw"
            placeholder={m.blur ? "blur" : "empty"}
            blurDataURL={m.blur}
            className={`object-cover transition-[opacity,transform] duration-[1600ms] ease-[var(--ease-lux)] ${
              k === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
            }`}
            style={{ objectPosition: m.focal }}
          />
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#3d2321]/70 via-transparent to-transparent lg:hidden" />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-gradient-to-t from-[#3d2321]/45 via-transparent to-transparent lg:block"
      />

      <div className="relative flex min-h-[calc(100svh-24px)] flex-col p-4 sm:p-6 lg:min-h-[640px] lg:p-8 xl:min-h-[700px]">
        {/* top bar */}
        <header className="flex items-center justify-between gap-3">
          <nav aria-label="منوی اصلی" className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="منو"
              className="glass flex size-11 items-center justify-center rounded-full"
            >
              <Menu size={18} />
            </button>
            {nav.map((l, k) => (
              <a
                key={l.href}
                href={l.href}
                className={`hidden h-11 items-center rounded-full px-6 text-[14px] transition-colors md:flex ${
                  k === 0 ? "bg-white font-semibold text-[#1c1717]" : "glass hover:bg-white/25"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <Link
            href={D2}
            className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 sm:top-6 lg:top-8"
            aria-label="Vida Beauty"
          >
            <Image src="/brand/vida-logo-256.webp" alt="" width={40} height={40} className="size-9 lg:size-10" />
            <span className="hidden text-[17px] font-bold tracking-tight sm:inline" dir="ltr">
              VidaBeauty
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="#catalogue"
              aria-label="جستجوی خدمات"
              className="glass hidden size-11 items-center justify-center rounded-full sm:flex"
            >
              <Search size={18} />
            </a>
            <Link
              href={`${D2}/booking`}
              aria-label="رزرو نوبت"
              className="flex size-11 items-center justify-center rounded-full bg-white text-[#1c1717]"
            >
              <CalendarIcon size={18} />
            </Link>
            <Link
              href={`${D2}/account`}
              aria-label="حساب کاربری"
              className="glass flex size-11 items-center justify-center rounded-full"
            >
              <User size={18} />
            </Link>
          </div>
        </header>

        {/* copy */}
        <div className="mt-auto grid flex-1 gap-8 pt-16 lg:mt-0 lg:grid-cols-12 lg:pt-20">
          <div className="flex flex-col justify-end lg:col-span-6 lg:justify-start xl:col-span-5">
            <h1
              id="h2-title"
              className="anim-rise text-[34px] font-light leading-[1.45] sm:text-[44px] lg:text-[52px] xl:text-[58px]"
              style={{ ["--d" as string]: "200ms" }}
            >
              <b className="font-extrabold">زیبایی،</b> با ظرافتی
              <br />
              که <b className="font-extrabold">ماندگار</b> می‌شود.
            </h1>
            <p className="anim-rise mt-5 max-w-sm text-[14px] leading-7 text-white/80" style={{ ["--d" as string]: "320ms" }}>
              خدمات تخصصی زیبایی و PMU با تمرکز بر ظرافت، تناسب و زیبایی طبیعی چهره — در Vida Beauty سبزوار.
            </p>
            <div className="anim-rise mt-7 flex flex-wrap gap-3" style={{ ["--d" as string]: "440ms" }}>
              <Link
                href={`${D2}/booking`}
                className="flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-semibold text-[#1c1717]"
              >
                رزرو نوبت <ArrowUpLeft size={16} />
              </Link>
              <a href="#services" className="glass flex h-12 items-center rounded-full px-6 text-[14px]">
                مشاهده خدمات
              </a>
            </div>
          </div>

          {/* gallery circle */}
          <a
            href="#transform"
            className="anim-fade group hidden items-center gap-3 self-start justify-self-end lg:col-span-3 lg:col-start-10 lg:mt-8 lg:flex"
            style={{ ["--d" as string]: "700ms" }}
          >
            <span className="relative flex size-24 items-center justify-center rounded-full border border-white/50">
              <span className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-transform duration-500 group-hover:scale-110">
                <Play size={16} />
              </span>
            </span>
            <span className="text-[13px] leading-5 text-white/90">
              گالری
              <br />
              نمونه‌کارها
            </span>
          </a>
        </div>

        {/* bottom row */}
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:items-end">
          {/* tags */}
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:col-span-5 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            {svcList.map((s) => (
              <li key={s.slug} className="flex-none">
                <Link
                  href={`${D2}/booking?service=${s.slug}`}
                  className="glass flex h-10 items-center gap-2 rounded-full px-4 text-[13px] hover:bg-white/25"
                >
                  <Flower size={14} /> {s.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* glass cards carousel */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
              {pair.map((s, k) => (
                <div key={`${s.slug}-${k}`} className={`contents ${k === 1 ? "max-sm:hidden" : ""}`}>
                  <Link
                    href={`${D2}/booking?service=${s.slug}`}
                    className="anim-fade relative block aspect-square overflow-hidden rounded-[20px]"
                    aria-label={s.title}
                  >
                    <Image
                      src={getMedia2(s.thumb).src}
                      alt=""
                      fill
                      sizes="180px"
                      className="object-cover"
                      style={{ objectPosition: getMedia2(s.thumb).focal }}
                    />
                    <span className="absolute left-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-white text-[#1c1717]">
                      <ArrowUpLeft size={14} />
                    </span>
                  </Link>
                  <div className="glass anim-fade flex aspect-square flex-col items-center justify-center rounded-[20px] p-3 text-center">
                    <p className="text-[15px] font-bold">{s.title}</p>
                    <p className="mt-1.5 text-[11.5px] leading-5 text-white/80">{s.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[13px] tabular-nums">{faNum(String(i + 1).padStart(2, "0"))}</span>
              <span className="relative h-px flex-1 bg-white/30">
                <span
                  className="absolute inset-y-0 right-0 bg-white transition-[width] duration-700"
                  style={{ width: `${progress}%`, height: 2, top: -0.5 }}
                />
              </span>
              <span className="text-[13px] tabular-nums text-white/60">{faNum(String(n).padStart(2, "0"))}</span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="قبلی"
                className="glass flex h-9 w-12 items-center justify-center rounded-full"
              >
                <ArrowR size={16} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="بعدی"
                className="flex h-9 w-12 items-center justify-center rounded-full bg-white text-[#1c1717]"
              >
                <ArrowL size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile / quick menu */}
      {menu && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#1c1717]/40 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="منو"
        >
          <div className="anim-rise w-full max-w-md rounded-[26px] bg-white p-5 text-[#1c1717]">
            <div className="flex items-center justify-between">
              <span className="font-bold" dir="ltr">
                VidaBeauty
              </span>
              <button
                type="button"
                onClick={() => setMenu(false)}
                aria-label="بستن"
                className="flex size-11 items-center justify-center rounded-full bg-[#f6e6e2]"
              >
                <Close size={18} />
              </button>
            </div>
            <ul className="mt-4 space-y-1">
              {[
                ...nav,
                { href: "#academy", label: "آکادمی" },
                { href: "#catalogue", label: "کاتالوگ خدمات" },
                { href: "#reviews", label: "نظرات" },
                { href: "#contact", label: "تماس" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMenu(false)}
                    className="flex h-12 items-center justify-between rounded-full px-4 text-[16px] hover:bg-[#f8efec]"
                  >
                    {l.label} <ArrowUpLeft size={16} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={`${D2}/booking`}
                className="flex h-12 items-center justify-center rounded-full bg-[#1c1717] text-[14px] text-white"
              >
                رزرو نوبت
              </Link>
              <Link
                href={`${D2}/account`}
                className="flex h-12 items-center justify-center rounded-full border border-[#efe4e0] text-[14px]"
              >
                حساب کاربری
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
