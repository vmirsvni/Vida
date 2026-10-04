/* ──────────────────────────────────────────────────────────────
   DEMO 2 MEDIA — the same demo photographs as demo 1, re-graded
   rosier/lighter for the "Beauty Center" look, plus three extra
   free Unsplash images. ⚠️ All temporary demo imagery.
   Credits: docs/CREDITS.md
   ────────────────────────────────────────────────────────────── */

import meta2 from "./image-meta2.json";
import { getMedia, type MediaItem } from "./media";

type Meta = Record<string, { w: number; h: number; blur: string }>;
const M2 = meta2 as Meta;

const extra: Record<string, Omit<MediaItem, "w" | "h" | "blur" | "src">> = {
  "d2-hero": {
    alt: "زنی با ابروهای پرپشت و پوست درخشان در برابر دیوار صورتی",
    focal: "50% 22%",
    isDemo: true,
    credit: { name: "Oleg Ivanov", url: "https://images.unsplash.com/photo-1548550702-9c59121819b7" },
  },
  "d2-nude": {
    alt: "پرتره روشن با پوست طبیعی و ابروهای نرم روی زمینه نود",
    focal: "50% 30%",
    isDemo: true,
    credit: { name: "Look Studio", url: "https://images.unsplash.com/photo-1713207524097-596f3c17afc3" },
  },
  "d2-golden": {
    alt: "چهره‌ای آرام با چشمان بسته در نور طلایی",
    focal: "55% 40%",
    isDemo: true,
    credit: { name: "Sunny Ng", url: "https://images.unsplash.com/photo-1555820585-c5ae44394b79" },
  },
  "d2-leaf": {
    alt: "پرتره با ابروهای پرپشت و برگ مونسترا",
    focal: "60% 35%",
    isDemo: true,
    credit: { name: "Ahmad Ebadi", url: "https://images.unsplash.com/photo-1630826888603-7eb14e9f05d1" },
  },
  /* demo 2 has its own photographs for every shared slot (bright blush set) */
  "svc-microblading": {
    alt: "نیم‌رخ زنی با ابروهای پرپشت و طبیعی در برابر دیوار صورتی",
    focal: "45% 30%",
    isDemo: true,
    credit: { name: "Oleg Ivanov", url: "https://images.unsplash.com/photo-1548112129-b5cf67e9558d" },
  },
  "svc-fibroze": {
    alt: "زنی با چشمان بسته و ابروهای طبیعی در نور نرم",
    focal: "55% 30%",
    isDemo: true,
    credit: { name: "zahra rahimzadeh", url: "https://images.unsplash.com/photo-1763559071676-ee4da5d94be6" },
  },
  "svc-vibroze": {
    alt: "پرتره رمانتیک با گل رز روی زمینه مرجانی",
    focal: "45% 28%",
    isDemo: true,
    credit: { name: "Kateryna Hliznitsova", url: "https://images.unsplash.com/photo-1675106251118-6c1efd1841a7" },
  },
  "svc-lip": {
    alt: "نمای نزدیک از لب‌هایی با رنگ نود و طبیعی",
    focal: "50% 45%",
    isDemo: true,
    credit: { name: "Vitaly Gariev", url: "https://images.unsplash.com/photo-1790574318671-93001474a39c" },
  },
  "svc-eyeliner": {
    alt: "نمای نزدیک از چشم با خط چشم ظریف",
    focal: "50% 50%",
    isDemo: true,
    credit: { name: "Vitaly Gariev", url: "https://images.unsplash.com/photo-1790575188116-148723b03d0b" },
  },
  "editorial-closed": {
    alt: "پرتره روشن روی زمینه هلویی",
    focal: "50% 20%",
    isDemo: true,
    credit: { name: "Look Studio", url: "https://images.unsplash.com/photo-1713467442957-239852b3f997" },
  },
  "brow-portrait": {
    alt: "چهره‌ای شاد و درخشان روی زمینه صورتی",
    focal: "50% 30%",
    isDemo: true,
    credit: { name: "Look Studio", url: "https://images.unsplash.com/photo-1713778480816-ef754b227153" },
  },
  "brow-eye": {
    alt: "پوست درخشان و دستی کنار چهره",
    focal: "35% 40%",
    isDemo: true,
    credit: { name: "Laura Jaeger", url: "https://images.unsplash.com/photo-1670201203208-055d6d79db4a" },
  },
  "brow-glitter": {
    alt: "گل رز صورتی روی شانه",
    focal: "50% 50%",
    isDemo: true,
    credit: { name: "Kateryna Hliznitsova", url: "https://images.unsplash.com/photo-1675106251379-526538d25644" },
  },
  "lip-hand": {
    alt: "لب‌هایی با رنگ طبیعی و ملایم",
    focal: "50% 55%",
    isDemo: true,
    credit: { name: "Vitaly Gariev", url: "https://images.unsplash.com/photo-1790575188338-e87f67cbfc68" },
  },
  "eye-soft": {
    alt: "چهره‌ای خندان با آرایش ملایم روی زمینه صورتی",
    focal: "50% 30%",
    isDemo: true,
    credit: { name: "Look Studio", url: "https://images.unsplash.com/photo-1713778479405-6507490d7ca4" },
  },
  "rose-profile": {
    alt: "پرتره با گل رز روی زمینه مرجانی",
    focal: "50% 55%",
    isDemo: true,
    credit: { name: "Kateryna Hliznitsova", url: "https://images.unsplash.com/photo-1675237293244-1c2ef3171a7e" },
  },
  "academy-brow": {
    alt: "متخصص در حال طراحی و آماده‌سازی ابرو",
    focal: "50% 30%",
    isDemo: true,
    credit: { name: "Mina Rad", url: "https://images.unsplash.com/photo-1746708810803-722593e53772" },
  },
  "brow-leaves": {
    alt: "اجرای دقیق خدمات زیبایی روی چهره",
    focal: "50% 40%",
    isDemo: true,
    credit: { name: "kimia kazemi", url: "https://images.unsplash.com/photo-1731514798247-2d7ecb6fa45a" },
  },
  "academy-liner": {
    alt: "اجرای دقیق روی مژه‌ها در سالن",
    focal: "50% 40%",
    isDemo: true,
    credit: { name: "Hayley Kim Studios", url: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b" },
  },
  "d2-interior": {
    alt: "فضای داخلی آرام سالن با آینه‌های قوسی",
    focal: "50% 55%",
    isDemo: true,
    credit: { name: "Barney Goodman", url: "https://images.unsplash.com/photo-1781450090585-1a511b7066d9" },
  },
  "d2-cream": {
    alt: "بافت کرم روی زمینه نود",
    focal: "50% 50%",
    isDemo: true,
    credit: { name: "Kelsey Curtis", url: "https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1" },
  },
};

/* ── Demo 2 copies of the first demo 1 set (demo 1 now uses the client photos) ── */
const U = (id: string) => `https://images.unsplash.com/${id}`;
const BB = "MohammadReza BaBaei";
const legacy: Record<string, Omit<MediaItem, "w" | "h" | "blur" | "src">> = {
  hero: {
    alt: "پرتره استودیویی زنی با ابروهای پرپشت و طبیعی، پوست درخشان و رژ لب شرابی",
    focal: "50% 38%",
    isDemo: true,
    credit: { name: BB, url: U("photo-1703546192713-9f51731169fb") },
  },
  founder: {
    alt: "تصویر موقت دمو برای معرفی متخصص",
    focal: "45% 32%",
    isDemo: true,
    credit: { name: BB, url: U("photo-1692318571351-cbec0024b10a") },
  },
  "editorial-profile": {
    alt: "نیم‌رخ درخشان با خط چشم و ابروی تعریف‌شده",
    focal: "42% 35%",
    isDemo: true,
    credit: { name: BB, url: U("photo-1677808567822-b41b62e7dc4a") },
  },
  "lip-pink": { alt: "لب‌هایی با رنگ صورتی ملایم", focal: "38% 50%", isDemo: true, credit: { name: "Renji Desh", url: U("photo-1643630661247-2474f10e4f70") } },
  "lip-red": { alt: "نمای نزدیک از لب‌هایی با رنگ گرم", focal: "50% 62%", isDemo: true, credit: { name: "Amirhossein Soltani", url: U("photo-1756112165879-7e734b376319") } },
  "lip-part": { alt: "نمای نزدیک از لب‌ها در نور تیره", focal: "50% 30%", isDemo: true, credit: { name: "engin akyurt", url: U("photo-1584457361626-06effef61a7c") } },
  "eye-lash": { alt: "نمای نزدیک از چشم و مژه‌ها", focal: "55% 45%", isDemo: true, credit: { name: "Ali Shoaee", url: U("photo-1633346152343-5486573d3d50") } },
  "eye-brown": { alt: "چشم قهوه‌ای با ابروی پرپشت در نور گرم", focal: "40% 42%", isDemo: true, credit: { name: "Ernesto Norman", url: U("photo-1567629307995-b9f33097bd30") } },
  "soft-face": { alt: "پرتره استودیویی با لب قرمز و موی کوتاه", focal: "50% 40%", isDemo: true, credit: { name: BB, url: U("photo-1692318454754-151bfd878b88") } },
  "brow-before": { alt: "نمونه تصویری دمو — ابرو پیش از خدمت (شبیه‌سازی‌شده)", focal: "56% 26%", isDemo: true, credit: { name: BB, url: U("photo-1692318601456-1d2bbc8e0250") } },
  "brow-after": { alt: "نمونه تصویری دمو — ابرو پس از خدمت", focal: "56% 26%", isDemo: true, credit: { name: BB, url: U("photo-1692318601456-1d2bbc8e0250") } },
  "lip-before": { alt: "نمونه تصویری دمو — لب پیش از خدمت (شبیه‌سازی‌شده)", focal: "50% 55%", isDemo: true, credit: { name: "Tony Litvyak", url: U("photo-1654375078795-7229b6458d25") } },
  "lip-after": { alt: "نمونه تصویری دمو — لب پس از خدمت", focal: "50% 55%", isDemo: true, credit: { name: "Tony Litvyak", url: U("photo-1654375078795-7229b6458d25") } },
};

/* ── Photos supplied by the client (PIC/ folder), graded for demo 2 ── */
const client: Record<string, Omit<MediaItem, "w" | "h" | "blur" | "src">> = {
  "hs-1": { alt: "پرتره با ابروهای پرپشت و کک‌ومک و پوست درخشان", focal: "42% 42%", isDemo: true },
  "hs-2": { alt: "پرتره طبیعی با ابروهای نرم و خط چشم ظریف", focal: "50% 38%", isDemo: true },
  "hs-3": { alt: "پرتره با لب‌های براق و ابروهای مرتب روی زمینه صورتی", focal: "48% 40%", isDemo: true },
  "hs-4": { alt: "پرتره با لب‌های صورتی و مژه‌های بلند", focal: "50% 42%", isDemo: true },
  "hs-5": { alt: "پرتره با موهای فر و پوست درخشان", focal: "50% 38%", isDemo: true },
  "svc-microblading": { alt: "نمای نزدیک از ابروی پرپشت و طبیعی با کک‌ومک", focal: "45% 30%", isDemo: true },
  "svc-fibroze": { alt: "پرتره با ابروهای طبیعی و دستی کنار چهره", focal: "50% 25%", isDemo: true },
  "svc-vibroze": { alt: "پرتره با ابروهای فرم‌یافته و پررنگ", focal: "55% 35%", isDemo: true },
  "svc-lip": { alt: "نمای نزدیک از لب‌هایی با رنگ نود و طبیعی", focal: "50% 50%", isDemo: true },
  "svc-eyeliner": { alt: "اجرای خط چشم ظریف روی زمینه صورتی", focal: "45% 40%", isDemo: true },
  "brow-portrait": { alt: "نمای نزدیک از ابرو و مژه در حین کار", focal: "50% 40%", isDemo: true },
  "brow-eye": { alt: "پرتره آرام با ابروهای طبیعی و خط چشم", focal: "50% 30%", isDemo: true },
  "brow-glitter": { alt: "نمای نزدیک از ابرو و مژه", focal: "50% 25%", isDemo: true },
  "lip-hand": { alt: "دو لب با رنگ نود روی زمینه صورتی", focal: "50% 45%", isDemo: true },
  "eye-soft": { alt: "خط چشم دقیق با قلم", focal: "50% 35%", isDemo: true },
  "tr-lip-split": { alt: "مقایسه خط لب و شیدینگ کامل لب", focal: "50% 60%", isDemo: true },
  "tr-liner": { alt: "خط چشم کشیده و ظریف", focal: "50% 30%", isDemo: true },
  "tr-petals": { alt: "لب‌هایی با رنگ طبیعی در میان گلبرگ‌ها", focal: "50% 40%", isDemo: true },
  "tr-lip-result": { alt: "نمای نزدیک از نتیجه شیدینگ لب", focal: "50% 50%", isDemo: true },
  "editorial-closed": { alt: "پرتره روشن با ابروهای پرپشت", focal: "50% 35%", isDemo: true },
  "academy-brow": { alt: "اجرای میکروبلیدینگ با قلم", focal: "50% 35%", isDemo: true },
  "brow-leaves": { alt: "طراحی و اندازه‌گیری فرم ابرو", focal: "45% 35%", isDemo: true },
  "academy-liner": { alt: "آماده‌سازی و طراحی ابرو پیش از اجرا", focal: "40% 35%", isDemo: true },
  "ac-tools": { alt: "ابزار اندازه‌گیری و طراحی ابرو", focal: "50% 45%", isDemo: true },
  "ac-magazine": { alt: "ابزار و پد زیر چشم روی مجله زیبایی", focal: "50% 40%", isDemo: true },
  "ac-phone": { alt: "نمای ابرو روی صفحه موبایل در کنار ابزار", focal: "50% 45%", isDemo: true },
};

export function getMedia2(key: string): MediaItem {
  const m = M2[key];
  const base = client[key] ?? extra[key] ?? legacy[key] ?? getMedia(key);
  return {
    ...base,
    src: `/images/d2d/${key}.jpg`,
    w: m?.w ?? 1600,
    h: m?.h ?? 2000,
    blur: m?.blur,
  };
}
