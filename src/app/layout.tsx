import type { Metadata } from "next";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicSiteUrl = "https://damonko1.github.io/demoPrediction/";

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  applicationName: "Election Forecast Playground",
  title: {
    default: "Election Forecast Playground",
    template: "%s | Election Forecast Playground",
  },
  description:
    "Explore how national swing, demographic-style assumptions, and local race overrides reshape the presidential, House, and Senate map.",
  keywords: [
    "election simulator",
    "Electoral College map",
    "House election map",
    "Senate election map",
    "election data visualization",
    "political scenario analysis",
  ],
  category: "education",
  alternates: {
    canonical: publicSiteUrl,
  },
  icons: {
    icon: `${publicBasePath}/favicon.svg`,
    shortcut: `${publicBasePath}/favicon.svg`,
    apple: `${publicBasePath}/apple-touch-icon.png`,
  },
  openGraph: {
    title: "Election Forecast Playground",
    description:
      "Build and share interactive President, House, and Senate scenarios with historical baselines, swing controls, and local race overrides.",
    type: "website",
    url: publicSiteUrl,
    siteName: "Election Forecast Playground",
    images: [
      {
        url: "https://raw.githubusercontent.com/damonko1/demoPrediction/main/public/og-card.png",
        width: 1200,
        height: 630,
        alt: "Election Forecast Playground interactive election lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Election Forecast Playground",
    description:
      "Build and share interactive President, House, and Senate scenarios with historical baselines and transparent assumptions.",
    images: [
      "https://raw.githubusercontent.com/damonko1/demoPrediction/main/public/og-card.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
