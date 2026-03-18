import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVIF to PNG Converter - Free Online",
  description:
    "Convert AVIF images to PNG format with lossless quality. Perfect for editing or sharing AVIF files everywhere. Free, fast, and 100% browser-based.",
  keywords: ["avif to png", "convert avif to png", "avif converter", "avif image converter", "image converter", "free converter"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AVIF to PNG Converter",
  description: "Convert AVIF images to PNG format with lossless quality. Free, fast, and browser-based.",
  url: "https://www.convertfree.cc/tools/avif-to-png",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "AVIF to PNG", item: "https://www.convertfree.cc/tools/avif-to-png" }] };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
