"use client";

import Image from "next/image";
import Link from "next/link";
import { getMedia4 } from "@/data/media4";
import { METHODS, nextDue, remainingOf } from "@/lib/booking/payment";
import { payOrderInstallment, useDemo } from "@/lib/store/store";
import { faDateLong, faNum, toman } from "@/lib/format";
import { D4 } from "@/lib/demo";
import { DELIVERY4, getProduct4 } from "../products4";
import { ORDER_STATUS4 } from "./orderStatus";

/* User panel · «سفارش‌ها» tab: product orders with their installment plan. */
export function AccountOrders4({ phone }: { phone: string }) {
  const s = useDemo();
  const mine = (s.orders ?? []).filter((o) => o.customer.phone === phone && o.status !== "awaiting_payment");
  if (!mine.length) {
    return (
      <div className="rounded-[28px] bg-cream p-8 text-center">
        <p className="text-[14px] text-charcoal">هنوز سفارشی ثبت نکرده‌اید.</p>
        <Link href={`${D4}/shop`} className="btn btn-primary mt-5 px-6">
          مشاهده محصولات
        </Link>
      </div>
    );
  }
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {mine.map((o) => {
        const n = o.payment ? nextDue(o.payment) : undefined;
        const left = o.payment ? remainingOf(o.payment) : 0;
        return (
          <li key={o.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="nuve-latin text-[15px] font-medium" dir="ltr" style={{ textAlign: "right" }}>
                  {o.id}
                </p>
                <p className="text-[12px] text-muted">
                  {faDateLong(o.createdAt.slice(0, 10))} · {DELIVERY4[o.delivery.method].title}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-tint px-2.5 py-0.5 text-[11px] text-accent-deep">{ORDER_STATUS4[o.status]}</span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {o.items.map((it) => {
                const p = getProduct4(it.id);
                if (!p) return null;
                const m = getMedia4(p.image);
                return (
                  <li key={it.id} className="flex items-center gap-2 rounded-full bg-cream py-1 pe-3 ps-1 text-[12px]">
                    <span className="relative block size-8 overflow-hidden rounded-full">
                      <Image src={m.src} alt="" fill sizes="32px" className="object-cover" style={{ objectPosition: m.focal }} />
                    </span>
                    {p.name} {it.qty > 1 && <span className="text-muted">× {faNum(it.qty)}</span>}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4 text-[13px]">
              <span className="text-charcoal">{o.payment ? METHODS[o.payment.method].title : ""}</span>
              <span>
                {toman(o.paid)} <span className="text-muted">از {toman(o.total)}</span>
              </span>
            </div>
            {n && left > 0 && (
              <>
                <ol className="mt-3 space-y-1.5">
                  {o.payment!.installments.map((i) => (
                    <li key={i.n} className="flex items-center gap-3 text-[12px]">
                      <span className={`flex size-6 items-center justify-center rounded-full text-[11px] ${i.paidAt ? "bg-espresso text-white" : "bg-cream text-charcoal"}`}>{i.paidAt ? "✓" : faNum(i.n)}</span>
                      <span className="flex-1 text-charcoal">{faDateLong(i.due)}</span>
                      <span className="font-medium">{toman(i.amount)}</span>
                    </li>
                  ))}
                </ol>
                <button type="button" onClick={() => payOrderInstallment(o.id, n.n)} className="btn btn-primary mt-4 w-full whitespace-nowrap">
                  پرداخت قسط {faNum(n.n)} · {toman(n.amount)}
                </button>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
