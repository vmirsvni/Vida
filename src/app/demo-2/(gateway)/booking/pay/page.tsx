import type { Metadata } from "next";
import { Suspense } from "react";
import { MockGateway } from "@/components/booking/MockGateway";

export const metadata: Metadata = { title: "درگاه پرداخت آزمایشی", robots: { index: false, follow: false } };

export default function Demo2Pay() {
  return (
    <Suspense fallback={<div className="h-[100svh]" />}>
      <MockGateway />
    </Suspense>
  );
}
