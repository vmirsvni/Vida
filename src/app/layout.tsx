import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Vida Beauty | میکروبلیدینگ، فیبروز و شیدینگ لب در سبزوار",
    template: "%s | Vida Beauty سبزوار",
  },
  description:
    "Vida Beauty؛ آتلیه تخصصی PMU در سبزوار. میکروبلیدینگ، فیبروز و ویبروز ابرو، شیدینگ لب و خط چشم با تمرکز بر ظرافت و زیبایی طبیعی. رزرو آنلاین نوبت.",
  applicationName: "Vida Beauty",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "Vida Beauty",
    images: [{ url: "/images/d4b/portrait.jpg", width: 1112, height: 1400, alt: "Vida Beauty" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/vazirmatn-arabic-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/markazi-text-arabic-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        {/* enables reveal-on-scroll only when JS runs, so content never hides without it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
