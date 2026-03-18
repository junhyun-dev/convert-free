import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVIF to JPG Converter - Free Online",
  description:
    "Convert AVIF images to JPG format for maximum compatibility. Open AVIF files anywhere by converting to universally supported JPG. Free and browser-based.",
  keywords: ["avif to jpg", "avif to jpeg", "convert avif to jpg", "avif converter", "image converter", "free converter"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AVIF to JPG Converter",
  description: "Convert AVIF images to JPG format for maximum compatibility. Free, fast, and browser-based.",
  url: "https://www.convertfree.cc/tools/avif-to-jpg",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "AVIF to JPG", item: "https://www.convertfree.cc/tools/avif-to-jpg" }] };

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
