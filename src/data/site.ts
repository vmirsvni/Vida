import type { Settings } from "./types";

/* ──────────────────────────────────────────────────────────────
   SITE — business facts.
   Confirmed by the owner: name, phone, address.
   ⚠️ PLACEHOLDER: Instagram handle, map coordinates, opening hours text.
   ────────────────────────────────────────────────────────────── */

export const site = {
  name: "Vida Beauty",
  nameFa: "ویدا بیوتی",
  city: "سبزوار",
  phone: "09381109159",
  phoneIntl: "+989381109159",
  address: "سبزوار - چهار راه سونالوکس - نرسیده به پارک بانوان",
  instagram: {
    handle: "@vida.beauty", // ⚠️ PLACEHOLDER — real Instagram ID not yet provided
    url: "https://instagram.com/", // ⚠️ PLACEHOLDER
    isPlaceholder: true,
  },
  map: {
    // ⚠️ PLACEHOLDER — directions open a search for the address until exact coordinates are provided
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("سبزوار چهارراه سونالوکس پارک بانوان"),
    isPlaceholder: true,
  },
  hoursText: "شنبه تا پنجشنبه · ۱۰ تا ۲۰", // ⚠️ DEMO
  url: "https://vida-beauty.example", // ⚠️ set the production domain
};

export const defaultSettings: Settings = {
  salonName: "Vida Beauty",
  phone: site.phone,
  bufferMin: 15,
  cancellationWindowHours: 24,
  cancellationFeePercent: 20,
  bookingHorizonDays: 45,
  slotStepMin: 15,
};
