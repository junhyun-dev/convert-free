import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Free Online",
  description: "Convert JSON arrays to CSV format instantly. Free, 100% browser-based. No upload required.",
  keywords: ["json to csv", "convert json to csv", "json converter", "data converter", "json array to csv"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "JSON to CSV Converter", description: "Convert JSON array data to CSV spreadsheet format.",
  url: "https://www.convertfree.cc/tools/json-to-csv", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "JSON to CSV", item: "https://www.convertfree.cc/tools/json-to-csv" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
