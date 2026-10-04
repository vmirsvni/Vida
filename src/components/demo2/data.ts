import { services } from "@/data/services";

/* Short card lines for demo 2 (the reference uses 1–2 line captions). */
export const tagline: Record<string, string> = {
  microblading: "تارهای ظریف و طبیعی، متناسب با فرم چهره",
  fibroze: "طراحی تار به تار در جهت رشد طبیعی ابرو",
  vibroze: "فرمی یکدست و متناسب؛ جزئیات در مشاوره",
  "lip-shading": "رنگی طبیعی و سرزنده برای لب‌ها",
  eyeliner: "تعریف ظریف چشم‌ها، متناسب با فرم چشم",
};

/* Thumb images for each service (small pills / catalogue cards) */
export const thumb: Record<string, string> = {
  microblading: "brow-portrait",
  fibroze: "brow-eye",
  vibroze: "brow-glitter",
  "lip-shading": "lip-hand",
  eyeliner: "eye-soft",
};

export const svcList = services.map((s) => ({ ...s, tagline: tagline[s.slug], thumb: thumb[s.slug] }));

/* "Transformation" carousel — ⚠️ demo imagery */
export const transformations = [
  { key: "brow-portrait", title: "ابرویی که به چهره تعلق دارد", text: "طراحی فرم و تراکم، متناسب با تناسبات چهره شما.", tag: "میکروبلیدینگ" },
  { key: "tr-lip-split", title: "از خط لب تا شیدینگ کامل", text: "رنگ و فرم، مرحله به مرحله؛ تا نتیجه‌ای یکدست و طبیعی.", tag: "شیدینگ لب" },
  { key: "tr-liner", title: "نگاهی تعریف‌شده", text: "خط چشمی ظریف و دقیق، متناسب با فرم چشم.", tag: "خط چشم" },
  { key: "tr-petals", title: "رنگی نرم و سرزنده", text: "لب‌هایی با جلوه‌ای طبیعی، بدون حس مصنوعی.", tag: "شیدینگ لب" },
  { key: "tr-lip-result", title: "جزئیات، از نزدیک", text: "یکدستی رنگ و وضوح فرم؛ همان چیزی که دیده می‌شود.", tag: "نتیجه کار" },
];
