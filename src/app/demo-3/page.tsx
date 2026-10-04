import { DemoSwitcher } from "@/components/DemoSwitcher";
import { Nav3 } from "@/components/demo3/Nav3";
import { Footer3 } from "@/components/demo3/Footer3";
import { Contact3, Faq3, Hero3, Intro3, Reviews3, Rows3 } from "@/components/demo3/Sections3";

export default function Demo3Home() {
  return (
    <>
      <Nav3 />
      <main>
        <Hero3 />
        <div className="px-2 sm:px-4">
          <Intro3 />
        </div>
        <Rows3 />
        <div className="px-2 sm:px-4">
          <Reviews3 />
        </div>
        <Faq3 />
        <Contact3 />
      </main>
      <Footer3 />
      <DemoSwitcher lifted />
    </>
  );
}
