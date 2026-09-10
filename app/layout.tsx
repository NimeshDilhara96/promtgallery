import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aiprompts.mommentx.space";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Prompt Gallery - High Quality Midjourney, DALL-E & Stable Diffusion Prompts",
    template: "%s | AI Prompt Gallery",
  },
  description: "Discover, copy, and create stunning AI art with our curated collection of free prompts for Midjourney, DALL-E 3, Stable Diffusion, and Leonardo AI.",
  keywords: [
    "AI Prompts",
    "Midjourney Prompts",
    "DALL-E 3 Prompts",
    "Stable Diffusion Prompts",
    "AI Art Generator",
    "Prompt Engineering",
    "Free AI Prompts",
    "AI Image Prompts",
  ],
  authors: [{ name: "AI Prompt Gallery" }],
  creator: "AI Prompt Gallery",
  publisher: "AI Prompt Gallery",
  verification: {
    google: "MPKtElHbSG4pCpKJqhAXIDSqeu1FfaagHWVTPWr4daM",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AI Prompt Gallery",
    title: "AI Prompt Gallery - High Quality AI Art Prompts",
    description: "Browse our curated collection of high-quality AI art prompts. Copy, customize, and create with one click.",
    images: [
      {
        url: "/image/21.jpg",
        width: 1200,
        height: 630,
        alt: "AI Prompt Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Gallery - High Quality AI Art Prompts",
    description: "Browse our curated collection of high-quality AI art prompts. Copy, customize, and create with one click.",
    images: ["/image/21.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  other: {
    "monetag": "c54abc4d8b484743fd5e8127adfc18fc",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
