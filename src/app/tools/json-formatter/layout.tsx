import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Free Online",
  description: "Format, beautify, and validate JSON data instantly. Supports 2-space, 4-space, and tab indentation. Free, 100% browser-based.",
  keywords: ["json formatter", "json validator", "json beautifier", "json pretty print", "format json online"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "JSON Formatter & Validator", description: "Format, beautify, minify, and validate JSON data online.",
  url: "https://www.convertfree.cc/tools/json-formatter", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "JSON Formatter & Validator", item: "https://www.convertfree.cc/tools/json-formatter" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
