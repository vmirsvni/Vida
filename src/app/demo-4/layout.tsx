import type { Metadata } from "next";
import { RevealObserver } from "@/components/ui/Reveal";
import "../demo4.css";

export const metadata: Metadata = {
  title: { absolute: "Vida Beauty | دمو ۳، آکادمی و PMU سبزوار", template: "%s | Vida Beauty · دمو ۳" },
  description: "Vida Beauty سبزوار؛ آنالیز تخصصی چهره، میکروبلیدینگ، فیبروز، ویبروز، شیدینگ لب و خط چشم. رزرو آنلاین و پرداخت اقساطی.",
  alternates: { canonical: "/demo-4" },
};

export default function Demo4Layout({ children }: LayoutProps<"/demo-4">) {
  return (
    <div className="theme-nuve min-h-[100svh] overflow-x-clip">
      {children}
      <RevealObserver />
    </div>
  );
}
