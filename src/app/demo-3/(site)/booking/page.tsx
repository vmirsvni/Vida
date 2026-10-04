import type { Metadata } from "next";
import { Suspense } from "react";
import { Booking3 } from "@/components/demo3/flow/Booking3";

export const metadata: Metadata = { title: "رزرو آنلاین نوبت", alternates: { canonical: "/demo-3/booking" } };

export default function Demo3Booking() {
  return (
    <Suspense fallback={<div className="h-[70vh]" />}>
      <Booking3 />
    </Suspense>
  );
}
