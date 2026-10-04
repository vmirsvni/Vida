import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMedia2 } from "@/data/media2";
import { getMedia3 } from "@/data/media3";
import { getMedia4 } from "@/data/media4";

export const metadata: Metadata = {
  title: { absolute: "Vida Beauty، نسخه‌های نمایشی" },
  description: "سه دمو وبسایت و پنل کاربر Vida Beauty، سبزوار.",
  robots: { index: false, follow: false },
};

/* Display names are 1–3; routes keep their original paths (/demo-2 … /demo-4). */
const demos = [
  {
    n: "۱",
    href: "/demo-2",
    title: "مدرن و نرم",
    note: "رز و مشکی، کارت‌های گرد و حسی تازه و امروزی.",
    features: ["صفحه اصلی تک‌صفحه‌ای با اسلایدر", "رزرو آنلاین با تقویم شمسی", "پرداخت مستقیم یا ۴ قسط", "پنل کاربر"],
    image: getMedia2("d2-hero"),
    focal: "50% 30%",
    swatches: ["#1C1717", "#B77C73", "#F6E6E2"],
  },
  {
    n: "۲",
    href: "/demo-3",
    title: "کاغذی و ادیتوریال",
    note: "کاغذ و قهوه‌ای تیره، قاب‌های قوسی و عکاسی ادیتوریال آرام.",
    features: ["رزرو، درگاه و پنل کاربر اختصاصی", "تیترهای ریم کوفی با بودونی", "منوی سرتیتر و جزئیات خط‌کشی‌شده", "پرداخت مستقیم یا ۴ قسط"],
    image: getMedia3("hero"),
    focal: "50% 22%",
    swatches: ["#2B201D", "#A27B5C", "#ECEAE7"],
  },
  {
    n: "۳",
    href: "/demo-4",
    title: "مینیمال با ویدیو",
    note: "زمینه‌ای گرم و ویدیوی اسکن چهره روی خط چشم، ابرو و لب.",
    features: ["اسلایدر ویدیویی با آنالیز زنده", "فروشگاه محصولات تا پرداخت", "آکادمی ویدا و معرفی متخصصان", "رزرو و پنل کاربر اختصاصی"],
    image: getMedia4("analysis"),
    focal: "50% 25%",
    swatches: ["#1A1617", "#8E4B52", "#EBE7EA"],
  },
];

export default function DemoChooser() {
  return (
    <main className="min-h-[100svh] bg-ivory">
      <div className="wrap pb-16 pt-10 lg:pb-24 lg:pt-14">
        <header className="anim-fade flex items-center gap-3">
          <Image src="/brand/vida-logo-256.webp" alt="" width={44} height={44} className="size-11" priority />
          <span>
            <span className="block font-latin text-[22px] leading-none text-espresso" dir="ltr" style={{ textAlign: "right" }}>
              Vida Beauty
            </span>
            <span className="mt-1 block text-[13px] text-muted">نسخه‌های نمایشی وبسایت و پنل کاربر</span>
          </span>
        </header>

        <section className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:items-end">
          <h1 className="t-display anim-rise text-espresso lg:col-span-7" style={{ ["--d" as string]: "100ms" }}>
            سه طراحی، برای یک برند.
          </h1>
          <p className="anim-rise text-[16px] leading-8 text-charcoal lg:col-span-5" style={{ ["--d" as string]: "200ms" }}>
            هر دمو یک وبسایت کامل است: رزرو آنلاین، پرداخت مستقیم یا اقساطی با اسنپ‌پی و دی‌جی‌پی، و پنل کاربر.
          </p>
        </section>

        <ol className="mt-14 divide-y divide-line border-y border-line lg:mt-20">
          {demos.map((d, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={d.href} className="grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
                <Link
                  href={d.href}
                  aria-label={`دمو ${d.n}، ${d.title}`}
                  className={`group block overflow-hidden rounded-[28px] bg-cream lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                >
                  <span className="relative block aspect-[16/10]">
                    <Image
                      src={d.image.src}
                      alt={d.image.alt}
                      fill
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      placeholder={d.image.blur ? "blur" : "empty"}
                      blurDataURL={d.image.blur}
                      priority={i === 0}
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.02]"
                      style={{ objectPosition: d.focal }}
                    />
                  </span>
                </Link>

                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <p className="text-[14px] text-gold-ink">دمو {d.n}</p>
                  <h2 className="mt-2 font-display text-[clamp(34px,4vw,52px)] leading-[1.15] text-espresso">{d.title}</h2>
                  <p className="mt-3 max-w-md text-[15px] leading-8 text-charcoal">{d.note}</p>
                  <ul className="mt-6 grid gap-2 text-[14px] text-espresso sm:grid-cols-2">
                    {d.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-champagne" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2" aria-label="رنگ‌های اصلی">
                    {d.swatches.map((c) => (
                      <span key={c} className="size-5 rounded-full border border-line" style={{ background: c }} title={c} />
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={d.href} className="btn btn-primary whitespace-nowrap rounded-full px-7">
                      مشاهده دمو {d.n}
                    </Link>
                    <Link href={`${d.href}/account`} className="btn btn-ghost whitespace-nowrap rounded-full px-6 text-espresso">
                      پنل کاربر
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-10 text-[13px] leading-7 text-muted">
          نسخه نمایشی؛ تصاویر، قیمت‌ها، نظرات، درگاه پرداخت و پیامک‌ها موقت یا شبیه‌سازی‌شده هستند. داده‌های هر دمو فقط در همین مرورگر ذخیره
          می‌شود.
        </p>
      </div>
    </main>
  );
}
