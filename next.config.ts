import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

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

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
  sw: "sw.js",
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig);

