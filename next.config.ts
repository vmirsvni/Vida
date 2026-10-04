import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80, 90],
    deviceSizes: [390, 430, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    // demo assets change often while the owner reviews; keep optimiser/browser caches short
    minimumCacheTTL: 60 * 60,
  },
  async redirects() {
    // the admin panels were replaced by the customer panel (پنل کاربر)
    const admin = ["demo-2", "demo-3", "demo-4"].flatMap((d) => [
      { source: `/${d}/admin`, destination: `/${d}/account`, permanent: false },
      { source: `/${d}/admin/:rest*`, destination: `/${d}/account`, permanent: false },
    ]);
    return [
      // demo 1 was removed — its old links land on the demo chooser
      { source: "/demo-1", destination: "/", permanent: false },
      { source: "/demo-1/:rest*", destination: "/", permanent: false },
      { source: "/admin", destination: "/demo-4/account", permanent: false },
      { source: "/admin/:rest*", destination: "/demo-4/account", permanent: false },
      { source: "/account", destination: "/demo-4/account", permanent: false },
      ...admin,
    ];
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
      {
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
