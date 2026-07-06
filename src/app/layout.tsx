import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Election Forecast Playground",
  description:
    "A simple, interactive Electoral College scenario playground for exploring national swing assumptions.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Election Forecast Playground",
    description:
      "Explore Electoral College scenarios with historical baselines, swing controls, and compact share previews.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Election Forecast Playground",
    description:
      "Explore Electoral College scenarios with historical baselines, swing controls, and compact share previews.",
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
