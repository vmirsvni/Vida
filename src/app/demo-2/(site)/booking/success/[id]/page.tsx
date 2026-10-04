import type { Metadata } from "next";
import { BookingSuccess } from "@/components/booking/BookingSuccess";

export const metadata: Metadata = { title: "رزرو ثبت شد", robots: { index: false, follow: false } };

export default async function Demo2Success(props: PageProps<"/demo-2/booking/success/[id]">) {
  const { id } = await props.params;
  return <BookingSuccess id={decodeURIComponent(id)} />;
}
