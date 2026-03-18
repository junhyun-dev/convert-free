import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to WebP Converter - Free Online",
  description:
    "Convert JPG/JPEG images to WebP format for smaller file sizes and faster page loads. Free, fast, and 100% browser-based.",
  keywords: ["jpg to webp", "jpeg to webp", "convert jpg to webp", "webp converter", "image optimizer", "free converter"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JPG to WebP Converter",
  description: "Convert JPG/JPEG images to WebP format for smaller file sizes and faster page loads.",
  url: "https://www.convertfree.cc/tools/jpg-to-webp",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "JPG to WebP", item: "https://www.convertfree.cc/tools/jpg-to-webp" }] };

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
