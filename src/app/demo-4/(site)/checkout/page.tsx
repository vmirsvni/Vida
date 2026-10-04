import type { Metadata } from "next";
import { ShopCheckout4 } from "@/components/demo4/shop/ShopCheckout4";

export const metadata: Metadata = { title: "ثبت سفارش", robots: { index: false, follow: false } };

export default function Demo4Checkout() {
  return <ShopCheckout4 />;
}
