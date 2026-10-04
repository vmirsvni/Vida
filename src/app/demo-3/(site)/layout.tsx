import Link from "next/link";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { Nav3 } from "@/components/demo3/Nav3";
import { Footer3 } from "@/components/demo3/Footer3";

/* Booking + user panel pages of demo 3 share the landing's nav and footer. */
export default function Demo3FlowLayout({ children }: LayoutProps<"/demo-3">) {
  return (
    <div className="min-h-[100svh]">
      <Nav3 />
      <main>{children}</main>
      <Footer3 />
      <DemoSwitcher lifted />
      <Link href="/demo-3" className="sr-only">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
