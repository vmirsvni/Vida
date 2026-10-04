import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-[#faf6f0] px-6 text-center">
      <p className="t-latin-italic text-[96px] leading-none text-champagne">404</p>
      <h1 className="t-h2 mt-6 text-wine">این صفحه پیدا نشد.</h1>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          همه دموها
        </Link>
        <Link href="/demo-4" className="btn btn-ghost text-wine">
          دمو ۳
        </Link>
      </div>
    </main>
  );
}
