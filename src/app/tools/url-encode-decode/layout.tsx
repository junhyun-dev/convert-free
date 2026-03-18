import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder - Free Online",
  description: "Encode and decode URL strings instantly. Handles special characters and Unicode. Free, 100% browser-based.",
  keywords: ["url encode", "url decode", "url encoder decoder", "percent encoding", "urlencode online"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "URL Encoder & Decoder", description: "Encode and decode URL strings with percent-encoding.",
  url: "https://www.convertfree.cc/tools/url-encode-decode", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "URL Encoder & Decoder", item: "https://www.convertfree.cc/tools/url-encode-decode" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
