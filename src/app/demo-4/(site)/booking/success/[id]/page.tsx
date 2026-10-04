import type { Metadata } from "next";
import { Success4 } from "@/components/demo4/flow/Success4";

export const metadata: Metadata = { title: "نوبت ثبت شد", robots: { index: false, follow: false } };

export default async function Demo4Success(props: PageProps<"/demo-4/booking/success/[id]">) {
  const { id } = await props.params;
  return <Success4 id={decodeURIComponent(id)} />;
}
