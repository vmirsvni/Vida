import type { Metadata } from "next";
import { RevealObserver } from "@/components/ui/Reveal";
import "../demo3.css";

export const metadata: Metadata = {
  title: { absolute: "Vida Beauty | دمو ۲، آتلیه زیبایی و PMU سبزوار", template: "%s | Vida Beauty · دمو ۲" },
  description: "Vida Beauty سبزوار؛ میکروبلیدینگ، فیبروز، ویبروز، شیدینگ لب و خط چشم. رزرو آنلاین و پرداخت اقساطی.",
  alternates: { canonical: "/demo-3" },
};

export default function Demo3Layout({ children }: LayoutProps<"/demo-3">) {
  return (
    <div className="theme-nue min-h-[100svh] overflow-x-clip">
      {children}
      <RevealObserver />
    </div>
  );
}
