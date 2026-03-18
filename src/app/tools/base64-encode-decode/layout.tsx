import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder - Free Online",
  description: "Encode and decode Base64 strings instantly. Supports UTF-8 text. Free, 100% browser-based. No data sent to server.",
  keywords: ["base64 encode", "base64 decode", "base64 converter", "base64 online", "base64 encoder decoder"],
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Base64 Encoder & Decoder", description: "Encode and decode Base64 strings with full UTF-8 support.",
  url: "https://www.convertfree.cc/tools/base64-encode-decode", applicationCategory: "DeveloperApplication",
  operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.convertfree.cc" }, { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.convertfree.cc/all-tools" }, { "@type": "ListItem", position: 3, name: "Base64 Encoder & Decoder", item: "https://www.convertfree.cc/tools/base64-encode-decode" }] };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />{children}</>);
}
