import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Free Online Tools - ConvertFree",
  description: "Browse all 37 free online file conversion and utility tools. Image converters, PDF tools, data converters, text utilities, and more. 100% browser-based.",
};

const tools = [
  { category: "Image Converters", items: [
    { name: "JPG to PNG", description: "Convert JPG/JPEG to PNG with transparency support.", href: "/tools/jpg-to-png" },
    { name: "PNG to JPG", description: "Convert PNG to JPG with adjustable quality.", href: "/tools/png-to-jpg" },
    { name: "WebP to PNG", description: "Convert WebP to widely-supported PNG.", href: "/tools/webp-to-png" },
    { name: "PNG to WebP", description: "Convert PNG to WebP for smaller files.", href: "/tools/png-to-webp" },
    { name: "WebP to JPG", description: "Convert WebP images to universal JPG.", href: "/tools/webp-to-jpg" },
    { name: "JPG to WebP", description: "Convert JPG to WebP for faster web loading.", href: "/tools/jpg-to-webp" },
    { name: "SVG to PNG", description: "Convert vector SVG to raster PNG.", href: "/tools/svg-to-png" },
    { name: "HEIC to JPG", description: "Convert iPhone HEIC photos to JPG.", href: "/tools/heic-to-jpg" },
    { name: "BMP to PNG", description: "Convert BMP bitmap to compressed PNG.", href: "/tools/bmp-to-png" },
    { name: "BMP to JPG", description: "Convert BMP bitmap to compact JPG.", href: "/tools/bmp-to-jpg" },
    { name: "GIF to PNG", description: "Extract the first frame of GIF as PNG.", href: "/tools/gif-to-png" },
    { name: "AVIF to PNG", description: "Convert AVIF images to PNG format.", href: "/tools/avif-to-png" },
    { name: "AVIF to JPG", description: "Convert AVIF images to universal JPG.", href: "/tools/avif-to-jpg" },
  ]},
  { category: "Image Tools", items: [
    { name: "Image Resizer", description: "Resize images to any dimension.", href: "/tools/image-resizer" },
    { name: "Image Compressor", description: "Compress images while keeping quality.", href: "/tools/image-compressor" },
  ]},
  { category: "PDF Tools", items: [
    { name: "PDF to Image", description: "Convert PDF pages to PNG or JPG.", href: "/tools/pdf-to-image" },
    { name: "Image to PDF", description: "Combine images into a single PDF.", href: "/tools/image-to-pdf" },
    { name: "PDF Merge", description: "Merge multiple PDFs into one.", href: "/tools/pdf-merge" },
    { name: "PDF Split", description: "Split a PDF into separate pages.", href: "/tools/pdf-split" },
  ]},
  { category: "Video", items: [
    { name: "GIF to MP4", description: "Convert GIF to MP4 for smaller size.", href: "/tools/gif-to-mp4" },
    { name: "MP4 to GIF", description: "Convert MP4 videos to GIF animations.", href: "/tools/mp4-to-gif" },
  ]},
  { category: "Data Converters", items: [
    { name: "CSV to JSON", description: "Convert CSV spreadsheet data to JSON.", href: "/tools/csv-to-json" },
    { name: "JSON to CSV", description: "Convert JSON arrays to CSV format.", href: "/tools/json-to-csv" },
    { name: "XML to JSON", description: "Convert XML documents to JSON.", href: "/tools/xml-to-json" },
    { name: "JSON to XML", description: "Convert JSON data to XML format.", href: "/tools/json-to-xml" },
    { name: "YAML to JSON", description: "Convert YAML config to JSON.", href: "/tools/yaml-to-json" },
    { name: "JSON to YAML", description: "Convert JSON to YAML config format.", href: "/tools/json-to-yaml" },
    { name: "TSV to CSV", description: "Convert tab-separated to comma-separated.", href: "/tools/tsv-to-csv" },
    { name: "HTML to Markdown", description: "Convert HTML markup to clean Markdown.", href: "/tools/html-to-markdown" },
    { name: "Markdown to PDF", description: "Convert Markdown to formatted PDF.", href: "/tools/markdown-to-pdf" },
  ]},
  { category: "Text Utilities", items: [
    { name: "Base64 Encode/Decode", description: "Encode text to Base64 or decode back.", href: "/tools/base64-encode-decode" },
    { name: "URL Encode/Decode", description: "Encode or decode URL-safe strings.", href: "/tools/url-encode-decode" },
    { name: "JSON Formatter", description: "Format, validate, and beautify JSON.", href: "/tools/json-formatter" },
    { name: "Case Converter", description: "Convert text between UPPER, lower, camelCase, snake_case.", href: "/tools/case-converter" },
    { name: "Word Counter", description: "Count words, characters, and reading time.", href: "/tools/word-counter" },
    { name: "Lorem Ipsum Generator", description: "Generate placeholder text for designs.", href: "/tools/lorem-ipsum-generator" },
    { name: "QR Code Generator", description: "Generate QR codes for URLs, text, Wi-Fi.", href: "/tools/qr-code-generator" },
  ]},
];

export default function AllToolsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">All Tools</h1>
        <p className="text-muted-foreground mt-1">Browse all {tools.reduce((sum, g) => sum + g.items.length, 0)} free online tools. 100% browser-based, no data sent to servers.</p>
      </div>

      {tools.map((group) => (
        <section key={group.category}>
          <h2 className="text-lg font-semibold mb-4">{group.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.items.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group rounded-lg border border-border bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all">
                <h3 className="font-medium group-hover:text-primary transition-colors">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
