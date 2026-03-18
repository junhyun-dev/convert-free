import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMP to PNG Converter - Free Online",
  description:
    "Convert BMP bitmap images to PNG format with lossless compression. Drastically reduce file size while keeping perfect quality. Free and browser-based.",
  keywords: ["bmp to png", "bitmap to png", "convert bmp to png", "bmp converter", "image converter", "free converter"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BMP to PNG Converter",
  description: "Convert BMP bitmap images to PNG format with lossless compression. Reduce file size while keeping perfect quality.",
  url: "https://www.convertfree.cc/tools/bmp-to-png",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "BMP to PNG", item: "https://www.convertfree.cc/tools/bmp-to-png" }] };

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
