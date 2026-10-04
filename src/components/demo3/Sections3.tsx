import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { services } from "@/data/services";
import { specialists } from "@/data/specialists";
import { faq, testimonials } from "@/data/content";
import { site } from "@/data/site";
import { D3 } from "@/lib/demo";
import { durationLabel, faNum, toman } from "@/lib/format";
import { ArrowLeft } from "@/components/ui/Icons";
import { Sparkle } from "./Ornaments";
import { tag3 } from "./data3";
import { Reviews3Slider } from "./Reviews3";

const W = "mx-auto max-w-[1240px] px-5 lg:px-10";

/* ── Hero: two-line title, arch portrait ───────────────────── */
export function Hero3() {
  return (
    <section aria-labelledby="h3-title" className={`${W} relative grid items-center gap-12 pb-20 pt-6 lg:grid-cols-12 lg:pb-28 lg:pt-12`}>
      <div className="relative lg:col-span-6">
        <h1 id="h3-title" className="anim-rise text-[clamp(38px,4.4vw,60px)] leading-[1.3] text-espresso">
          هنر ابرو و لب،
          <br />
          با امضای{" "}
          <span className="nue-latin whitespace-nowrap text-[0.86em] text-champagne" dir="ltr">
            Vida Beauty
          </span>
        </h1>
        <p className="anim-rise mt-6 max-w-md text-[16px] leading-8 text-charcoal" style={{ ["--d" as string]: "160ms" }}>
          میکروبلیدینگ، فیبروز، ویبروز، شیدینگ لب و خط چشم؛ طراحی‌شده برای چهره شما، در سبزوار.
        </p>
        <div className="anim-rise mt-9 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "280ms" }}>
          <Link href={`${D3}/booking`} className="btn btn-primary whitespace-nowrap">
            رزرو نوبت
          </Link>
          <a href="#rows" className="btn btn-ghost whitespace-nowrap text-espresso">
            خدمات و قیمت‌ها
          </a>
        </div>
        <p className="anim-rise mt-5 text-[13px] text-muted" style={{ ["--d" as string]: "360ms" }}>
          پرداخت مستقیم یا ۴ قسط با اسنپ‌پی و دی‌جی‌پی
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:col-start-8">
        <span className="nue-arch-line -inset-x-5 -bottom-0 -top-8" />
        <Sparkle size={30} className="absolute -top-12 left-6 text-espresso" />
        <Figure
          name="hero"
          set="demo3"
          priority
          reveal={false}
          ratio="4/5"
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="nue-arch anim-settle !rounded-b-none [&>.fig-clip]:rounded-t-full"
          quality={90}
        />
      </div>
    </section>
  );
}

/* ── Dark band: real facts + services intro ────────────────── */
export function Intro3() {
  const facts = [
    [faNum(services.length), "خدمت تخصصی"],
    [faNum(specialists.length), "متخصص"],
    [faNum(15), "دقیقه فاصله آرام بین نوبت‌ها"],
  ];
  return (
    <section aria-labelledby="svc3-title" className="nue-dark rounded-[40px] lg:rounded-[56px]" id="services">
      <div className={`${W} pb-20 pt-14 lg:pb-24 lg:pt-20`}>
        <dl className="grid grid-cols-3 gap-4 border-b border-on-dark/15 pb-12 text-center">
          {facts.map(([v, k]) => (
            <div key={k}>
              <dd className="text-[clamp(34px,6vw,60px)] font-light leading-none">{v}</dd>
              <dt className="mt-3 text-[12px] text-on-dark/65 sm:text-[13px]">{k}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid items-end gap-12 lg:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="svc3-title" className="text-[clamp(36px,4.6vw,56px)] leading-[1.3]">
              خدمات{" "}
              <span className="nue-latin text-[0.72em] text-tan-light" dir="ltr">
                Services
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-8 text-on-dark/80">
              هر خدمت با مشاوره و طراحی متناسب با فرم چهره آغاز می‌شود؛ از
              <strong className="font-medium text-on-dark"> میکروبلیدینگ</strong> و <strong className="font-medium text-on-dark">فیبروز ابرو</strong> تا
              <strong className="font-medium text-on-dark"> شیدینگ لب</strong> و <strong className="font-medium text-on-dark">خط چشم</strong>.
            </p>
            <a href="#rows" className="btn mt-9 whitespace-nowrap bg-champagne text-surface hover:bg-accent-deep">
              مشاهده خدمات
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-[360px] lg:col-span-4 lg:col-start-9">
            <span className="nue-arch-line -inset-x-4 -top-6 bottom-0 !border-on-dark/40" />
            <Figure name="services" set="demo3" ratio="3/4" sizes="(min-width: 1024px) 28vw, 80vw" className="!rounded-b-none rounded-t-full [&>.fig-clip]:rounded-t-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Service rows (zig-zag, details beside the photo, nothing on it) ── */
export function Rows3() {
  return (
    <section aria-label="فهرست خدمات" id="rows" className={`${W} space-y-20 pb-24 pt-20 lg:space-y-28 lg:pb-32 lg:pt-28`}>
      {services.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <article key={s.slug} className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
            <div className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : "md:col-start-2"}`}>
              <Figure name={s.image} set="demo3" ratio="1/1" sizes="(min-width: 768px) 36vw, 88vw" className="!rounded-[48px]" fx={["sheen"]} />
            </div>
            <div className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-2" : "md:col-start-8"}`}>
              <p className="text-[12px] tracking-wide text-gold-ink">{tag3[s.slug]}</p>
              <h3 className="nue-display mt-3 text-[clamp(30px,3.4vw,44px)] leading-[1.3] text-espresso">
                {s.title}
                <span className="nue-latin mt-1 block text-[0.6em] text-faint" dir="ltr" style={{ textAlign: "right" }}>
                  {s.latin}
                </span>
              </h3>
              <p className="mt-5 max-w-md text-[15px] leading-8 text-charcoal">{s.short}</p>
              <dl className="mt-6 flex max-w-md divide-x divide-x-reverse divide-line border-y border-line text-[13px]">
                <div className="flex-1 py-3">
                  <dt className="text-muted">مدت</dt>
                  <dd className="mt-0.5 text-espresso">{durationLabel(s.durationMin)}</dd>
                </div>
                <div className="flex-1 py-3 pr-4">
                  <dt className="text-muted">هزینه (نمونه)</dt>
                  <dd className="mt-0.5 text-espresso">{toman(s.price)}</dd>
                </div>
              </dl>
              <Link href={`${D3}/booking?service=${s.slug}`} className="btn btn-primary mt-7 min-h-11 whitespace-nowrap px-6 text-[13px]">
                رزرو {s.title}
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/* ── Reviews (dark card) ──────────────────────────────────── */
export function Reviews3() {
  const items = testimonials.filter((t) => t.visible !== false);
  return (
    <section aria-labelledby="rev3-title" id="reviews" className="nue-dark rounded-[40px] lg:rounded-[56px]">
      <div className={`${W} py-16 lg:py-24`}>
        <h2 id="rev3-title" className="text-[clamp(34px,4.6vw,54px)] leading-[1.3]">
          نظر مشتریان
        </h2>
        <Reviews3Slider items={items.map((t) => ({ id: t.id, quote: t.quote, author: t.author, service: t.service }))} />
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────── */
export function Faq3() {
  return (
    <section aria-labelledby="faq3-title" className={`${W} grid gap-10 py-20 lg:grid-cols-12 lg:py-28`}>
      <div className="lg:col-span-4">
        <h2 id="faq3-title" className="text-[clamp(32px,4vw,48px)] leading-[1.3]">
          سؤالی دارید؟
        </h2>
        <p className="mt-3 text-[15px] leading-8 text-charcoal">پاسخ پرتکرارترین پرسش‌ها؛ برای باقی سؤال‌ها تماس بگیرید.</p>
      </div>
      <div className="space-y-3 lg:col-span-7 lg:col-start-6">
        {faq.slice(0, 5).map((f) => (
          <details key={f.q} className="group rounded-[28px] border border-line-strong bg-surface/50 px-6 py-4 open:bg-surface/80">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="text-[22px] font-light transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[14px] leading-8 text-charcoal">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ── Contact: one ruled ledger instead of three equal cards ── */
export function Contact3() {
  const rows = [
    { k: "تلفن", note: "رزرو و تغییر زمان نوبت", v: faNum(site.phone), href: `tel:${site.phone}`, ltr: true, cta: "تماس" },
    { k: "نشانی", note: site.hoursText, v: site.address, href: site.map.directionsUrl, cta: "مسیریابی" },
    { k: "اینستاگرام", note: "آیدی موقت دمو", v: site.instagram.handle, href: site.instagram.url, ltr: true, cta: "مشاهده" },
  ];
  return (
    <section aria-labelledby="ct3-title" id="contact" className={`${W} pb-10 pt-6 lg:pt-10`}>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="ct3-title" className="text-[clamp(30px,3.8vw,46px)] leading-[1.3]">
            در ارتباط باشیم
          </h2>
          <p className="mt-3 text-[15px] text-charcoal">برای مشاوره پیش از رزرو هم می‌توانید تماس بگیرید.</p>
        </div>
        <ul className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6">
          {rows.map((r) => (
            <li key={r.k} className="flex flex-wrap items-center gap-x-6 gap-y-1 py-5">
              <span className="w-24 shrink-0 text-[13px] text-muted">{r.k}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] text-espresso" dir={r.ltr ? "ltr" : undefined} style={r.ltr ? { textAlign: "right" } : undefined}>
                  {r.v}
                </span>
                <span className="block text-[12px] text-muted">{r.note}</span>
              </span>
              <a href={r.href} className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] text-gold-ink hover:text-espresso">
                {r.cta} <ArrowLeft size={14} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
