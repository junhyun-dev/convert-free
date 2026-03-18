import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GIF to PNG Converter - Free Online",
  description:
    "Convert GIF images to PNG format. Extracts the first frame of animated GIFs as a high-quality PNG. Free, fast, and 100% browser-based.",
  keywords: ["gif to png", "convert gif to png", "gif converter", "gif first frame", "image converter", "free converter"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GIF to PNG Converter",
  description: "Convert GIF images to PNG format. Extracts the first frame of animated GIFs as a high-quality PNG.",
  url: "https://www.convertfree.cc/tools/gif-to-png",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "GIF to PNG", item: "https://www.convertfree.cc/tools/gif-to-png" }] };

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
