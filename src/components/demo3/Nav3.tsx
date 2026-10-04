"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { D3 } from "@/lib/demo";
import { Close, UserIcon } from "@/components/ui/Icons";
import { nav3 } from "./data3";


export function Nav3() {
  const [open, setOpen] = useState(false);
  return (
    /* N6 masthead: centred wordmark, account + booking at the edges, links on a ruled row below */
    <header className="relative z-30">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center lg:h-24">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={open}
              className="flex size-11 items-center justify-center rounded-full bg-espresso text-on-dark lg:hidden"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                <path d="M1 1h16M5 6h12M1 11h16" />
              </svg>
            </button>
            <Link href={`${D3}/account`} aria-label="پنل کاربر" title="پنل کاربر" className="flex size-11 items-center justify-center rounded-full border border-espresso/20 transition-colors hover:border-espresso">
              <UserIcon size={19} />
            </Link>
          </div>
          <Link href={D3} className="flex items-center gap-3" aria-label="Vida Beauty، صفحه اصلی">
            <Image src="/brand/vida-logo-256.webp" alt="" width={40} height={40} className="size-9 lg:size-10" priority />
            <span className="nue-latin whitespace-nowrap text-[22px] text-espresso max-[359px]:hidden lg:text-[28px]" dir="ltr">
              Vida Beauty
            </span>
          </Link>
          <div className="flex justify-end">
            <Link href={`${D3}/booking`} className="btn btn-primary hidden whitespace-nowrap sm:inline-flex">
              رزرو نوبت
            </Link>
            <Link href={`${D3}/booking`} className="btn btn-primary !min-h-11 whitespace-nowrap !px-4 text-[13px] sm:hidden">
              رزرو
            </Link>
          </div>
        </div>
        <nav aria-label="منوی اصلی" className="hidden border-y border-line lg:block">
          <ul className="flex items-center justify-center gap-10 py-3 text-[13px] tracking-wide text-charcoal">
            {nav3.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-draw whitespace-nowrap hover:text-espresso">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="منو" className="nue-dark fixed inset-0 z-50 flex flex-col p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="nue-latin text-[26px] text-tan-light" dir="ltr">
              Vida Beauty
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن منو"
              className="flex size-11 items-center justify-center rounded-full border border-on-dark/25"
            >
              <Close size={18} />
            </button>
          </div>
          <ul className="mt-12 space-y-1">
            {[{ href: D3, label: "خانه" }, ...nav3].map((n) => (
              <li key={n.href} className="border-b border-on-dark/10">
                <Link href={n.href} onClick={() => setOpen(false)} className="block py-4 text-[22px]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`${D3}/booking`} onClick={() => setOpen(false)} className="btn mt-auto w-full bg-champagne text-surface">
            رزرو نوبت
          </Link>
        </div>
      )}
    </header>
  );
}
