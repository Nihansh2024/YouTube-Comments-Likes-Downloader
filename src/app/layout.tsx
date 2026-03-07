import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://commentflow.app"),
  title: {
    default: "CommentFlow - Free YouTube Comments Downloader | Export to CSV & Excel",
    template: "%s | CommentFlow"
  },
  description: "Download YouTube comments for FREE. Extract, analyze, and export comments to CSV or Excel in seconds. Unlimited downloads, no signup required. Perfect for creators, marketers, and researchers.",
  keywords: [
    "YouTube comments downloader",
    "download YouTube comments",
    "export YouTube comments",
    "YouTube comment extractor",
    "YouTube comments to CSV",
    "YouTube comments to Excel",
    "free YouTube comment tool",
    "YouTube comment analyzer",
    "scrape YouTube comments",
    "YouTube comment export tool",
    "bulk download YouTube comments",
    "YouTube comment data extraction",
    "social media analytics",
    "YouTube marketing tool",
    "content creator tools"
  ],
  authors: [{ name: "CommentFlow Team", url: "https://commentflow.app" }],
  creator: "CommentFlow",
  publisher: "CommentFlow",
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
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://commentflow.app",
    siteName: "CommentFlow",
    title: "CommentFlow - Free YouTube Comments Downloader | Export to CSV & Excel",
    description: "Download YouTube comments for FREE. Extract, analyze, and export comments to CSV or Excel in seconds. Unlimited downloads, no signup required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CommentFlow - YouTube Comments Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CommentFlow - Free YouTube Comments Downloader",
    description: "Download YouTube comments for FREE. Export to CSV or Excel instantly. Unlimited downloads!",
    images: ["/og-image.png"],
    creator: "@commentflow",
  },
  alternates: {
    canonical: "https://commentflow.app",
  },
  category: "technology",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CommentFlow",
  "description": "Free YouTube Comments Downloader - Extract and export YouTube comments to CSV or Excel format instantly. No limits, 100% free.",
  "url": "https://commentflow.app",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "100% Free - No credit card required"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "2847",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "Download YouTube comments",
    "Export to CSV format",
    "Export to Excel format",
    "Search and filter comments",
    "Unlimited downloads",
    "No registration required"
  ],
  "screenshot": "https://commentflow.app/screenshot.png",
  "author": {
    "@type": "Organization",
    "name": "CommentFlow",
    "url": "https://commentflow.app"
  }
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is CommentFlow really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! CommentFlow is 100% free with unlimited downloads. No credit card required, no hidden fees, and no download limits."
      }
    },
    {
      "@type": "Question",
      "name": "How do I download YouTube comments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply paste any YouTube video URL into CommentFlow, click 'Fetch Comments', and then download as CSV or Excel. It takes just seconds!"
      }
    },
    {
      "@type": "Question",
      "name": "What formats can I export comments to?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CommentFlow supports both CSV (Comma Separated Values) and Excel (XLSX) formats, making it easy to analyze data in any spreadsheet application."
      }
    },
    {
      "@type": "Question",
      "name": "Can I search and filter comments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can search comments by keywords, filter by date or likes, and sort the results to find exactly what you need."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://commentflow.app" />
        <meta name="theme-color" content="#7c3aed" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
