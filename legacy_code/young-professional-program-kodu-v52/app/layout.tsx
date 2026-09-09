import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.young-professionals.eu"),
  alternates: {
    canonical: "/",
  },
  title: "Young Professionals",
  description: "Gençler için müfredatlar, kitap tavsiyeleri, gezi güzergâhları, aktiviteler ve duyurular.",
  openGraph: {
    title: "Young Professionals",
    description: "Keşfet · Öğren · Birlikte Geliş",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Young Professionals",
    description: "Keşfet · Öğren · Birlikte Geliş",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
