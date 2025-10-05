import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Amplify Hosting with SSR/API routes
  output: 'standalone',
  
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
