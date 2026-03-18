import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word & Character Counter - Free Online",
  description: "Count words, characters, sentences, paragraphs, and estimate reading time instantly. Free, 100% browser-based.",
  keywords: ["word counter", "character counter", "letter counter", "word count online", "reading time calculator"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Word & Character Counter", description: "Count words, characters, sentences, paragraphs, and estimate reading time.",
  url: "https://www.convertfree.cc/tools/word-counter", applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "Word & Character Counter", item: "https://www.convertfree.cc/tools/word-counter" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
