import { Hero2 } from "@/components/demo2/Hero2";
import { Academy2, Catalogue2, Footer2, Reviews2, Services2, StartHere, Transform2 } from "@/components/demo2/Sections2";
import { MobileBook } from "@/components/demo2/MobileBook";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { JsonLd, salonLd } from "@/components/site/JsonLd";

export default function Demo2Home() {
  return (
    <div className="min-h-[100svh] bg-[radial-gradient(90%_60%_at_85%_0%,#ecc9c1_0%,#f4dfda_40%,#f8efec_100%)] p-2 sm:p-4 lg:p-8">
      <JsonLd data={salonLd} />
      <main className="mx-auto max-w-[1360px] overflow-hidden rounded-[30px] bg-white p-2 shadow-[0_40px_120px_-60px_rgba(111,69,65,.5)] sm:p-3 lg:rounded-[36px]">
        <Hero2 />
        <StartHere />
        <Services2 />
        <Academy2 />
        <Transform2 />
        <Catalogue2 />
        <Reviews2 />
        <Footer2 />
      </main>
      <MobileBook />
      <DemoSwitcher lifted tone="dark" />
    </div>
  );
}
