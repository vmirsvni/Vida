import Link from "next/link";

/** Floating pill that returns to the demo chooser. `lifted` clears a mobile bottom bar. */
export function DemoSwitcher({ lifted = false, tone = "dark" }: { lifted?: boolean; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label="همه دموها"
      title="همه دموها"
      className={`fixed left-4 z-40 flex h-10 items-center justify-center gap-2 rounded-full max-sm:w-10 sm:px-4 text-[12.5px] shadow-[0_10px_30px_-12px_rgba(0,0,0,.45)] backdrop-blur-md transition-transform hover:-translate-y-0.5 lg:bottom-6 ${
        lifted ? "bottom-[88px]" : "bottom-5"
      } ${tone === "dark" ? "bg-[#1c1717]/85 text-white" : "bg-white/85 text-[#1c1717]"}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
      <span className="max-sm:sr-only">همه دموها</span>
    </Link>
  );
}
