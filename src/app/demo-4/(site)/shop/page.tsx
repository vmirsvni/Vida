import type { Metadata } from "next";
import { Shop4 } from "@/components/demo4/shop/Shop4";

export const metadata: Metadata = {
  title: "محصولات",
  description: "محصولات مراقبتی منتخب Vida Beauty سبزوار؛ خرید آنلاین با پرداخت مستقیم یا اقساطی.",
  alternates: { canonical: "/demo-4/shop" },
};

export default function Demo4Shop() {
  return <Shop4 />;
}
