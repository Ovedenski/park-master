import { Roboto } from "next/font/google";
const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-display",
});

import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import { ThemeProvider } from "./components/theme-provider";
import NavbarMenu from "@/components/navbar";
import { Footer } from "./components/footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ParkMaster — Find and rent parking spots",
    template: "%s · ParkMaster",
  },
  description:
    "ParkMaster is a marketplace for renting private parking spots by the hour or by the month.",
  applicationName: "ParkMaster",
  keywords: [
    "parking",
    "parking rental",
    "private parking",
    "monthly parking",
    "hourly parking",
    "park",
    "паркинг",
    "паркомясто",
  ],
  authors: [{ name: "ParkMaster" }],
  openGraph: {
    type: "website",
    siteName: "ParkMaster",
    title: "ParkMaster — Find and rent parking spots",
    description:
      "Rent a private parking spot by the hour or by the month, or list your own.",
    url: siteUrl,
    locale: "bg_BG",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParkMaster — Find and rent parking spots",
    description:
      "Rent a private parking spot by the hour or by the month, or list your own.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico", sizes: "any" },
      { url: "/images/logo.png", type: "image/png", sizes: "276x276" },
    ],
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" suppressHydrationWarning className={roboto.variable}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarMenu />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
