import { DemoSwitcher } from "@/components/DemoSwitcher";
import { Nav4 } from "@/components/demo4/Nav4";
import { Footer4 } from "@/components/demo4/Sections4";

/* Booking + user panel pages of demo 4 share the landing's nav and footer. */
export default function Demo4FlowLayout({ children }: LayoutProps<"/demo-4">) {
  return (
    <div className="min-h-[100svh]">
      <Nav4 />
      <main>{children}</main>
      <Footer4 />
      <DemoSwitcher lifted />
    </div>
  );
}
