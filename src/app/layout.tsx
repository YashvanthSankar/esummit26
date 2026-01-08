import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Summit '26 | IIITDM Kancheepuram",
  description: "The premier entrepreneurship summit of South India. Join us for two days of innovation, inspiration, and incredible opportunities at IIITDM Kancheepuram.",
  keywords: ["E-Summit", "IIITDM", "Kancheepuram", "Entrepreneurship", "Startup", "Hackathon", "Innovation", "E-Cell"],
  authors: [{ name: "E-Cell IIITDM" }],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#050505]">
        {children}
      </body>
    </html>
  );
}
