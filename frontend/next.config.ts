import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow images from any domain for avatars
  images: { unoptimized: true },
};

export default nextConfig;
