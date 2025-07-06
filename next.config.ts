import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['media.licdn.com', 'www.google.com', 'serpapi.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
