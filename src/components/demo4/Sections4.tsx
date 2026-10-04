import Image from "next/image";
import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { Accordion } from "@/components/ui/Accordion";
import { faq, testimonials } from "@/data/content";
import { site } from "@/data/site";
import { getMedia4 } from "@/data/media4";
import { D4 } from "@/lib/demo";
import { durationLabel, faNum, toman } from "@/lib/format";
import { nav4, services4 } from "./data4";

const W = "mx-auto max-w-[1320px] px-4 lg:px-8";
const H2 = "text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.35] tracking-[-0.02em]";

/* ── Analysis: zig-zag, photo left, findings as a quiet list ─── */
const findings = [
  { label: "فرم ابرو", note: "قوس طبیعی، تقارن خوب" },
  { label: "خط چشم", note: "مناسب خط ظریف و کشیده" },
  { label: "لب", note: "حجم متعادل، رنگ ملایم" },
] as const;

export function Analysis4() {
  return (
    <section id="analysis" aria-labelledby="an4-title" className={`${W} py-16 lg:py-24`}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Figure name="analysis" set="demo4" ratio="4/5" sizes="(min-width: 1024px) 46vw, 100vw" />
        </div>
        <div className="lg:col-span-5">
          <h2 id="an4-title" className={H2}>
            پیش از هر خدمت، چهره شما را می‌خوانیم.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-8 text-charcoal">
            متخصص Vida فرم صورت، تقارن ابروها، خط مژه و تناسب لب‌ها را بررسی می‌کند تا طراحی دقیقاً برای شما باشد، نه یک الگوی تکراری.
          </p>
          <dl className="mt-10 divide-y divide-line rounded-[28px] bg-cream px-6">
            {findings.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-[15px] font-medium">{f.label}</dt>
                <dd className="text-[13px] text-muted">{f.note}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[12px] text-faint">نمونه یادداشت آنالیز، نسخه نمایشی</p>
          <Link href={`${D4}/booking`} className="btn btn-primary mt-8 px-7">
            رزرو جلسه مشاوره
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Services: image first, caption below (no labels on photos) ── */
export function Services4() {
  return (
    <section id="services" aria-labelledby="sv4-title" className="pb-20 pt-10 lg:pb-28 lg:pt-14">
      <div className={`${W} flex flex-wrap items-end justify-between gap-4`}>
        <h2 id="sv4-title" className={H2}>
          خدمات تخصصی Vida
        </h2>
        <p className="max-w-sm text-[14px] leading-7 text-charcoal">هر خدمت با مشاوره و طراحی روی پوست آغاز می‌شود. برای رزرو، خدمت را انتخاب کنید.</p>
      </div>
      <ul className="snap-x mt-10 flex gap-5 overflow-x-auto px-4 pb-4 lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-4 lg:overflow-visible lg:px-8">
        {services4.map((s, k) => (
          <li key={s.slug} className={`w-[72%] shrink-0 sm:w-[44%] lg:w-auto ${k % 2 ? "lg:mt-16" : ""}`}>
            <Link href={`${D4}/booking?service=${s.slug}`} className="nuve-card group block">
              <div className="overflow-hidden rounded-[28px]">
                <Figure name={s.image} set="demo4" ratio="3/4" sizes="(min-width: 1024px) 25vw, 72vw" fx={["sheen"]} />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3 px-1">
                <span>
                  <span className="block text-[17px] font-medium">{s.title}</span>
                  <span className="mt-1 block text-[12px] text-muted">
                    {durationLabel(s.durationMin)} · {toman(s.price)}
                  </span>
                </span>
                <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-[14px] transition-colors group-hover:border-espresso group-hover:bg-espresso group-hover:text-white">
                  ←
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className={`${W} mt-4 text-[12px] text-muted`}>قیمت‌ها نمونه هستند.</p>
    </section>
  );
}

/* ── Reviews: one featured quote + two quieter ones ─────────── */
export function Reviews4() {
  const [lead, ...rest] = testimonials.filter((t) => t.visible !== false).slice(0, 3);
  const who = (t: (typeof testimonials)[number]) => (
    <div className="mt-6 flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-full bg-tint text-[14px] font-medium text-accent-deep">
        {t.author.replace(/[[\]]/g, "").trim().charAt(0) || "؟"}
      </span>
      <span>
        <span className="block text-[14px] font-medium">{t.author}</span>
        <span className="block text-[12px] text-muted">{t.service}</span>
      </span>
    </div>
  );
  return (
    <section id="reviews" aria-labelledby="rv4-title" className={`${W} py-20 lg:py-32`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="rv4-title" className={H2}>
          تجربه مشتریان
        </h2>
        <span className="text-[12px] text-muted">نظرات نمونه برای نسخه نمایشی</span>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-12">
        {lead && (
          <figure className="rounded-[28px] bg-cream p-8 lg:col-span-7 lg:p-12">
            <blockquote className="text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.7] tracking-[-0.01em]">«{lead.quote}»</blockquote>
            <figcaption>{who(lead)}</figcaption>
          </figure>
        )}
        <div className="grid gap-5 lg:col-span-5">
          {rest.map((t) => (
            <figure key={t.id} className="rounded-[28px] border border-line p-7">
              <blockquote className="text-[15px] leading-8 text-wine-soft">«{t.quote}»</blockquote>
              <figcaption>{who(t)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────── */
export function Faq4() {
  return (
    <section id="faq" aria-labelledby="fq4-title" className={`${W} grid gap-10 py-14 lg:grid-cols-12 lg:py-20`}>
      <div className="lg:col-span-4">
        <h2 id="fq4-title" className={H2}>
          سؤالات پرتکرار
        </h2>
        <p className="mt-4 text-[14px] leading-7 text-charcoal">
          پاسخ سؤال خود را پیدا نکردید؟{" "}
          <a href={`tel:${site.phone}`} className="underline underline-offset-4" dir="ltr">
            {faNum(site.phone)}
          </a>
        </p>
      </div>
      <div className="lg:col-span-7 lg:col-start-6">
        <Accordion items={faq.filter((f) => !f.q.includes("فیبروز")).slice(0, 6)} />
      </div>
    </section>
  );
}

/* ── CTA + footer ────────────────────────────────────────────── */
export function Footer4() {
  const cta = getMedia4("cta");
  return (
    <footer className={`${W} pb-8 pt-6`}>
      <div className="nuve-lilac relative overflow-hidden rounded-[28px]">
        <div className="grid items-center lg:grid-cols-2">
          <div className="px-6 py-12 lg:px-14 lg:py-16">
            <p className="text-[clamp(30px,3.6vw,48px)] font-medium leading-tight tracking-[-0.02em]">
              اولین قدم، یک
              <br />
              مشاوره دقیق است.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`${D4}/booking`} className="btn btn-primary px-7">
                رزرو مشاوره
              </Link>
              <a href={`tel:${site.phone}`} className="btn btn-ghost px-6 text-espresso" dir="ltr">
                {faNum(site.phone)}
              </a>
            </div>
          </div>
          <div className="relative hidden h-full min-h-[360px] lg:block">
            <Image
              src={cta.src}
              alt={cta.alt}
              fill
              sizes="40vw"
              placeholder={cta.blur ? "blur" : "empty"}
              blurDataURL={cta.blur}
              className="object-cover [mask-image:linear-gradient(to_left,black_60%,transparent)]"
              style={{ objectPosition: cta.focal }}
            />
          </div>
        </div>
      </div>
      {/* Ft5-style close: the statement panel above carries the page; one quiet meta row below */}
      <div className="mt-8 flex flex-col gap-5 border-t border-line px-2 pt-6 text-[13px] text-charcoal lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="nuve-latin text-[17px] font-medium text-espresso" dir="ltr">
            Vida Beauty
          </span>
          <span>{site.address}</span>
        </div>
        <nav aria-label="پیوندهای پایین صفحه">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[...nav4, { href: `${D4}/booking`, label: "رزرو آنلاین" }, { href: `${D4}/account`, label: "حساب کاربری" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="whitespace-nowrap transition-colors hover:text-espresso">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mt-4 px-2 text-[12px] text-muted">
        © {faNum(new Date().getFullYear())} Vida Beauty · نسخه نمایشی؛ تصاویر، قیمت‌ها و نظرات موقت هستند.
      </p>
    </footer>
  );
}
