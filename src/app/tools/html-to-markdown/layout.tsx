import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter - Free Online",
  description: "Convert HTML to Markdown format instantly. Free, 100% browser-based. No upload required.",
  keywords: ["html to markdown", "convert html to markdown", "html converter", "markdown generator", "html to md"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "HTML to Markdown Converter", description: "Convert HTML markup to clean Markdown format.",
  url: "https://www.convertfree.cc/tools/html-to-markdown", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "HTML to Markdown", item: "https://www.convertfree.cc/tools/html-to-markdown" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
