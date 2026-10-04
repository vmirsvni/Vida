import type { Metadata } from "next";
import { AccountPage } from "@/components/account/AccountPage";

export const metadata: Metadata = {
  title: "پنل کاربر",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountPage />;
}
