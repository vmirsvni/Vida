import type { Metadata } from "next";
import { Cart4 } from "@/components/demo4/shop/Cart4";

export const metadata: Metadata = { title: "سبد خرید", robots: { index: false, follow: false } };

export default function Demo4Cart() {
  return <Cart4 />;
}
