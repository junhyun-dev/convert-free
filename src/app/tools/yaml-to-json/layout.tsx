import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML to JSON Converter - Free Online",
  description: "Convert YAML data to JSON format instantly. Free, 100% browser-based. No upload required.",
  keywords: ["yaml to json", "convert yaml to json", "yaml converter", "yaml parser", "data converter"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "YAML to JSON Converter", description: "Convert YAML configuration data to JSON format.",
  url: "https://www.convertfree.cc/tools/yaml-to-json", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "YAML to JSON", item: "https://www.convertfree.cc/tools/yaml-to-json" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
