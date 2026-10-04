import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    ...["/account", "/booking/pay", "/booking/success"].flatMap((p) => [`/demo-2${p}`, `/demo-3${p}`, `/demo-4${p}`]),
    ...["/cart", "/checkout", "/shop/pay", "/shop/success"].map((p) => `/demo-4${p}`),
  ];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: privatePaths }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
