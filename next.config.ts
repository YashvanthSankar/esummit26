import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // Empty config to silence turbopack warning
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ptfirahogsvzauvwbjhg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;

