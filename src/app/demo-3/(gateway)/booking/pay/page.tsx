import type { Metadata } from "next";
import { Suspense } from "react";
import { Checkout3 } from "@/components/demo3/flow/Checkout3";

export const metadata: Metadata = { title: "درگاه پرداخت آزمایشی", robots: { index: false, follow: false } };

export default function Demo3Pay() {
  return (
    <Suspense fallback={<div className="h-[100svh]" />}>
      <Checkout3 />
    </Suspense>
  );
}
