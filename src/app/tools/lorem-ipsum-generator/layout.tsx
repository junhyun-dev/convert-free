import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Free Online",
  description: "Generate Lorem Ipsum placeholder text for your designs and layouts. Choose 1-20 paragraphs. Free, 100% browser-based.",
  keywords: ["lorem ipsum generator", "placeholder text", "dummy text generator", "lorem ipsum online", "filler text"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Lorem Ipsum Generator", description: "Generate Lorem Ipsum placeholder text with customizable paragraph count.",
  url: "https://www.convertfree.cc/tools/lorem-ipsum-generator", applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "Lorem Ipsum Generator", item: "https://www.convertfree.cc/tools/lorem-ipsum-generator" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
