import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML to JSON Converter - Free Online",
  description: "Convert XML data to JSON format instantly. Free, 100% browser-based. No upload required.",
  keywords: ["xml to json", "convert xml to json", "xml converter", "xml parser", "data converter"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "XML to JSON Converter", description: "Convert XML markup data to JSON format.",
  url: "https://www.convertfree.cc/tools/xml-to-json", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "XML to JSON", item: "https://www.convertfree.cc/tools/xml-to-json" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
