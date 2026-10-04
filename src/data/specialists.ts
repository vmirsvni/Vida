import type { Specialist, WorkingHours } from "./types";

/* ──────────────────────────────────────────────────────────────
   SPECIALISTS
   ⚠️ DEMO — names and bios are illustrative, not real people.
   Replace with the salon's real team before launch.
   Working hours: 0=Sun … 6=Sat. Friday (5) is closed by default.
   ────────────────────────────────────────────────────────────── */

const week = (open: string, close: string, off: number[] = []): WorkingHours[] =>
  [6, 0, 1, 2, 3, 4, 5].map((day) => (day === 5 || off.includes(day) ? { day, open: null, close: null } : { day, open, close }));

export const specialists: Specialist[] = [
  {
    id: "s1",
    name: "نگار",
    title: "متخصص میکروبلیدینگ و فیبروز",
    bio: "طراحی ابرو را با شناخت فرم استخوان و حالت چهره آغاز می‌کند؛ نتیجه کارش طبیعی و آرام است.",
    specialties: ["microblading", "fibroze", "vibroze"],
    photo: null,
    documents: [],
    hours: week("10:00", "19:00"),
    isPlaceholder: true,
    active: true,
  },
  {
    id: "s2",
    name: "مهسا",
    title: "متخصص شیدینگ لب و خط چشم",
    bio: "رنگ‌شناسی و انتخاب تُن متناسب با پوست، نقطه قوت کار اوست؛ از ظرافت خط تا یکدستی رنگ.",
    specialties: ["lip-shading", "eyeliner", "microblading"],
    photo: null,
    documents: [],
    hours: week("11:00", "20:00", [1]),
    isPlaceholder: true,
    active: true,
  },
  {
    id: "s3",
    name: "الناز",
    title: "متخصص ویبروز ابرو و مدرس آکادمی",
    bio: "در کنار اجرای خدمات ابرو و لب، آموزش عملی هنرجویان آکادمی Vida را همراهی می‌کند.",
    specialties: ["fibroze", "vibroze", "lip-shading", "eyeliner"],
    photo: null,
    documents: [],
    hours: week("10:00", "18:00", [3]),
    isPlaceholder: true,
    active: true,
  },
];

export const ANY_SPECIALIST = "any";
