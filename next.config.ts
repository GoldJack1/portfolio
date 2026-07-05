import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: allow phone/LAN testing at http://192.168.x.x:3000 (not just localhost).
  // Without this, Next.js returns 403 for /_next/* so React never hydrates.
  allowedDevOrigins: [
    "192.168.0.77",
    "192.168.*.*",
    "10.*.*.*",
  ],
};

export default nextConfig;
