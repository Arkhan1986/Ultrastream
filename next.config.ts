import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Skip API routes during export - Android app will use direct fetch
  // since it doesn't have mixed content restrictions
  trailingSlash: true,
};

export default nextConfig;
