import { D3 } from "@/lib/demo";

export const nav3 = [
  { href: `${D3}#rows`, label: "خدمات و قیمت‌ها" },
  { href: `${D3}#reviews`, label: "نظرات" },
  { href: `${D3}/account`, label: "پنل کاربر" },
  { href: `${D3}#contact`, label: "تماس" },
];

/* small tag above each service title (reference: "DURABLE FINISH") */
export const tag3: Record<string, string> = {
  microblading: "تار به تار و طبیعی",
  fibroze: "طراحی در جهت رشد مو",
  vibroze: "فرم یکدست و ماندگار",
  "lip-shading": "رنگ طبیعی و سرزنده",
  eyeliner: "تعریف ظریف نگاه",
};
