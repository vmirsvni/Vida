import type { Metadata } from "next";
import { Success3 } from "@/components/demo3/flow/Success3";

export const metadata: Metadata = { title: "رزرو ثبت شد", robots: { index: false, follow: false } };

export default async function Demo3Success(props: PageProps<"/demo-3/booking/success/[id]">) {
  const { id } = await props.params;
  return <Success3 id={decodeURIComponent(id)} />;
}
