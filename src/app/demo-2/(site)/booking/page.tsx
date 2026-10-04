import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = { title: "رزرو آنلاین نوبت", alternates: { canonical: "/demo-2/booking" } };

export default function Demo2Booking() {
  return (
    <Suspense fallback={<div className="h-[70vh]" />}>
      <BookingFlow />
    </Suspense>
  );
}
