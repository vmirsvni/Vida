import type { Metadata } from "next";
import { Suspense } from "react";
import { Checkout4 } from "@/components/demo4/flow/Checkout4";

export const metadata: Metadata = { title: "پرداخت", robots: { index: false, follow: false } };

export default function Demo4Pay() {
  return (
    <Suspense fallback={<div className="h-[100svh]" />}>
      <Checkout4 />
    </Suspense>
  );
}
