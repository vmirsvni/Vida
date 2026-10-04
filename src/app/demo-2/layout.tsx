import type { Metadata } from "next";
import { RevealObserver } from "@/components/ui/Reveal";
import "../demo2.css";

export const metadata: Metadata = {
  title: { absolute: "Vida Beauty | دمو ۱، آتلیه زیبایی و PMU سبزوار", template: "%s | Vida Beauty · دمو ۱" },
  description: "Vida Beauty سبزوار؛ میکروبلیدینگ، فیبروز، ویبروز، شیدینگ لب و خط چشم. رزرو آنلاین نوبت.",
  alternates: { canonical: "/demo-2" },
};

export default function Demo2Layout({ children }: LayoutProps<"/demo-2">) {
  return (
    <div className="theme-rose min-h-[100svh]">
      {children}
      <RevealObserver />
    </div>
  );
}
