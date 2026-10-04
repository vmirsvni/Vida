/* ──────────────────────────────────────────────────────────────
   DEMO 3 MEDIA — paper & espresso, warm bronze glam.
   Luxury editorial set picked from the two Pinterest idea pages the
   client chose (beauty-editorial-photography, luxury-beauty-editorial);
   one shared light "paper" grade.
   ⚠️ Pinterest pins: source/rights unknown, demo only — docs/CREDITS.md
   ────────────────────────────────────────────────────────────── */

import meta3 from "./image-meta3.json";
import { getMedia, type MediaItem } from "./media";

type Meta = Record<string, { w: number; h: number; blur: string }>;
const M3 = meta3 as Meta;

const items: Record<string, Pick<MediaItem, "alt" | "focal">> = {
  hero: { alt: "پرتره زنی با موهای جمع‌شده و لباس ابریشمی کرم، با ابروهای فرم‌گرفته", focal: "50% 25%" },
  services: { alt: "پرتره نیم‌رخ با شانه‌های برهنه و پارچه ابریشمی کرم", focal: "50% 30%" },
  book: { alt: "پرتره با پوست طبیعی میان یقه‌ای از تور کرم", focal: "45% 25%" },
  "svc-microblading": { alt: "نمای نزدیک از ابروهای پرپشت و طبیعی", focal: "50% 30%" },
  "svc-fibroze": { alt: "پرتره روبه‌رو با ابروهای تار به تار و کک‌ومک طبیعی", focal: "50% 30%" },
  "svc-vibroze": { alt: "ابروهای یکدست و متناسب در نور طبیعی", focal: "50% 35%" },
  "svc-lip": { alt: "نمای نزدیک از لب‌هایی با رنگ نود طبیعی", focal: "50% 45%" },
  "svc-eyeliner": { alt: "نمای نزدیک از چشم با خط چشم ظریف و کشیده", focal: "55% 45%" },
};

export function getMedia3(key: string): MediaItem {
  const m = M3[key];
  const base = items[key] ?? getMedia(key);
  return {
    alt: base.alt,
    focal: base.focal,
    isDemo: true,
    src: `/images/d3c/${key}.jpg`,
    w: m?.w ?? 1200,
    h: m?.h ?? 1500,
    blur: m?.blur,
  };
}
