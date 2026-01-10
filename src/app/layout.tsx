import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "E-Summit '26 | IIITDM Kancheepuram",
  description: "The premier entrepreneurship summit of South India. Join us for two days of innovation, inspiration, and incredible opportunities at IIITDM Kancheepuram.",
  keywords: ["E-Summit", "IIITDM", "Kancheepuram", "Entrepreneurship", "Startup", "Hackathon", "Innovation", "E-Cell"],
  authors: [{ name: "E-Cell IIITDM" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "E-Summit '26",
  },
  openGraph: {
    title: "E-Summit '26 | IIITDM Kancheepuram",
    description: "The premier entrepreneurship summit of South India.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Summit '26 | IIITDM Kancheepuram",
    description: "The premier entrepreneurship summit of South India.",
  },
};

import { Bricolage_Grotesque } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CustomCursor from "@/components/CustomCursor";
import ToastProvider from "@/components/ToastProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { PWAProvider } from "@/context/PWAContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`antialiased bg-[#050505] ${bricolage.variable} font-sans`}>
        <PWAProvider>
          <ServiceWorkerRegister />
          <CustomCursor />
          <ToastProvider />
          <PWAInstallPrompt />
          {children}
          <Analytics />
          <SpeedInsights />
        </PWAProvider>
      </body>
    </html>
  );
}
