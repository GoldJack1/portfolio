import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: allow phone/LAN testing at http://192.168.x.x:3000 (not just localhost).
  // Without this, Next.js returns 403 for /_next/* so React never hydrates.
  allowedDevOrigins: [
    "192.168.0.77",
    "192.168.*.*",
    "10.*.*.*",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["motion/react"],
  },
  async headers() {
    return [
      {
        source: "/projects/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
