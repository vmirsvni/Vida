import type { Metadata } from "next";
import { OrderSuccess4 } from "@/components/demo4/shop/OrderSuccess4";

export const metadata: Metadata = { title: "سفارش ثبت شد", robots: { index: false, follow: false } };

export default async function Demo4OrderSuccess(props: PageProps<"/demo-4/shop/success/[id]">) {
  const { id } = await props.params;
  return <OrderSuccess4 id={decodeURIComponent(id)} />;
}
