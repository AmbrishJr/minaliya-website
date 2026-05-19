import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [50, 75, 85, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
