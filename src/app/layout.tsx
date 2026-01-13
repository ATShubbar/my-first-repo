import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "StyleAI - AI-Powered Art Style Transfer",
  description: "Transform your photos into stunning artwork using AI-powered style transfer. Browse curated artistic styles and create unique masterpieces.",
  keywords: ["AI", "style transfer", "art", "image generation", "artificial intelligence", "photo editing"],
  authors: [{ name: "StyleAI" }],
  openGraph: {
    title: "StyleAI - AI-Powered Art Style Transfer",
    description: "Transform your photos into stunning artwork using AI-powered style transfer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
