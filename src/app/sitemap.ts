import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { products4 } from "@/components/demo4/products4";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/demo-2`, priority: 0.9 },
    { url: `${site.url}/demo-2/booking`, priority: 0.6 },
    { url: `${site.url}/demo-3`, priority: 0.9 },
    { url: `${site.url}/demo-3/booking`, priority: 0.6 },
    { url: `${site.url}/demo-4`, priority: 0.9 },
    { url: `${site.url}/demo-4/academy`, priority: 0.8 },
    { url: `${site.url}/demo-4/shop`, priority: 0.8 },
    ...products4.map((p) => ({ url: `${site.url}/demo-4/shop/${p.id}`, priority: 0.6 })),
    { url: `${site.url}/demo-4/booking`, priority: 0.6 },
  ];
}
