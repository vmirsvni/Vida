"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { D2 } from "@/lib/demo";
import { CalendarIcon } from "./icons";

/** Floating black booking pill on mobile, shown once the hero is passed. */
export function MobileBook() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`pb-safe fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pt-3 transition-transform duration-500 lg:hidden ${show ? "translate-y-0" : "translate-y-[120%]"}`}
    >
      <Link
        href={`${D2}/booking`}
        tabIndex={show ? 0 : -1}
        className="flex h-13 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#1c1717] py-3.5 text-[15px] font-semibold text-white shadow-[0_18px_40px_-18px_rgba(28,23,23,.7)]"
      >
        <CalendarIcon size={17} /> رزرو نوبت
      </Link>
    </div>
  );
}
