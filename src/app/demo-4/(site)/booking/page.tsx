import type { Metadata } from "next";
import { Suspense } from "react";
import { Booking4 } from "@/components/demo4/flow/Booking4";

export const metadata: Metadata = { title: "رزرو آنالیز و خدمت", alternates: { canonical: "/demo-4/booking" } };

export default function Demo4Booking() {
  return (
    <Suspense fallback={<div className="h-[80vh]" />}>
      <Booking4 />
    </Suspense>
  );
}
