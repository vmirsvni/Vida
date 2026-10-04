"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { D4 } from "@/lib/demo";
import { Close, UserIcon } from "@/components/ui/Icons";
import { useDemo, useHydrated } from "@/lib/store/store";
import { cartCount } from "./products4";
import { nav4 } from "./data4";

export function Nav4() {
  const [open, setOpen] = useState(false);
  const s = useDemo();
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(s.cart) : 0;
  return (
    /* N5 floating pill: content-sized, detached from the page edges */
    <header className="relative z-30 px-4 pt-4 lg:pt-5">
      <div className="mx-auto flex w-full max-w-[760px] items-center justify-between gap-4 rounded-full border border-line bg-surface/85 py-1.5 pe-1.5 ps-2 backdrop-blur-md lg:w-fit lg:gap-8">
        <Link href={D4} className="flex shrink-0 items-center gap-2" aria-label="Vida Beauty، صفحه اصلی">
          <Image src="/brand/vida-logo-256.webp" alt="" width={34} height={34} className="size-[34px]" priority />
          <span className="nuve-latin whitespace-nowrap text-[16px] font-medium text-espresso max-[359px]:hidden" dir="ltr">
            Vida Beauty
          </span>
        </Link>
        <nav aria-label="منوی اصلی" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[14px] text-charcoal">
            {nav4.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="whitespace-nowrap transition-colors hover:text-espresso">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href={`${D4}/cart`}
            aria-label={count ? `سبد خرید، ${count} کالا` : "سبد خرید"}
            title="سبد خرید"
            className="relative flex size-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream hover:text-espresso"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -left-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-champagne px-1 text-[10px] leading-[18px] text-white">
                {count.toLocaleString("fa-IR")}
              </span>
            )}
          </Link>
          <Link href={`${D4}/account`} aria-label="حساب کاربری" title="حساب کاربری" className="flex size-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream hover:text-espresso">
            <UserIcon size={18} />
          </Link>
          <Link href={`${D4}/booking`} className="btn btn-primary hidden !min-h-10 whitespace-nowrap px-5 text-[13px] sm:inline-flex">
            رزرو نوبت
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منو"
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full bg-espresso text-white lg:hidden"
          >
            <svg width="16" height="11" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
              <path d="M1 1h16M5 6h12M1 11h16" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="منو" className="fixed inset-0 z-50 flex flex-col bg-surface p-5 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="nuve-latin text-[20px] font-medium" dir="ltr">
              Vida Beauty
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="بستن منو" className="flex size-11 items-center justify-center rounded-full border border-espresso/15">
              <Close size={18} />
            </button>
          </div>
          <ul className="mt-10">
            {[{ href: D4, label: "خانه" }, ...nav4, { href: `${D4}/account`, label: "حساب کاربری" }].map((n) => (
              <li key={n.href} className="border-b border-line">
                <Link href={n.href} onClick={() => setOpen(false)} className="block py-4 text-[22px]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`${D4}/booking`} onClick={() => setOpen(false)} className="btn btn-primary mt-auto w-full">
            رزرو نوبت
          </Link>
        </div>
      )}
    </header>
  );
}
