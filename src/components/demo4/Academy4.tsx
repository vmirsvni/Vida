import Image from "next/image";
import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { Accordion } from "@/components/ui/Accordion";
import { site } from "@/data/site";
import { D4 } from "@/lib/demo";
import { faNum, toman } from "@/lib/format";
import { academyCourses4, academyFaq4, academySteps4, graduates4 } from "./data4";

const W = "mx-auto max-w-[1320px] px-4 lg:px-8";
const H2 = "text-[clamp(30px,3.6vw,46px)] font-medium tracking-[-0.02em]";

/* Vida Academy — microblading & fibroze training with an international certificate. */
export function Academy4() {
  return (
    <>
      <Hero />
      <Courses />
      <Steps />
      <Certificate />
      <Graduates />
      <AcademyFaq />
    </>
  );
}

function Hero() {
  return (
    <section aria-labelledby="ac4-title" className={`${W} pb-14 pt-2 lg:pb-20`}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h1 id="ac4-title" className=" text-[clamp(38px,5vw,64px)] font-medium leading-[1.25] tracking-[-0.02em] text-espresso">
            آکادمی ویدا
          </h1>
          <p className="mt-4 text-[clamp(18px,1.8vw,22px)] leading-9 text-wine-soft">
            آموزش حرفه‌ای میکروبلیدینگ و فیبروز ابرو، همراه با <b className="font-medium">مدرک بین‌المللی</b>.
          </p>
          <p className="mt-4 max-w-md text-[15px] leading-8 text-charcoal">
            همان تکنیک‌هایی که هر روز در سالن Vida اجرا می‌کنیم را، در گروه‌های کوچک و با تمرین واقعی روی مدل آموزش می‌دهیم.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-charcoal">
            {["آموزش عملی روی مدل", "حداکثر ۴ هنرجو", "مدرک بین‌المللی"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="text-champagne">✓</span> {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`tel:${site.phone}`} className="btn btn-primary px-7">
              مشاوره و ثبت‌نام
            </a>
            <a href="#courses" className="btn btn-ghost px-6 text-espresso">
              دوره‌ها
            </a>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <Figure name="ac-hero" ratio="3/2" sizes="(min-width: 1024px) 56vw, 100vw" priority className="rounded-[28px] max-sm:aspect-[4/3]" />
        </div>
      </div>
    </section>
  );
}

function Courses() {
  return (
    <section id="courses" aria-labelledby="cr4-title" className={`${W} py-14 lg:py-20`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="cr4-title" className={H2}>
            دوره‌های تخصصی ابرو
          </h2>
        </div>
        <p className="max-w-sm text-[14px] leading-7 text-charcoal">هر دو تکنیک را هم اجرا می‌کنیم و هم آموزش می‌دهیم؛ آنچه یاد می‌گیرید، تجربه واقعی سالن است.</p>
      </div>
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {academyCourses4.map((c) => (
          <li key={c.id} className="nuve-card flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
            <div className="relative">
              <Figure name={c.image} ratio="16/10" sizes="(min-width: 768px) 46vw, 100vw" fx={["sheen"]} />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex flex-wrap-reverse items-start justify-between gap-x-3 gap-y-2">
                <h3 className="text-[24px] font-medium">{c.title}</h3>
                <span className="mt-1 shrink-0 rounded-full border border-line-strong px-2.5 py-1 text-[11px] text-accent-deep">مدرک بین‌المللی</span>
              </div>
              <p className="nuve-latin mt-1 text-[13px] text-muted" dir="ltr" style={{ textAlign: "right" }}>
                {c.latin}
              </p>
              <p className="mt-3 text-[14px] leading-7 text-charcoal">{c.summary}</p>
              <ul className="mt-5 space-y-2">
                {c.syllabus.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-[13px] leading-6 text-wine-soft">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-champagne" /> {x}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-[12px]">
                <div>
                  <dt className="text-muted">مدت</dt>
                  <dd className="mt-1 text-[14px] text-espresso">{c.duration}</dd>
                </div>
                <div>
                  <dt className="text-muted">شهریه</dt>
                  <dd className="mt-1 text-[14px] text-espresso">{toman(c.price)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-[11px] text-faint">{c.format} · شهریه نمونه</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <a href={`tel:${site.phone}`} className="btn btn-primary min-h-11 px-5 text-[13px]">
                  ثبت‌نام دوره
                </a>
                {c.service && (
                  <Link href={`${D4}/booking?service=${c.service}`} className="btn nuve-btn-lilac min-h-11 px-5 text-[13px]">
                    رزرو خدمت
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Steps() {
  return (
    <section aria-labelledby="st4-title" className={`${W} py-14 lg:py-20`}>
      <div className="nuve-lilac grid overflow-hidden rounded-[28px] lg:grid-cols-2">
        <div className="px-6 py-12 lg:px-14 lg:py-16">
          <h2 id="st4-title" className={H2}>
            از اولین خط تا اولین مشتری
          </h2>
          <ol className="relative mt-10 space-y-6 border-r border-line-strong pr-6">
            {academySteps4.map((s, k) => (
              <li key={s.t} className="relative">
                <span className="nuve-latin absolute -right-[37px] top-0 flex size-6 items-center justify-center rounded-full bg-espresso text-[11px] text-white">
                  {k + 1}
                </span>
                <p className="text-[17px] font-medium">{s.t}</p>
                <p className="mt-1 text-[14px] leading-7 text-charcoal">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative min-h-[320px]">
          <div className="absolute inset-0">
            <Figure name="ac-train" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full !rounded-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Certificate() {
  return (
    <section aria-labelledby="ce4-title" className={`${W} py-14 lg:py-20`}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="ce4-title" className={H2}>
            مدرک بین‌المللی معتبر
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-8 text-charcoal">
            پس از پایان دوره و اجرای موفق روی مدل، مدرک بین‌المللی پایان دوره به نام شما صادر می‌شود؛ مدرکی که کار حرفه‌ای شما را
            از روز اول معتبرتر می‌کند.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {["صدور به نام هنرجو", "قابل ارائه در سالن و فضای مجازی", "همراه با ریز نمرات عملی", "پشتیبانی پس از دوره"].map((t) => (
              <li key={t} className="nuve-glass flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-espresso text-[11px] text-white">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {/* certificate mockup — no issuing institution named until confirmed */}
          <div className="relative mx-auto max-w-[560px] rotate-[-2deg] rounded-[28px] border border-line bg-surface p-3 shadow-[0_30px_60px_-40px_rgb(40_25_25_/_.2)]">
            <div className="rounded-2xl border border-line-strong px-6 py-8 text-center sm:px-10 sm:py-10" dir="ltr">
              <Image src="/brand/vida-logo-256.webp" alt="" width={52} height={52} className="mx-auto size-12" />
              <p className="nuve-latin mt-4 text-[11px] uppercase tracking-[0.35em] text-champagne">International Certificate</p>
              <p className="nuve-latin mt-3 text-[clamp(22px,3vw,30px)] font-medium text-espresso">Microblading & Fibroze</p>
              <p className="nuve-latin mt-5 text-[12px] text-muted">This is to certify that</p>
              <p className="mt-2 text-[22px] text-espresso" dir="rtl">نام هنرجو</p>
              <span className="mx-auto mt-2 block h-px w-40 bg-line-strong" />
              <p className="nuve-latin mt-5 text-[12px] leading-6 text-muted">has successfully completed the professional training at Vida Beauty Academy.</p>
              <div className="mt-8 flex items-end justify-between text-[10px] text-faint">
                <span className="nuve-latin">Sabzevar · Iran</span>
                <span className="flex size-14 items-center justify-center rounded-full border border-champagne text-[9px] uppercase tracking-widest text-champagne">Vida</span>
                <span className="nuve-latin">Signature</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-[11px] text-faint">نمونه طرح مدرک، نسخه نمایشی</p>
        </div>
      </div>
    </section>
  );
}

function Graduates() {
  return (
    <section aria-labelledby="gr4-title" className="py-14 lg:py-20">
      <div className={`${W} flex flex-wrap items-end justify-between gap-4`}>
        <div>
          <h2 id="gr4-title" className={H2}>
            فارغ‌التحصیلان آکادمی
          </h2>
        </div>
        <span className="text-[12px] text-muted">نمونه دمو؛ تصاویر و نام‌ها نمایشی هستند</span>
      </div>
      {/* mobile: swipe row · desktop: full 3×2 grid, no clipped cards */}
      <ul className="snap-x snap-mandatory mx-auto mt-10 flex max-w-[1320px] scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-8 lg:pb-0">
        {graduates4.map((g) => (
          <li key={g.img} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <figure className="nuve-card h-full overflow-hidden rounded-[28px] border border-line bg-surface">
              <Figure name={g.img} ratio="5/4" sizes="(min-width: 1024px) 28vw, 78vw" className="!rounded-none" />
              <figcaption className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block text-[16px] font-medium">{g.name}</span>
                    <span className="block text-[12px] text-muted">
                      دوره {g.course} · {g.cohort}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-champagne">دارای مدرک</span>
                </div>
                <blockquote className="mt-4 text-[14px] leading-7 text-wine-soft">«{g.quote}»</blockquote>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AcademyFaq() {
  return (
    <section aria-labelledby="af4-title" className={`${W} grid gap-10 py-14 lg:grid-cols-12 lg:py-20`}>
      <div className="lg:col-span-4">
        <h2 id="af4-title" className={H2}>
          سؤالات آکادمی
        </h2>
        <p className="mt-4 text-[14px] leading-7 text-charcoal">
          برای مشاوره و رزرو جای خود در دوره بعدی تماس بگیرید:{" "}
          <a href={`tel:${site.phone}`} className="underline underline-offset-4" dir="ltr">
            {faNum(site.phone)}
          </a>
        </p>
      </div>
      <div className="lg:col-span-7 lg:col-start-6">
        <Accordion items={[...academyFaq4]} />
      </div>
    </section>
  );
}
