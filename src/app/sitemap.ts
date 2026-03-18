import type { MetadataRoute } from "next";

const BASE = "https://www.convertfree.cc";

const tools = [
  // Image Converters
  "jpg-to-png", "png-to-jpg", "webp-to-png", "png-to-webp", "svg-to-png",
  "heic-to-jpg", "webp-to-jpg", "jpg-to-webp", "bmp-to-png", "bmp-to-jpg",
  "gif-to-png", "avif-to-png", "avif-to-jpg",
  // Image Tools
  "image-resizer", "image-compressor",
  // PDF Tools
  "pdf-to-image", "image-to-pdf", "pdf-merge", "pdf-split",
  // Video
  "gif-to-mp4", "mp4-to-gif",
  // Data Converters
  "csv-to-json", "json-to-csv", "xml-to-json", "json-to-xml",
  "yaml-to-json", "json-to-yaml", "tsv-to-csv", "html-to-markdown",
  // Document
  "markdown-to-pdf",
  // Text Utilities
  "base64-encode-decode", "url-encode-decode", "json-formatter",
  "case-converter", "word-counter", "lorem-ipsum-generator",
  // Generator
  "qr-code-generator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries = tools.map((t) => ({
    url: `${BASE}/tools/${t}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/all-tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...toolEntries,
  ];
}
