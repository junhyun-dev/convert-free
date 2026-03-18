import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TSV to CSV Converter - Free Online",
  description: "Convert TSV (Tab-Separated Values) to CSV format instantly. Free, 100% browser-based. No upload required.",
  keywords: ["tsv to csv", "convert tsv to csv", "tab separated to comma separated", "tsv converter", "data converter"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "TSV to CSV Converter", description: "Convert tab-separated values to comma-separated values format.",
  url: "https://www.convertfree.cc/tools/tsv-to-csv", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "TSV to CSV", item: "https://www.convertfree.cc/tools/tsv-to-csv" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
