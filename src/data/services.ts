import type { Service } from "./types";

/* ──────────────────────────────────────────────────────────────
   SERVICES
   ⚠️ DEMO PRICES — `priceIsDemo: true` on every item.
   These are NOT Vida Beauty prices. Replace `price` (Toman) and
   set `priceIsDemo: false` once the owner confirms real pricing.
   Durations are demo values used by the booking engine.
   ────────────────────────────────────────────────────────────── */

const consult = {
  title: "مشاوره و طراحی",
  text: "فرم، رنگ و تناسب با چهره شما پیش از هر اقدامی بررسی و طراحی می‌شود.",
};
const aftercare = {
  title: "مراقبت پس از خدمت",
  text: "راهنمای مراقبت و زمان جلسه ترمیم به‌صورت مکتوب در اختیار شما قرار می‌گیرد.",
};

export const services: Service[] = [
  {
    slug: "microblading",
    title: "میکروبلیدینگ",
    latin: "Microblading",
    category: "brows",
    number: "01",
    short: "طراحی و ایجاد خطوط ظریف شبیه تارهای طبیعی ابرو برای ایجاد فرم و تراکم متناسب با چهره.",
    long: [
      "در میکروبلیدینگ، خطوطی بسیار ظریف در امتداد رشد طبیعی ابرو طراحی می‌شود تا فرم و تراکم ابرو کامل‌تر و متعادل‌تر به نظر برسد.",
      "هدف، ابرویی است که به چهره شما تعلق دارد؛ نه ابرویی که دیده شود، بلکه چهره‌ای که هماهنگ‌تر دیده شود.",
    ],
    durationMin: 150,
    price: 3_900_000,
    priceIsDemo: true,
    touchUp: "جلسه ترمیم طبق نظر متخصص",
    longevity: "به نوع پوست و مراقبت بستگی دارد و در مشاوره بررسی می‌شود.",
    steps: [consult, { title: "اجرا", text: "اجرای خطوط با دقت و آرامش، در محیطی بهداشتی و خصوصی." }, aftercare],
    image: "svc-microblading",
    gallery: ["brow-portrait", "brow-glitter", "brow-eye"],
    seo: {
      title: "میکروبلیدینگ ابرو در سبزوار",
      description:
        "میکروبلیدینگ تخصصی ابرو در سبزوار؛ طراحی تارهای ظریف و طبیعی متناسب با فرم چهره در Vida Beauty. رزرو آنلاین نوبت.",
    },
  },
  {
    slug: "fibroze",
    title: "فیبروز ابرو",
    latin: "Fibroze Brows",
    category: "brows",
    number: "02",
    short: "تکنیکی ظریف برای طراحی تارهای ابرو با تمرکز بر تناسب فرم، جهت تارها و ایجاد جلوه‌ای طبیعی.",
    long: [
      "فیبروز بر جهت و ریتم تارها تمرکز دارد؛ هر تار با توجه به فرم طبیعی ابروی شما طراحی می‌شود تا نتیجه‌ای یکدست و طبیعی شکل بگیرد.",
      "این تکنیک برای کسانی مناسب است که ابرویی مرتب و پرتر، اما همچنان نرم و طبیعی می‌خواهند.",
    ],
    durationMin: 150,
    price: 4_500_000,
    priceIsDemo: true,
    touchUp: "جلسه ترمیم طبق نظر متخصص",
    longevity: "به نوع پوست و مراقبت بستگی دارد و در مشاوره بررسی می‌شود.",
    steps: [consult, { title: "اجرا", text: "طراحی تار به تار با تمرکز بر جهت رشد طبیعی ابرو." }, aftercare],
    image: "svc-fibroze",
    gallery: ["brow-leaves", "brow-eye", "brow-portrait"],
    seo: {
      title: "فیبروز ابرو در سبزوار",
      description: "فیبروز ابرو در سبزوار با طراحی تار به تار و جلوه‌ای طبیعی؛ مشاوره و رزرو آنلاین در Vida Beauty.",
    },
  },
  {
    slug: "vibroze",
    title: "ویبروز ابرو",
    latin: "Vibroze Brows",
    category: "brows",
    number: "03",
    // ⚠️ PLACEHOLDER COPY — the exact technical definition of Vibroze
    // has not been confirmed by the salon. Keep wording neutral.
    copyIsPlaceholder: true,
    short: "خدمتی تخصصی برای ابرو با تمرکز بر فرم، تناسب و جلوه‌ای یکدست؛ جزئیات تکنیک در جلسه مشاوره توضیح داده می‌شود.",
    long: [
      "ویبروز یکی از خدمات تخصصی ابرو در Vida Beauty است. شرح دقیق تکنیک و تفاوت آن با سایر روش‌ها، در جلسه مشاوره و متناسب با شرایط ابروی شما توضیح داده می‌شود.",
      "[توضیحات فنی تأییدشده این خدمت در نسخه نهایی درج می‌شود.]",
    ],
    durationMin: 120,
    price: 4_200_000,
    priceIsDemo: true,
    touchUp: "طبق نظر متخصص",
    longevity: "در جلسه مشاوره توضیح داده می‌شود.",
    steps: [consult, { title: "اجرا", text: "اجرای خدمت متناسب با فرم و نیاز ابروی شما." }, aftercare],
    image: "svc-vibroze",
    gallery: ["brow-glitter", "brow-leaves", "brow-portrait"],
    seo: {
      title: "ویبروز ابرو در سبزوار",
      description: "ویبروز ابرو در سبزوار؛ خدمات تخصصی ابرو با تمرکز بر فرم و تناسب چهره در Vida Beauty. رزرو آنلاین نوبت.",
    },
  },
  {
    slug: "lip-shading",
    title: "شیدینگ لب",
    latin: "Lip Blush",
    category: "lips",
    number: "04",
    short: "ایجاد رنگ و جلوه‌ای طبیعی‌تر برای لب‌ها با تمرکز بر تناسب رنگ و فرم لب.",
    long: [
      "در شیدینگ لب، رنگی متناسب با رنگ پوست و لب‌های شما انتخاب می‌شود تا لب‌ها سرزنده‌تر و یکدست‌تر به نظر برسند؛ بی‌آنکه جلوه‌ای مصنوعی داشته باشند.",
      "انتخاب رنگ، مهم‌ترین بخش این خدمت است و با دقت و در کنار شما انجام می‌شود.",
    ],
    durationMin: 150,
    price: 4_800_000,
    priceIsDemo: true,
    touchUp: "جلسه ترمیم طبق نظر متخصص",
    longevity: "به نوع پوست و مراقبت بستگی دارد و در مشاوره بررسی می‌شود.",
    steps: [
      { title: "انتخاب رنگ", text: "رنگ بر اساس تُن پوست و رنگ طبیعی لب شما انتخاب می‌شود." },
      { title: "اجرا", text: "اجرای یکدست و نرم، با تمرکز بر فرم طبیعی لب." },
      aftercare,
    ],
    image: "svc-lip",
    gallery: ["lip-hand", "lip-pink", "lip-red"],
    seo: {
      title: "شیدینگ لب در سبزوار",
      description: "شیدینگ لب (لیپ بلاش) در سبزوار؛ رنگی طبیعی و متناسب با فرم لب در Vida Beauty. رزرو آنلاین نوبت.",
    },
  },
  {
    slug: "eyeliner",
    title: "خط چشم",
    latin: "Eyeliner",
    category: "eyes",
    number: "05",
    short: "ایجاد خط چشم نیمه‌دائمی برای افزایش تعریف چشم‌ها و ایجاد جلوه‌ای ظریف و متناسب با فرم چشم.",
    long: [
      "خط چشم نیمه‌دائمی، تعریف چشم‌ها را بیشتر می‌کند و صبح‌ها را ساده‌تر. ضخامت و فرم خط، متناسب با فرم چشم و سلیقه شما طراحی می‌شود.",
      "از خطی بسیار ظریف در امتداد مژه‌ها تا فرمی مشخص‌تر؛ انتخاب با شماست.",
    ],
    durationMin: 90,
    price: 2_900_000,
    priceIsDemo: true,
    touchUp: "جلسه ترمیم طبق نظر متخصص",
    longevity: "به نوع پوست و مراقبت بستگی دارد و در مشاوره بررسی می‌شود.",
    steps: [consult, { title: "اجرا", text: "اجرای خط با دقت و ظرافت، متناسب با فرم چشم." }, aftercare],
    image: "svc-eyeliner",
    gallery: ["eye-lash", "eye-brown", "eye-soft"],
    seo: {
      title: "خط چشم دائم در سبزوار",
      description: "خط چشم نیمه‌دائمی در سبزوار؛ تعریف ظریف و متناسب با فرم چشم در Vida Beauty. رزرو آنلاین نوبت.",
    },
  },
];

export const categoryLabel: Record<string, string> = {
  all: "همه",
  brows: "ابرو",
  lips: "لب",
  eyes: "چشم",
};

