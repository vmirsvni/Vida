import { DemoSwitcher } from "@/components/DemoSwitcher";
import { Nav4 } from "@/components/demo4/Nav4";
import { ScanHero } from "@/components/demo4/ScanHero";
import { Statement4 } from "@/components/demo4/Statement4";
import { Team4 } from "@/components/demo4/Team4";
import { Products4 } from "@/components/demo4/shop/Products4";
import { Analysis4, Faq4, Footer4, Reviews4, Services4 } from "@/components/demo4/Sections4";

export default function Demo4Home() {
  return (
    <>
      <div className="nuve-stage">
        <Nav4 />
      </div>
      <main>
        <div className="nuve-stage">
          <ScanHero />
        </div>
        <Analysis4 />
        <Services4 />
        <Team4 />
        <Statement4 />
        <Products4 />
        <Reviews4 />
        <Faq4 />
      </main>
      <Footer4 />
      <DemoSwitcher lifted />
    </>
  );
}
