/* ──────────────────────────────────────────────────────────────
   DEMO 4 SHOP — products the salon sells.
   ⚠️ DEMO: photos supplied by the client (other brands' packaging),
   prices and copy are placeholders. Confirm stock, prices, usage
   rights and product facts before launch. Product facts below are
   limited to what is printed on each package.
   ────────────────────────────────────────────────────────────── */

export type ProductCategory = "skin" | "lip" | "hair";

export interface Product4 {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  price: number;
  size: string;
  image: string;
  short: string;
  description: string;
  usage: string;
  note?: string;
}

export const CATEGORIES4: { key: ProductCategory | "all"; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "skin", label: "مراقبت پوست" },
  { key: "lip", label: "لب" },
  { key: "hair", label: "مو" },
];

export const products4: Product4[] = [
  {
    id: "skinbar-anti-acne-serum",
    brand: "SKINBAR",
    name: "سرم ضدجوش صورت",
    category: "skin",
    price: 890_000,
    size: "۳۰ میلی‌لیتر",
    image: "prod-skinbar",
    short: "سالیسیلیک اسید ۲٪ و زینک ۰٫۵٪",
    description: "سرم سبک برای پوست‌های مستعد جوش، با سالیسیلیک اسید ۲٪ و زینک ۰٫۵٪ طبق برچسب محصول.",
    usage: "شب‌ها پس از شست‌وشو چند قطره روی پوست خشک بزنید. تا دو هفته پس از خدمات PMU روی ناحیه کار شده استفاده نکنید.",
  },
  {
    id: "okolo-age-decoder-essence",
    brand: "okolo",
    name: "اسانس مراقبت پوست",
    category: "skin",
    price: 1_650_000,
    size: "۵۰ میلی‌لیتر",
    image: "prod-okolo",
    short: "Age Decoder Essence · قطره‌چکان شیشه‌ای",
    description: "اسانس مراقبتی برای روتین روزانه پوست، در بطری قطره‌چکان شیشه‌ای.",
    usage: "صبح و شب پس از تونر، چند قطره را با سر انگشت روی پوست پخش کنید.",
  },
  {
    id: "avca-collagen-ampoule",
    brand: "AVCA",
    name: "آمپول کلاژن",
    category: "skin",
    price: 1_100_000,
    size: "۱۰۰ میلی‌لیتر",
    image: "prod-avca",
    short: "مراقبت از خطوط ریز",
    description: "آمپول مراقبتی با عصاره کلاژن هیدرولیزشده و کمپلکس پپتید، طبق برچسب محصول.",
    usage: "پس از پاک‌سازی، دو تا سه قطره روی صورت و گردن بزنید و با ضربه‌های آرام جذب کنید.",
  },
  {
    id: "amauve-face-essence",
    brand: "amauve",
    name: "اسانس صورت",
    category: "skin",
    price: 1_250_000,
    size: "۳۰ میلی‌لیتر",
    image: "prod-amauve",
    short: "مراقبت روزانه، بافت سبک",
    description: "محصول مراقبتی با بافت سبک برای روتین روزانه پوست.",
    usage: "روزی یک تا دو بار روی پوست تمیز استفاده کنید.",
    note: "مشخصات دقیق این محصول در نسخه نهایی تکمیل می‌شود.",
  },
  {
    id: "cheris-lip-tint",
    brand: "cheris",
    name: "تینت لب",
    category: "lip",
    price: 720_000,
    size: "۱۰ میلی‌لیتر",
    image: "prod-cheris",
    short: "رنگ ملایم و طبیعی",
    description: "تینت با رنگ ملایم برای روزهایی که لب رنگ کمی بیشتری می‌خواهد؛ همراه خوبی برای پس از ترمیم شیدینگ لب.",
    usage: "پس از بهبود کامل لب (حدود چهار هفته پس از شیدینگ) یک لایه نازک بزنید.",
    note: "مشخصات دقیق این محصول در نسخه نهایی تکمیل می‌شود.",
  },
  {
    id: "the-heal-leave-in-cream",
    brand: "the heal",
    name: "کرم ترمیم‌کننده بدون آبکشی",
    category: "hair",
    price: 980_000,
    size: "۱۰۰ میلی‌لیتر",
    image: "prod-theheal",
    short: "Biomimetic · ترمیم نرمی و تراکم مو",
    description: "کرم بدون آبکشی برای بازگرداندن نرمی و تراکم مو، طبق برچسب محصول.",
    usage: "مقدار کمی را روی موی نم‌دار، از ساقه تا نوک، پخش کنید و آبکشی نکنید.",
  },
];

export const getProduct4 = (id: string) => products4.find((p) => p.id === id);

/* Delivery (demo terms) */
export type DeliveryMethod = "pickup" | "courier" | "post";
export const FREE_SHIPPING_FROM = 2_000_000;
export const DELIVERY4: Record<DeliveryMethod, { title: string; note: string; fee: number }> = {
  pickup: { title: "تحویل حضوری در سالن", note: "سبزوار، چهارراه سونالوکس · رایگان", fee: 0 },
  courier: { title: "پیک در سبزوار", note: "همان روز یا روز بعد", fee: 60_000 },
  post: { title: "پست پیشتاز", note: "۲ تا ۴ روز کاری", fee: 90_000 },
};
export function shippingFee(method: DeliveryMethod, subtotal: number) {
  if (method === "pickup") return 0;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : DELIVERY4[method].fee;
}

/** Resolve cart rows against the catalogue (unknown ids are dropped). */
export function cartLines(cart: { id: string; qty: number }[] | undefined) {
  return (cart ?? []).flatMap((c) => {
    const p = getProduct4(c.id);
    return p ? [{ product: p, qty: c.qty, total: p.price * c.qty }] : [];
  });
}
export const cartCount = (cart: { qty: number }[] | undefined) => (cart ?? []).reduce((t, c) => t + c.qty, 0);
