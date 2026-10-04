"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { Figure } from "@/components/ui/Figure";
import { getMedia2 } from "@/data/media2";
import { certificate, courses, testimonials } from "@/data/content";
import { site } from "@/data/site";
import { D2 } from "@/lib/demo";
import { durationLabel, faNum, toman } from "@/lib/format";
import { svcList, transformations } from "./data";
import { ArrowL, ArrowR, ArrowUpLeft, Flower, Heart, Insta, Phone, Pin, Search } from "./icons";

/* ── shared bits ──────────────────────────────────────────── */

function Title({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <h2
      id={id}
      data-reveal
      className={`text-[28px] font-light leading-[1.45] text-[#1c1717] sm:text-[34px] lg:text-[42px] ${className}`}
    >
      {children}
    </h2>
  );
}

function Pill({ href, children, dark }: { href: string; children: ReactNode; dark?: boolean }) {
  const cls = `inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] transition-colors ${
    dark ? "bg-[#1c1717] text-white hover:bg-[#3b3130]" : "border border-[#1c1717]/25 text-[#1c1717] hover:bg-[#f8efec]"
  }`;
  return href.startsWith("#") || href.startsWith("tel:") ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function RoundArrow({ active, onClick, label, big }: { active?: boolean; onClick?: () => void; label: string; big?: boolean }) {
  return (
    <span
      role={onClick ? "button" : undefined}
      aria-label={label}
      onClick={onClick}
      className={`flex flex-none items-center justify-center rounded-full border transition-colors ${big ? "size-10" : "size-8"} ${
        active ? "border-[#1c1717] bg-[#1c1717] text-white" : "border-[#1c1717]/30 text-[#1c1717]"
      }`}
    >
      <ArrowUpLeft size={big ? 16 : 14} />
    </span>
  );
}

const wrap = "px-5 sm:px-8 lg:px-14";

/* ── 2. Start here ────────────────────────────────────────── */
export function StartHere() {
  const [more, setMore] = useState(false);
  return (
    <section id="about" aria-labelledby="start-title" className={`${wrap} scroll-mt-4 py-16 lg:py-24`}>
      <div className="flex items-start justify-between gap-6">
        <Title id="start-title">
          زیبایی و اعتماد به نفس شما
          <br />
          <b className="font-extrabold">از اینجا آغاز می‌شود</b>!
        </Title>
        <a
          href="#services"
          data-reveal
          className="flex size-24 flex-none flex-col items-center justify-center gap-1 rounded-full bg-[#f6e6e2] text-[12px] font-medium text-[#1c1717] transition-transform hover:scale-105 lg:size-28"
        >
          <ArrowUpLeft size={16} />
          درباره ما
        </a>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-12 lg:gap-5">
        <div className="col-span-2 sm:col-span-1 lg:col-span-4">
          <Figure set="demo2" name="editorial-closed" ratio="4/3" sizes="(min-width:1024px) 30vw, 90vw" />
          <p data-reveal className="mt-5 max-w-xs text-[15px] leading-7 text-[#1c1717]">
            Vida Beauty؛ آتلیه تخصصی زیبایی و PMU در سبزوار.
          </p>
          <div className="grid transition-[grid-template-rows] duration-700" style={{ gridTemplateRows: more ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <p className="mt-3 max-w-sm text-[14px] leading-7 text-[#5a5250]">
                هر خدمت با مشاوره آغاز می‌شود؛ فرم، رنگ و تناسب پیش از هر اقدامی با شما طراحی می‌شود تا نتیجه‌ای طبیعی و ماندگار
                شکل بگیرد. زیبایی، یک هنر است.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMore((m) => !m)}
            aria-expanded={more}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-[#1c1717]/25 px-5 text-[14px] hover:bg-[#f8efec]"
          >
            {more ? "بستن" : "بیشتر بخوانید"} <ArrowUpLeft size={14} />
          </button>
        </div>
        <div className="max-sm:hidden lg:col-span-3">
          <Figure
            set="demo2"
            name="d2-cream"
            ratio="3/4"
            sizes="(min-width:1024px) 22vw, 45vw"
            delay={120}
            className="lg:aspect-[3/4.6]"
          />
        </div>
        <div className="col-span-2 flex flex-col justify-end sm:col-span-1 lg:col-span-5">
          <p data-reveal className="mb-5 text-[20px] font-light leading-8 text-[#1c1717] lg:text-[22px]">
            زیبایی طبیعی خود را
            <br />
            کشف کنید
          </p>
          <Figure set="demo2" name="d2-interior" ratio="16/10" sizes="(min-width:1024px) 38vw, 90vw" delay={200} />
        </div>
      </div>
    </section>
  );
}

/* ── 3. Services we provide ───────────────────────────────── */
export function Services2() {
  const [a, setA] = useState(0);
  const s = svcList[a];
  const next = svcList[(a + 1) % svcList.length];
  return (
    <section id="services" aria-labelledby="svc2-title" className={`${wrap} scroll-mt-4 py-16 lg:py-24`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Title id="svc2-title">
          خدماتی که <b className="font-extrabold">ارائه می‌دهیم</b>
        </Title>
        <Pill href="#catalogue">
          همه خدمات <ArrowUpLeft size={14} />
        </Pill>
      </div>

      <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-5">
        <div className="lg:col-span-3">
          <ul role="tablist" aria-label="خدمات" className="divide-y divide-[#1c1717]/15 border-y border-[#1c1717]/15">
            {svcList.map((x, k) => (
              <li key={x.slug}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={a === k}
                  onClick={() => setA(k)}
                  className="flex min-h-14 w-full items-center gap-3 py-2 text-right"
                >
                  <span className="relative h-7 w-11 flex-none overflow-hidden rounded-full">
                    <Image src={getMedia2(x.thumb).src} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className={`flex-1 text-[16px] ${a === k ? "font-bold text-[#1c1717]" : "text-[#5a5250]"}`}>
                    {x.title}
                  </span>
                  <RoundArrow active={a === k} label="" big />
                </button>
              </li>
            ))}
          </ul>
          <div key={s.slug} className="anim-fade mt-6">
            <p className="text-[14px] leading-7 text-[#5a5250]">{s.short}</p>
            <p className="mt-4 text-[13px] text-[#847a77]">
              {durationLabel(s.durationMin)} · {toman(s.price)} <span className="text-[11px]">(قیمت دمو)</span>
            </p>
            <div className="mt-5">
              <Pill href={`${D2}/booking?service=${s.slug}`} dark>
                رزرو {s.title} <ArrowUpLeft size={14} />
              </Pill>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div
            key={s.slug}
            className="anim-fade relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-full lg:min-h-[380px]"
          >
            <Image
              src={getMedia2(s.image).src}
              alt={getMedia2(s.image).alt}
              fill
              sizes="(min-width:1024px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: getMedia2(s.image).focal }}
            />
          </div>
          <a
            href={`${D2}/booking?service=${s.slug}`}
            className="glass-dark absolute left-5 top-5 flex size-24 flex-col items-center justify-center gap-1 rounded-full text-[11.5px] text-white transition-transform hover:scale-105"
          >
            <ArrowUpLeft size={16} />
            جزئیات بیشتر
          </a>
        </div>

        <button
          type="button"
          onClick={() => setA((a + 1) % svcList.length)}
          className="relative hidden overflow-hidden rounded-[24px] lg:col-span-3 lg:block"
          aria-label={`خدمت بعدی: ${next.title}`}
        >
          <Image
            src={getMedia2(next.image).src}
            alt=""
            fill
            sizes="22vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
            style={{ objectPosition: getMedia2(next.image).focal }}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-white/85 px-4 py-2 text-[13px]">بعدی: {next.title}</span>
        </button>
      </div>
    </section>
  );
}

/* ── 4. Academy (reference: "Latest product launch") ───────── */
export function Academy2() {
  const [c, setC] = useState(0);
  const course = courses[c];
  const img = getMedia2(course.image);
  const ring = "VIDA BEAUTY ACADEMY • هنر زیبایی را یاد بگیر • VIDA BEAUTY ACADEMY • آموزش تخصصی PMU • ";
  return (
    <section id="academy" aria-labelledby="ac2-title" className={`${wrap} scroll-mt-4 py-16 lg:py-24`}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <Title id="ac2-title">
          دوره‌های جدید آکادمی
          <br />
          <b className="font-extrabold">ثبت‌نام آغاز شد</b>!
        </Title>
        <div
          role="tablist"
          aria-label="دوره‌ها"
          className="no-scrollbar -mx-5 flex max-w-full gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0"
        >
          {courses.map((x, k) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={c === k}
              onClick={() => setC(k)}
              className={`h-10 flex-none rounded-full border px-5 text-[13px] transition-colors ${
                c === k ? "border-[#1c1717] bg-[#1c1717] text-white" : "border-[#1c1717]/25 hover:bg-[#f8efec]"
              }`}
            >
              {x.title.replace("دوره ", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid items-center gap-10 lg:mt-6 lg:grid-cols-12">
        <div className="order-3 lg:order-none lg:col-span-3">
          <p className="max-w-[16rem] text-[14px] leading-7 text-[#5a5250]">
            هنر زیبایی را یاد بگیر؛ آموزش تخصصی با تمرکز بر مهارت، ظرافت و اجرای حرفه‌ای.
          </p>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setC((c - 1 + courses.length) % courses.length)}
              aria-label="دوره قبلی"
              className="flex h-9 w-12 items-center justify-center rounded-full bg-[#f1ebe9]"
            >
              <ArrowR size={16} />
            </button>
            <button
              type="button"
              onClick={() => setC((c + 1) % courses.length)}
              aria-label="دوره بعدی"
              className="flex h-9 w-12 items-center justify-center rounded-full bg-[#1c1717] text-white"
            >
              <ArrowL size={16} />
            </button>
          </div>
          <div className="mt-10 flex gap-3">
            {courses
              .filter((_, k) => k !== c)
              .map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setC(courses.indexOf(x))}
                  aria-label={x.title}
                  className="relative h-24 w-14 overflow-hidden rounded-full"
                >
                  <Image
                    src={getMedia2(x.image).src}
                    alt=""
                    fill
                    sizes="60px"
                    className="object-cover"
                    style={{ objectPosition: getMedia2(x.image).focal }}
                  />
                </button>
              ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[420px] lg:col-span-5">
          <span aria-hidden className="absolute inset-0 rounded-full border border-[#1c1717]/10" />
          <span aria-hidden className="absolute inset-[6%] rounded-full border border-[#1c1717]/10" />
          <svg
            viewBox="0 0 200 200"
            direction="ltr"
            className="spin-slow absolute inset-[9%] size-[82%]"
            style={{ direction: "ltr" }}
            aria-hidden
          >
            <defs>
              <path id="ring" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
            </defs>
            <text fontSize="7.4" letterSpacing="0.9" fill="#6f4541" fontFamily="Vazirmatn" direction="ltr">
              <textPath href="#ring" textLength="536" lengthAdjust="spacing">
                {ring}
              </textPath>
            </text>
          </svg>
          <div key={course.id} className="anim-fade absolute inset-[17%] overflow-hidden rounded-full">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="320px"
              className="object-cover"
              style={{ objectPosition: img.focal }}
            />
          </div>
        </div>

        <div key={course.id} className="anim-fade lg:col-span-4">
          <p className="text-[24px] font-light leading-9 lg:text-[28px]">{course.title}</p>
          <p className="text-[13px] tracking-wide text-[#847a77]" dir="ltr" style={{ textAlign: "right" }}>
            {course.latin}
          </p>
          <p className="mt-4 text-[14px] leading-7 text-[#5a5250]">{course.summary}</p>
          <p className="mt-5 text-[26px] font-bold">
            {toman(course.price)} <span className="text-[11px] font-normal text-[#847a77]">(شهریه دمو)</span>
          </p>
          <p className="mt-1 text-[13px] text-[#847a77]">
            {course.format} · {certificate.label}
          </p>
          <div className="mt-6">
            <Pill href={`tel:${site.phone}`}>
              ثبت‌نام و مشاوره <Phone size={15} />
            </Pill>
          </div>
        </div>
      </div>

      {/* Tools & certificate — photos from the client's PIC folder + a designed certificate */}
      <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:mt-24 lg:grid-cols-12 lg:items-end lg:gap-5">
        <div className="sm:col-span-2 lg:col-span-3 lg:self-center">
          <p data-reveal className="text-[22px] font-light leading-9 lg:text-[26px]">
            ابزار حرفه‌ای، آموزش اصولی
            <br />
            <b className="font-extrabold">و گواهی پایان دوره</b>
          </p>
          <p data-reveal className="mt-3 max-w-[16rem] text-[14px] leading-7 text-[#5a5250]">
            از آنالیز تناسب چهره و اندازه‌گیری فرم تا اجرا و مراقبت؛ هر مرحله با ابزار استاندارد و زیر نظر مربی.
          </p>
        </div>
        {[
          ["ac-tools", "اندازه‌گیری و طراحی فرم"],
          ["ac-phone", "آنالیز تناسب چهره"],
          ["ac-magazine", "ابزار و مراقبت"],
        ].map(([k, label], idx) => (
          <figure key={k} className={`lg:col-span-2 ${idx === 1 ? "lg:-translate-y-8" : ""}`}>
            <Figure set="demo2" name={k} ratio="3/4" sizes="(min-width:1024px) 16vw, 45vw" delay={idx * 90} />
            <figcaption className="mt-2 text-[12.5px] text-[#847a77]">{label}</figcaption>
          </figure>
        ))}
        <div className="sm:col-span-2 lg:col-span-3" data-reveal>
          <div className="mx-auto max-w-[300px] -rotate-3 rounded-[18px] bg-[#fffaf6] p-3 shadow-[0_34px_70px_-34px_rgba(111,69,65,.6)] ring-1 ring-[#eadad3] transition-transform duration-700 hover:rotate-0">
            <div className="rounded-[12px] border border-[#d6a097]/70 px-4 py-5 text-center outline outline-1 outline-offset-[5px] outline-[#d6a097]/30">
              <Image src="/brand/vida-logo-256.webp" alt="" width={44} height={44} className="mx-auto size-11" />
              <p className="mt-2 text-[9px] tracking-[0.3em] text-[#8f544c]" dir="ltr">
                VIDA BEAUTY ACADEMY
              </p>
              <p className="mt-3 text-[19px] font-extrabold text-[#1c1717]">گواهی پایان دوره</p>
              <p className="text-[10px] tracking-[0.18em] text-[#847a77]" dir="ltr">
                CERTIFICATE OF COMPLETION
              </p>
              <p className="mt-4 text-[11px] text-[#847a77]">این گواهی به</p>
              <p className="mx-auto mt-1 w-40 border-b border-dashed border-[#d6a097] pb-1 text-[14px] text-[#5a5250]">
                [نام هنرجو]
              </p>
              <p className="mt-3 text-[11px] text-[#847a77]">برای گذراندن موفق</p>
              <p key={course.id} className="anim-fade mt-1 text-[14px] font-bold text-[#6f4541]">
                {course.title}
              </p>
              <div className="mt-5 flex items-end justify-between text-[10px] text-[#847a77]">
                <span className="w-20 border-t border-[#1c1717]/30 pt-1">[امضای مربی]</span>
                <span className="flex size-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#f6ddd7,#d6a097)] text-[9px] font-bold text-[#6f4541] shadow-inner">
                  VIDA
                </span>
                <span className="w-20 border-t border-[#1c1717]/30 pt-1">سبزوار</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-[#847a77]">نمونه طراحی گواهی — دمو · {certificate.label}</p>
        </div>
      </div>
    </section>
  );
}

/* ── 5. Transformation carousel ───────────────────────────── */
export function Transform2() {
  const [a, setA] = useState(0);
  const n = transformations.length;
  const order = [0, 1, 2].map((k) => transformations[(a + k) % n]);
  return (
    <section id="transform" aria-labelledby="tr2-title" className={`${wrap} scroll-mt-4 py-16 lg:py-24`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Title id="tr2-title">
          تحول <b className="font-extrabold">زیبایی</b>
          <br />
          در انتظار شماست
        </Title>
        <Pill href={`${D2}/booking`}>
          رزرو مشاوره <ArrowUpLeft size={14} />
        </Pill>
      </div>

      <div className="mt-10 flex h-[420px] gap-3 lg:mt-14 lg:h-[400px]">
        {order.map((t, k) => {
          const m = getMedia2(t.key);
          const wide = k === 0;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setA((a + k) % n)}
              className={`group relative overflow-hidden rounded-[24px] text-right transition-[flex-grow] duration-700 ease-[var(--ease-lux)] ${
                wide ? "flex-[4] lg:flex-[3.2]" : k === 1 ? "flex-[1.2] lg:flex-1" : "hidden flex-1 sm:block"
              }`}
              aria-label={t.title}
              aria-pressed={wide}
            >
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes={wide ? "(min-width:1024px) 55vw, 75vw" : "20vw"}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ objectPosition: m.focal }}
              />
              {wide && (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#3d2321]/80 via-[#3d2321]/10 to-transparent"
                  />
                  <span className="glass-dark absolute left-5 top-5 flex size-20 flex-col items-center justify-center gap-1 rounded-full text-[11px] text-white lg:size-24">
                    <ArrowUpLeft size={16} />
                    جزئیات بیشتر
                  </span>
                  <span
                    key={t.key}
                    className="anim-rise absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4 text-white lg:inset-x-7 lg:bottom-7"
                  >
                    <span>
                      <span className="block text-[20px] font-bold lg:text-[24px]">{t.title}</span>
                      <span className="mt-1 block max-w-xs text-[13px] leading-6 text-white/80">{t.text}</span>
                    </span>
                    <span className="glass flex h-9 items-center gap-2 rounded-full px-4 text-[12px]">
                      <Flower size={13} /> {t.tag}
                    </span>
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-[11.5px] text-[#847a77]">نمونه تصویری دمو — نمونه‌کار واقعی Vida نیست</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setA((a - 1 + n) % n)}
            aria-label="قبلی"
            className="flex h-9 w-12 items-center justify-center rounded-full bg-[#f1ebe9]"
          >
            <ArrowR size={16} />
          </button>
          <button
            type="button"
            onClick={() => setA((a + 1) % n)}
            aria-label="بعدی"
            className="flex h-9 w-12 items-center justify-center rounded-full bg-[#1c1717] text-white"
          >
            <ArrowL size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── 6. Catalogue with live search ────────────────────────── */
export function Catalogue2() {
  const [q, setQ] = useState("");
  const rail = useRef<HTMLUListElement>(null);
  // RTL: a negative scrollLeft moves forward (toward the end of the list)
  const step = (dir: 1 | -1) => rail.current?.scrollBy({ left: -dir * rail.current.clientWidth, behavior: "smooth" });
  const [liked, setLiked] = useState<string[]>([]);
  const list = useMemo(() => {
    const t = q.trim();
    return svcList.filter(
      (s) => !t || s.title.includes(t) || s.latin.toLowerCase().includes(t.toLowerCase()) || s.short.includes(t),
    );
  }, [q]);
  return (
    <section id="catalogue" aria-labelledby="cat2-title" className={`${wrap} scroll-mt-4 py-16 lg:py-24`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Title id="cat2-title">
          <b className="font-extrabold">کاتالوگ</b> خدمات
        </Title>
        <label className="flex h-12 w-full items-center gap-2 rounded-full border border-[#1c1717]/20 px-4 sm:w-72">
          <Search size={17} className="text-[#847a77]" />
          <span className="sr-only">جستجوی خدمات</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی خدمت…"
            className="h-full flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#a39a97]"
          />
        </label>
      </div>

      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-5">
        <div className="flex flex-col justify-between gap-6 lg:col-span-3">
          <p className="max-w-[15rem] text-[14px] leading-7 text-[#5a5250]">
            قیمت و مدت هر خدمت را ببینید و در چند لحظه نوبت خود را رزرو کنید.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Pill href={`${D2}/booking`}>
              رزرو نوبت <ArrowUpLeft size={14} />
            </Pill>
            {list.length > 3 && (
              <span className="hidden gap-2 lg:flex">
                <button type="button" onClick={() => step(-1)} aria-label="خدمات قبلی" className="flex size-11 items-center justify-center rounded-full border border-[#1c1717]/20 hover:border-[#1c1717]">
                  <ArrowR size={16} />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="خدمات بعدی" className="flex size-11 items-center justify-center rounded-full bg-[#1c1717] text-white">
                  <ArrowL size={16} />
                </button>
              </span>
            )}
          </div>
        </div>
        <ul
          ref={rail}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:scroll-px-0 sm:px-0 lg:col-span-9"
          aria-live="polite"
        >
          {list.map((s) => {
            const m = getMedia2(s.image);
            const on = liked.includes(s.slug);
            return (
              <li
                key={s.slug}
                className="w-[78vw] flex-none snap-start rounded-[22px] bg-[#f6f2f1] p-2.5 sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-1.5rem)/3)]"
              >
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-[18px]">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(min-width:1024px) 22vw, 70vw"
                    className="object-cover"
                    style={{ objectPosition: m.focal }}
                  />
                  <button
                    type="button"
                    onClick={() => setLiked((l) => (on ? l.filter((x) => x !== s.slug) : [...l, s.slug]))}
                    aria-pressed={on}
                    aria-label={on ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
                    className="absolute left-2.5 top-2.5 flex size-9 items-center justify-center rounded-full bg-white/80 text-[#b77c73] backdrop-blur"
                  >
                    <Heart size={16} filled={on} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-3">
                  <div>
                    <p className="text-[16px] font-bold">{s.title}</p>
                    <p className="text-[12.5px] text-[#5a5250]">{toman(s.price)}</p>
                  </div>
                  <Link
                    href={`${D2}/booking?service=${s.slug}`}
                    aria-label={`رزرو ${s.title}`}
                    className="flex size-10 items-center justify-center rounded-full bg-[#1c1717] text-white"
                  >
                    <ArrowUpLeft size={15} />
                  </Link>
                </div>
              </li>
            );
          })}
          {!list.length && <li className="py-10 text-[14px] text-[#847a77]">خدمتی با «{q}» پیدا نشد.</li>}
        </ul>
      </div>
      <p className="mt-4 text-[11.5px] text-[#847a77]">قیمت‌ها نمونه دمو هستند.</p>
    </section>
  );
}

/* ── 7. Reviews ───────────────────────────────────────────── */
export function Reviews2() {
  const faces = ["hs-2", "hs-1", "hs-3"];
  const items = testimonials.filter((t) => t.visible).slice(0, 4);
  const place = [
    "lg:col-start-2 lg:row-start-1",
    "lg:col-start-3 lg:row-start-1",
    "lg:col-start-1 lg:row-start-2",
    "lg:col-start-2 lg:row-start-2",
  ];
  return (
    <section id="reviews" aria-labelledby="rv2-title" className={`${wrap} scroll-mt-4 py-16 lg:py-24`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr_1fr] lg:gap-4">
        <div className="lg:col-span-1 lg:row-span-2">
          <Title id="rv2-title">
            نظرات <b className="font-extrabold">درخشان</b>
          </Title>
          <p className="mt-3 max-w-[15rem] text-[14px] leading-7 text-[#5a5250]">
            تجربه مشتریان Vida؛ متن‌های این بخش نمونه دمو هستند.
          </p>
          <div className="mt-6 flex items-center" dir="ltr" style={{ justifyContent: "flex-end" }}>
            {faces.map((f, k) => (
              <span
                key={f}
                className="relative -ml-3 size-12 overflow-hidden rounded-full border-2 border-white first:ml-0"
                style={{ zIndex: 3 - k }}
              >
                <Image
                  src={getMedia2(f).src}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                  style={{ objectPosition: getMedia2(f).focal }}
                />
              </span>
            ))}
            <span className="-ml-3 flex size-12 items-center justify-center rounded-full border-2 border-white bg-[#1c1717] text-[11px] text-white">
              دمو
            </span>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {items.map((t, k) => (
            <li
              key={t.id}
              data-reveal
              style={{ ["--d" as string]: `${k * 90}ms` }}
              className={`rounded-[22px] p-5 ${k % 3 === 1 || k === 2 ? "bg-[#fbe9e6]" : "bg-[#f6f2f1]"} ${place[k]}`}
            >
              <p className="text-[14px] leading-7 text-[#1c1717]">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="relative size-10 overflow-hidden rounded-full">
                  <Image src={getMedia2(faces[k % 3]).src} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-[13px] font-bold">{t.author}</span>
                  <span className="block text-[12px] text-[#847a77]">{t.service}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── 8. Footer inside the card ────────────────────────────── */
export function Footer2() {
  return (
    <footer id="contact" className={`${wrap} scroll-mt-4 border-t border-[#1c1717]/10 pb-24 pt-12 lg:pb-10`}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-2 text-[18px] font-bold" dir="ltr" style={{ justifyContent: "flex-end" }}>
            VidaBeauty
            <Image src="/brand/vida-logo-256.webp" alt="" width={32} height={32} className="size-8" />
          </p>
          <p className="mt-4 text-[15px] leading-7">
            زیبایی، یک هنر است.
            <br />
            <span className="text-[#5a5250]">خدمات تخصصی PMU در سبزوار.</span>
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] lg:col-span-4 lg:grid-cols-1">
          {[
            ["#services", "خدمات"],
            ["#academy", "آکادمی"],
            ["#transform", "نمونه‌کارها"],
            [`${D2}/booking`, "رزرو نوبت"],
            [`${D2}/account`, "حساب کاربری"],
          ].map(([h, l]) => (
            <li key={h}>
              {h.startsWith("#") ? (
                <a href={h} className="hover:text-[#8f544c]">
                  {l}
                </a>
              ) : (
                <Link href={h} className="hover:text-[#8f544c]">
                  {l}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="flex gap-2 lg:col-span-3 lg:justify-end">
          <a
            href={site.instagram.url}
            aria-label="اینستاگرام (موقت)"
            className="flex size-10 items-center justify-center rounded-full bg-[#f6f2f1]"
          >
            <Insta size={17} />
          </a>
          <a
            href={`tel:${site.phone}`}
            aria-label="تماس"
            className="flex size-10 items-center justify-center rounded-full bg-[#1c1717] text-white"
          >
            <Phone size={17} />
          </a>
          <a
            href={site.map.directionsUrl}
            target="_blank"
            rel="noopener"
            aria-label="مسیریابی"
            className="flex size-10 items-center justify-center rounded-full bg-[#f6f2f1]"
          >
            <Pin size={17} />
          </a>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-3 text-[12.5px] text-[#5a5250] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
          <a href={`tel:${site.phone}`}>{faNum(site.phone)}</a>
          <span>{site.address}</span>
        </div>
        <span>© Vida Beauty · نسخه نمایشی — تصاویر و قیمت‌ها موقت هستند</span>
      </div>
    </footer>
  );
}
