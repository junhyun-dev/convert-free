import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import NavDropdown from "@/components/nav-dropdown";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.convertfree.cc"),
  alternates: { canonical: "./" },
  title: {
    default: "ConvertFree - Free Online File Converter",
    template: "%s | ConvertFree",
  },
  description:
    "Convert images, PDFs, and files for free. 100% browser-based, no upload to servers. JPG to PNG, PDF to Image, Image Compressor and more.",
  keywords: [
    "file converter",
    "image converter",
    "pdf converter",
    "jpg to png",
    "png to jpg",
    "free online converter",
  ],
  verification: {
    google: "zkSlO1rHvidxpB4w0AL-bb8qxtRqCxGlG62MAWdYFuI",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ConvertFree",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2080535898067346"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-43S99DBCTQ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-43S99DBCTQ');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-primary">Convert</span>
              <span className="text-muted-foreground">Free</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <NavDropdown />
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>
                ConvertFree - 100% browser-based. Your files never leave your device.
              </p>
              <div className="flex gap-4">
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
                <Link href="/privacy-policy" className="hover:text-foreground">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-foreground">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
