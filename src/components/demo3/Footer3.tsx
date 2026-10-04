import Link from "next/link";
import { D3 } from "@/lib/demo";
import { site } from "@/data/site";
import { faNum } from "@/lib/format";
import { nav3 } from "./data3";

/* Statement close: one line carries the page; a single quiet meta row beneath. */
export function Footer3() {
  return (
    <footer className="nue-dark mt-20 rounded-t-[40px] lg:mt-28 lg:rounded-t-[56px]">
      <div className="mx-auto max-w-[1240px] px-6 pb-10 pt-16 lg:px-10 lg:pt-24">
        <p className="nue-display max-w-[16ch] text-[clamp(34px,5vw,64px)] leading-[1.35]">ظرافت در جزئیات، زیبایی ماندگار.</p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href={`${D3}/booking`} className="btn whitespace-nowrap bg-champagne text-surface hover:bg-accent-deep">
            رزرو نوبت
          </Link>
          <a href={`tel:${site.phone}`} className="btn btn-ghost whitespace-nowrap text-on-dark" dir="ltr">
            {faNum(site.phone)}
          </a>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-on-dark/15 pt-6 text-[13px] text-on-dark/70 lg:flex-row lg:items-center lg:justify-between">
          <span>
            <span className="nue-latin text-[18px] text-on-dark" dir="ltr">
              Vida Beauty
            </span>{" "}
            · {site.address}
          </span>
          <nav aria-label="پیوندهای پایین صفحه">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[...nav3, { href: `${D3}/booking`, label: "رزرو آنلاین" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="whitespace-nowrap transition-colors hover:text-tan-light">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-4 text-[12px] text-on-dark/50">© {faNum(new Date().getFullYear())} Vida Beauty · نسخه نمایشی؛ تصاویر، قیمت‌ها و نظرات موقت هستند.</p>
      </div>
    </footer>
  );
}
