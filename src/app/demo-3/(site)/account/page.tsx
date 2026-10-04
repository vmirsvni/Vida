import type { Metadata } from "next";
import { Account3 } from "@/components/demo3/flow/Account3";

export const metadata: Metadata = {
  title: "پنل کاربر",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Account3 />;
}
