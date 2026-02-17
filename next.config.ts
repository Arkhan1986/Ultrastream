import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Capacitor static export
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Add trailing slash for better routing in Capacitor
  trailingSlash: true,
  
  // Disable server-side features
  reactStrictMode: true,
};

export default nextConfig;
