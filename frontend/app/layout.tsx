import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { brand } from "@/lib/config/brand";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.site.url),
  title: {
    default: "CURE Onchain | Where Trading Meets Impact",
    template: "%s | CURE Onchain",
  },
  description: brand.site.description,
  keywords: ["CURE", "DeFi", "charity", "St. Jude", "trading fees", "onchain", "ethereum"],
  authors: [{ name: "CURE Onchain" }],
  creator: "CURE Onchain",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/cure-favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brand.site.url,
    siteName: brand.site.name,
    title: "CURE Onchain | Where Trading Meets Impact",
    description: brand.site.description,
    images: [
      {
        url: `${brand.site.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CURE Onchain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CURE Onchain | Where Trading Meets Impact",
    description: brand.site.description,
    images: [`${brand.site.url}/og-image.png`],
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
  alternates: {
    canonical: brand.site.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.site.name,
    url: brand.site.url,
    description: brand.site.description,
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.site.name,
    url: brand.site.url,
    description: brand.site.description,
  };

  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${brand.site.url}/#webpage`,
    url: brand.site.url,
    name: "CURE Onchain | Where Trading Meets Impact",
    description: brand.site.description,
    isPartOf: {
      "@id": `${brand.site.url}/#website`,
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--bg)] text-[var(--text)]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
