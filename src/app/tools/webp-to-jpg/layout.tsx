import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebP to JPG Converter - Free Online",
  description:
    "Convert WebP images to JPG format instantly. Free, fast, and 100% browser-based. No upload required — your files stay on your device.",
  keywords: ["webp to jpg", "webp to jpeg", "convert webp to jpg", "webp converter", "image converter", "free converter"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "WebP to JPG Converter",
  description: "Convert WebP images to JPG format instantly. Free, fast, and browser-based.",
  url: "https://www.convertfree.cc/tools/webp-to-jpg",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "WebP to JPG", item: "https://www.convertfree.cc/tools/webp-to-jpg" }] };

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
