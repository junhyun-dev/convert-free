import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMP to JPG Converter - Free Online",
  description:
    "Convert BMP bitmap images to JPG format for massively reduced file sizes. Free, fast, and 100% browser-based. No upload required.",
  keywords: ["bmp to jpg", "bitmap to jpg", "bmp to jpeg", "convert bmp to jpg", "bmp converter", "image converter", "free converter"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BMP to JPG Converter",
  description: "Convert BMP bitmap images to JPG format for massively reduced file sizes. Free and browser-based.",
  url: "https://www.convertfree.cc/tools/bmp-to-jpg",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "BMP to JPG", item: "https://www.convertfree.cc/tools/bmp-to-jpg" }] };

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
