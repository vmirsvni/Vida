import Image from "next/image";
import Link from "next/link";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { D2 } from "@/lib/demo";
import { site } from "@/data/site";
import { faNum } from "@/lib/format";

/* Slim shell for the demo 2 booking pages. */
export default function Demo2FlowLayout({ children }: LayoutProps<"/demo-2">) {
  return (
    <div className="min-h-[100svh] bg-[radial-gradient(90%_50%_at_85%_0%,#f1d6cf_0%,#f8efec_55%)] p-2 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[28px] bg-white">
        <header className="flex h-16 items-center justify-between border-b border-[#efe4e0] px-4 sm:px-8 lg:h-20">
          <Link href={D2} className="flex items-center gap-2 text-[14px]">
            <span className="flex h-10 items-center rounded-full bg-[#f8efec] px-4">← بازگشت به سایت</span>
          </Link>
          <Link href={D2} className="flex items-center gap-2" aria-label="Vida Beauty">
            <Image src="/brand/vida-logo-256.webp" alt="" width={36} height={36} className="size-9" />
            <span className="hidden font-bold sm:inline" dir="ltr">
              VidaBeauty
            </span>
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="hidden h-10 items-center rounded-full border border-[#efe4e0] px-4 text-[13px] sm:flex"
          >
            {faNum(site.phone)}
          </a>
        </header>
        <main>{children}</main>
      </div>
      <DemoSwitcher lifted />
    </div>
  );
}
