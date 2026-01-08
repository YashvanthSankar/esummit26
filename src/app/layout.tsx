import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Summit '26 | IIITDM Kancheepuram",
  description: "The premier entrepreneurship summit bringing together visionaries, innovators, and changemakers. March 2026 at IIITDM Kancheepuram.",
  keywords: ["E-Summit", "IIITDM", "Kancheepuram", "Entrepreneurship", "Startup", "Hackathon", "Innovation"],
  authors: [{ name: "E-Cell IIITDM" }],
  openGraph: {
    title: "E-Summit '26 | IIITDM Kancheepuram",
    description: "The premier entrepreneurship summit bringing together visionaries, innovators, and changemakers.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Summit '26 | IIITDM Kancheepuram",
    description: "The premier entrepreneurship summit bringing together visionaries, innovators, and changemakers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
