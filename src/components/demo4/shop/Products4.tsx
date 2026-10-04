import Link from "next/link";
import { D4 } from "@/lib/demo";
import { products4 } from "../products4";
import { ProductCard4 } from "./ProductCard4";

const W = "mx-auto max-w-[1320px] px-4 lg:px-8";

/* Home: one featured product beside a 2×2 of the rest (asymmetric, not a card row). */
export function Products4() {
  const [lead, ...rest] = products4;
  return (
    <section id="products" aria-labelledby="pr4-title" className={`${W} pb-20 pt-4 lg:pb-28`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="pr4-title" className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.35]">
            محصولات منتخب Vida
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-7 text-charcoal">برای مراقبت روزانه و روزهای پس از خدمت؛ همان‌هایی که در سالن پیشنهاد می‌کنیم.</p>
        </div>
        <Link href={`${D4}/shop`} className="btn btn-ghost whitespace-nowrap px-6 text-espresso">
          همه محصولات
        </Link>
      </div>
      <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ProductCard4 p={lead} sizes="(min-width: 1024px) 40vw, 100vw" large />
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:col-span-7 lg:gap-x-6">
          {rest.slice(0, 4).map((p) => (
            <li key={p.id}>
              <ProductCard4 p={p} ratio="1/1" sizes="(min-width: 1024px) 27vw, 46vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
