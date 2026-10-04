/* ──────────────────────────────────────────────────────────────
   DEMO 4 MEDIA — "Nuvé" AI-scan look (QClay reference).
   Hero: AI-generated video supplied by the client, played forward-and-back,
   with tracked scan boxes.
   Photos: Look Studio series on Unsplash (free licence), "clean lilac" grade.
   Academy: Antoni Shkraba brow-studio series (Pexels) + graduate portraits
   by Vitaly Gariev (Unsplash), same grade.
   ⚠️ Temporary demo imagery, rights unconfirmed — docs/CREDITS.md
   ────────────────────────────────────────────────────────────── */

import meta4 from "./image-meta4.json";
import { getMedia, type MediaItem } from "./media";

type Meta = Record<string, { w: number; h: number; blur: string }>;
const M4 = meta4 as Meta;

const items: Record<string, Pick<MediaItem, "alt" | "focal">> = {
  scan: { alt: "مدل در ویدیوی آنالیز چهره", focal: "50% 35%" },
  analysis: { alt: "مدل با دستانی کنار صورت و پوستی درخشان روی زمینه روشن", focal: "50% 35%" },
  portrait: { alt: "مدل با چشمان بسته و ابروهای طبیعی", focal: "50% 35%" },
  cta: { alt: "مدل خندان در حال مراقبت از پوست", focal: "45% 40%" },
  "svc-microblading": { alt: "نمای نزدیک از ابروهای طبیعی و فرم‌یافته", focal: "50% 45%" },
  "svc-fibroze": { alt: "پرتره با ابروهای طبیعی و دستی کنار صورت", focal: "50% 30%" },
  "svc-vibroze": { alt: "پرتره با چشمان بسته و ابروی متناسب", focal: "50% 30%" },
  "svc-lip": { alt: "نمای نزدیک از لب‌هایی با رنگ طبیعی", focal: "50% 55%" },
  "svc-eyeliner": { alt: "نمای نزدیک از چشم و مژه‌ها", focal: "50% 45%" },
  "pill-217834": { alt: "", focal: "50% 45%" },
  "pill-291832": { alt: "", focal: "50% 45%" },
  "pill-267814": { alt: "", focal: "50% 45%" },
  "pill-242233": { alt: "", focal: "50% 45%" },
  "ac-hero": { alt: "مربی آکادمی در حال طراحی ابرو روی مدل در استودیوی روشن", focal: "55% 40%" },
  "ac-micro": { alt: "طراحی فرم ابرو با قلم پیش از میکروبلیدینگ", focal: "50% 48%" },
  "ac-fibroze": { alt: "اندازه‌گیری فرم ابرو با نخ پیش از فیبروز", focal: "50% 40%" },
  "ac-train": { alt: "مربی و هنرجو در حال تمرین عملی در استودیو", focal: "60% 40%" },
  "team-1": { alt: "نگار، متخصص میکروبلیدینگ و فیبروز", focal: "40% 25%" },
  "team-2": { alt: "مهسا، متخصص شیدینگ لب و خط چشم", focal: "45% 22%" },
  "team-3": { alt: "الناز، متخصص ویبروز ابرو و مدرس آکادمی", focal: "50% 30%" },
  "team-4": { alt: "ترانه، مشاور طراحی و فرم ابرو", focal: "40% 25%" },
  "team-5": { alt: "سارا، متخصص مراقبت پوست", focal: "55% 18%" },
  "grad-1": { alt: "پرتره هنرجوی آکادمی", focal: "50% 35%" },
  "grad-2": { alt: "پرتره هنرجوی آکادمی", focal: "50% 35%" },
  "grad-3": { alt: "پرتره هنرجوی آکادمی", focal: "50% 30%" },
  "grad-4": { alt: "پرتره هنرجوی آکادمی", focal: "50% 35%" },
  "grad-5": { alt: "پرتره هنرجوی آکادمی", focal: "50% 35%" },
  "grad-6": { alt: "پرتره هنرجوی آکادمی", focal: "50% 35%" },
};

export function getMedia4(key: string): MediaItem {
  const m = M4[key];
  const base = items[key] ?? getMedia(key);
  return {
    alt: base.alt,
    focal: base.focal,
    isDemo: true,
    src: `/images/d4b/${key}.jpg`,
    w: m?.w ?? 1200,
    h: m?.h ?? 1500,
    blur: m?.blur,
  };
}
