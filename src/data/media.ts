/* ──────────────────────────────────────────────────────────────
   SHARED MEDIA BASE
   Each demo has its own graded photo set and manifest
   (media2.ts · media3.ts · media4.ts). They fall back to the alt text
   and focal points below for slot keys they don't describe themselves.
   Credits and sources: docs/CREDITS.md
   ────────────────────────────────────────────────────────────── */

export interface MediaItem {
  src: string;
  alt: string;
  /** CSS object-position — keeps faces safe in every crop */
  focal: string;
  isDemo: boolean;
  credit?: { name: string; url: string };
  w: number;
  h: number;
  blur?: string;
}

const base: Record<string, { alt: string; focal: string }> = {
  "hero": { alt: "پرتره نزدیک زنی با ابروهای پرپشت و طبیعی و نگاه مستقیم، در نور گرم", focal: "50% 32%" },
  "editorial-profile": { alt: "پرتره زنی با آرایش طبیعی و ابروهای فرم‌گرفته در نور گرم و آرام", focal: "50% 35%" },
  "soft-face": { alt: "پرتره آرام همان مدل در نور طبیعی", focal: "50% 35%" },
  "svc-microblading": { alt: "متخصص با دستکش مشکی در حال طراحی ابرو برای مشتری", focal: "50% 30%" },
  "svc-fibroze": { alt: "مشتری با چشمان بسته در حین اجرای تار به تار ابرو", focal: "50% 25%" },
  "svc-vibroze": { alt: "نمای بسیار نزدیک از ابروی پودری و یکدست", focal: "40% 40%" },
  "svc-lip": { alt: "اجرای رنگ لب با براش در تُن رز طبیعی", focal: "45% 50%" },
  "svc-eyeliner": { alt: "نمای نزدیک از خط چشم ظریف و کشیده", focal: "50% 45%" },
  "founder": { alt: "متخصص Vida در حال کار در استودیو", focal: "60% 35%" },
  "editorial-closed": { alt: "مشتری در استودیو در حال اصلاح و فرم‌دهی ابرو", focal: "55% 30%" },
  "academy-brow": { alt: "متخصص در حال کار روی ابروی مشتری در استودیوی روشن", focal: "55% 40%" },
  "academy-liner": { alt: "اجرای دقیق فرم ابرو، نمای نزدیک از دست متخصص", focal: "60% 35%" },
  "rose-profile": { alt: "فضای استودیو Vida هنگام طراحی ابرو", focal: "50% 30%" },
  "brow-leaves": { alt: "متخصص و مشتری در حال مشاوره در استودیو", focal: "60% 40%" },
  "brow-portrait": { alt: "فرم‌دهی ابرو با دقت در نور روشن استودیو", focal: "50% 35%" },
  "brow-eye": { alt: "نمای نزدیک از ابرو هنگام اجرا", focal: "50% 40%" },
  "brow-glitter": { alt: "نمای بسیار نزدیک از تارهای ابرو", focal: "50% 45%" },
  "eye-lash": { alt: "نمای نزدیک از خط مژه و پلک", focal: "50% 50%" },
  "eye-brown": { alt: "نمای نزدیک از چشم و ابروی طبیعی", focal: "50% 50%" },
  "eye-soft": { alt: "اصلاح ظریف ابرو با موچین در استودیو", focal: "50% 40%" },
  "lip-hand": { alt: "اجرای رنگ لب در تُن رز گرم", focal: "50% 50%" },
  "lip-part": { alt: "طراحی خط دور لب با مداد", focal: "50% 50%" },
  "lip-pink": { alt: "لب‌های طبیعی با رنگ ملایم", focal: "50% 55%" },
  "lip-red": { alt: "نمای نزدیک از لب‌های طبیعی و صورتی", focal: "50% 50%" },
  "podium": { alt: "سکوی شامپاینی در نور نرم صبح", focal: "50% 70%" },
  "brow-before": { alt: "نمونه تصویری دمو — ابرو پیش از خدمت (شبیه‌سازی‌شده)", focal: "47% 46%" },
  "brow-after": { alt: "نمونه تصویری دمو — ابرو پس از خدمت", focal: "47% 46%" },
  "lip-before": { alt: "نمونه تصویری دمو — لب پیش از خدمت", focal: "49% 47%" },
  "lip-after": { alt: "نمونه تصویری دمو — لب پس از رژ دائم (شبیه‌سازی‌شده)", focal: "49% 47%" },
};

/** Alt + focal fallback for a slot key; `src`/size are always set by the demo's own manifest. */
export function getMedia(key: string): MediaItem {
  const b = base[key] ?? { alt: "", focal: "50% 40%" };
  return { src: "", alt: b.alt, focal: b.focal, isDemo: true, w: 1200, h: 1500 };
}
