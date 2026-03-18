import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Case Converter - Free Online",
  description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case. Free, 100% browser-based.",
  keywords: ["case converter", "text case converter", "uppercase converter", "camelcase converter", "snake case converter", "kebab case"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Text Case Converter", description: "Convert text between multiple case formats including camelCase, snake_case, and kebab-case.",
  url: "https://www.convertfree.cc/tools/case-converter", applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "Text Case Converter", item: "https://www.convertfree.cc/tools/case-converter" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
