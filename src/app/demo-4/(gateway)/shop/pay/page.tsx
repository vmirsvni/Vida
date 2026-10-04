import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopPay4 } from "@/components/demo4/shop/ShopPay4";

export const metadata: Metadata = { title: "پرداخت سفارش", robots: { index: false, follow: false } };

export default function Demo4ShopPay() {
  return (
    <Suspense fallback={<div className="h-[100svh]" />}>
      <ShopPay4 />
    </Suspense>
  );
}
