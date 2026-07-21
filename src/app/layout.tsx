import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Election Forecast Playground",
    description:
      "Build and share interactive President, House, and Senate scenarios with historical baselines, swing controls, and local race overrides.",
    type: "website",
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
