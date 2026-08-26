import type { Metadata } from "next";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicSiteUrl = "https://damonko1.github.io/demoPrediction/";

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  applicationName: "Election Scenario Playground",
  title: {
    default: "2026 Midterm Election Scenario Playground",
    template: "%s | Election Scenario Playground",
  },
  description:
    "Explore how national swing and local race assumptions could reshape the 2026 House and Senate maps, with presidential history available for context.",
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
    title: "2026 Midterm Election Scenario Playground",
    description:
      "Build and share interactive 2026 House and Senate scenarios using sourced historical baselines and transparent assumptions.",
    type: "website",
    url: publicSiteUrl,
    siteName: "Election Scenario Playground",
    images: [
      {
        url: "https://raw.githubusercontent.com/damonko1/demoPrediction/main/public/og-card.png",
        width: 1200,
        height: 630,
        alt: "Election Scenario Playground interactive election lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 Midterm Election Scenario Playground",
    description:
      "Build and share interactive 2026 House and Senate scenarios with historical baselines and transparent assumptions.",
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
