import type { Metadata } from "next";
import { Account4 } from "@/components/demo4/flow/Account4";

export const metadata: Metadata = { title: "پنل کاربر", robots: { index: false, follow: false } };

export default function Page() {
  return <Account4 />;
}
