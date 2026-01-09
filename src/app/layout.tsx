import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Summit '26 | IIITDM Kancheepuram",
  description: "The premier entrepreneurship summit of South India. Join us for two days of innovation, inspiration, and incredible opportunities at IIITDM Kancheepuram.",
  keywords: ["E-Summit", "IIITDM", "Kancheepuram", "Entrepreneurship", "Startup", "Hackathon", "Innovation", "E-Cell"],
  authors: [{ name: "E-Cell IIITDM" }],
  manifest: "/manifest.json",
  themeColor: "#000000",
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
import CustomCursor from "@/components/CustomCursor";
import ToastProvider from "@/components/ToastProvider";

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
      <body className={`antialiased bg-[#050505] ${bricolage.variable} font-sans`}>
        <CustomCursor />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
