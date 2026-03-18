import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to XML Converter - Free Online",
  description: "Convert JSON data to XML format instantly. Free, 100% browser-based. No upload required.",
  keywords: ["json to xml", "convert json to xml", "json converter", "xml generator", "data converter"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "JSON to XML Converter", description: "Convert JSON data to XML markup format.",
  url: "https://www.convertfree.cc/tools/json-to-xml", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "JSON to XML", item: "https://www.convertfree.cc/tools/json-to-xml" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
