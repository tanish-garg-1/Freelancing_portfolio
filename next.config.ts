import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // keep the dev-only Next.js badge away from the social icons in the bottom-left corner
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
