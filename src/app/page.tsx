import Link from "next/link";

const tools = [
  // Image Converters
  { name: "JPG to PNG", description: "Convert JPG/JPEG images to PNG format with transparency support.", href: "/tools/jpg-to-png", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "PNG to JPG", description: "Convert PNG images to JPG format with adjustable quality.", href: "/tools/png-to-jpg", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "WebP to PNG", description: "Convert WebP images to widely-supported PNG format.", href: "/tools/webp-to-png", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "PNG to WebP", description: "Convert PNG images to WebP for smaller file sizes.", href: "/tools/png-to-webp", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "WebP to JPG", description: "Convert WebP images to JPG format for universal compatibility.", href: "/tools/webp-to-jpg", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "JPG to WebP", description: "Convert JPG images to WebP for faster web loading.", href: "/tools/jpg-to-webp", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "SVG to PNG", description: "Convert vector SVG files to raster PNG images.", href: "/tools/svg-to-png", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "HEIC to JPG", description: "Convert iPhone HEIC photos to universal JPG format.", href: "/tools/heic-to-jpg", icon: "📱", tags: ["Image", "Convert"] },
  { name: "BMP to PNG", description: "Convert BMP bitmap images to compressed PNG format.", href: "/tools/bmp-to-png", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "BMP to JPG", description: "Convert BMP bitmap images to compact JPG format.", href: "/tools/bmp-to-jpg", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "GIF to PNG", description: "Extract the first frame of GIF animations as PNG.", href: "/tools/gif-to-png", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "AVIF to PNG", description: "Convert AVIF images to widely-supported PNG format.", href: "/tools/avif-to-png", icon: "🖼️", tags: ["Image", "Convert"] },
  { name: "AVIF to JPG", description: "Convert AVIF images to universal JPG format.", href: "/tools/avif-to-jpg", icon: "🖼️", tags: ["Image", "Convert"] },

  // Image Tools
  { name: "Image Resizer", description: "Resize images to any dimension. Supports JPG, PNG, WebP.", href: "/tools/image-resizer", icon: "📐", tags: ["Image", "Edit"] },
  { name: "Image Compressor", description: "Compress images to reduce file size while keeping quality.", href: "/tools/image-compressor", icon: "📦", tags: ["Image", "Optimize"] },

  // PDF Tools
  { name: "PDF to Image", description: "Convert PDF pages to PNG or JPG images.", href: "/tools/pdf-to-image", icon: "📄", tags: ["PDF", "Convert"] },
  { name: "Image to PDF", description: "Combine images into a single PDF document.", href: "/tools/image-to-pdf", icon: "📄", tags: ["PDF", "Convert"] },
  { name: "PDF Merge", description: "Merge multiple PDF files into one document.", href: "/tools/pdf-merge", icon: "📄", tags: ["PDF", "Edit"] },
  { name: "PDF Split", description: "Split a PDF into separate pages or sections.", href: "/tools/pdf-split", icon: "📄", tags: ["PDF", "Edit"] },

  // Video
  { name: "GIF to MP4", description: "Convert GIF animations to MP4 video for smaller file size.", href: "/tools/gif-to-mp4", icon: "🎬", tags: ["Video", "Convert"] },
  { name: "MP4 to GIF", description: "Convert MP4 videos to GIF animations. Adjustable FPS and width.", href: "/tools/mp4-to-gif", icon: "🎬", tags: ["Video", "Convert"] },

  // Data Converters
  { name: "CSV to JSON", description: "Convert CSV spreadsheet data to JSON format.", href: "/tools/csv-to-json", icon: "📊", tags: ["Data", "Convert"] },
  { name: "JSON to CSV", description: "Convert JSON arrays to CSV spreadsheet format.", href: "/tools/json-to-csv", icon: "📊", tags: ["Data", "Convert"] },
  { name: "XML to JSON", description: "Convert XML documents to JSON format.", href: "/tools/xml-to-json", icon: "📊", tags: ["Data", "Convert"] },
  { name: "JSON to XML", description: "Convert JSON data to XML format.", href: "/tools/json-to-xml", icon: "📊", tags: ["Data", "Convert"] },
  { name: "YAML to JSON", description: "Convert YAML configuration to JSON format.", href: "/tools/yaml-to-json", icon: "📊", tags: ["Data", "Convert"] },
  { name: "JSON to YAML", description: "Convert JSON data to YAML configuration format.", href: "/tools/json-to-yaml", icon: "📊", tags: ["Data", "Convert"] },
  { name: "TSV to CSV", description: "Convert tab-separated values to comma-separated format.", href: "/tools/tsv-to-csv", icon: "📊", tags: ["Data", "Convert"] },
  { name: "HTML to Markdown", description: "Convert HTML markup to clean Markdown text.", href: "/tools/html-to-markdown", icon: "📝", tags: ["Data", "Convert"] },
  { name: "Markdown to PDF", description: "Convert Markdown documents to beautifully formatted PDFs.", href: "/tools/markdown-to-pdf", icon: "📝", tags: ["Document", "Convert"] },

  // Text Utilities
  { name: "Base64 Encode/Decode", description: "Encode text to Base64 or decode Base64 to text.", href: "/tools/base64-encode-decode", icon: "🔐", tags: ["Text", "Encode"] },
  { name: "URL Encode/Decode", description: "Encode or decode URL-safe strings.", href: "/tools/url-encode-decode", icon: "🔗", tags: ["Text", "Encode"] },
  { name: "JSON Formatter", description: "Format, validate, and beautify JSON data.", href: "/tools/json-formatter", icon: "📋", tags: ["Text", "Format"] },
  { name: "Case Converter", description: "Convert text between UPPER, lower, Title, camelCase, snake_case.", href: "/tools/case-converter", icon: "🔤", tags: ["Text", "Convert"] },
  { name: "Word Counter", description: "Count words, characters, sentences, and estimate reading time.", href: "/tools/word-counter", icon: "📝", tags: ["Text", "Analyze"] },
  { name: "Lorem Ipsum Generator", description: "Generate placeholder Lorem Ipsum text for designs.", href: "/tools/lorem-ipsum-generator", icon: "📄", tags: ["Text", "Generate"] },

  // Generator
  { name: "QR Code Generator", description: "Generate QR codes for URLs, text, Wi-Fi, and email. Download PNG or SVG.", href: "/tools/qr-code-generator", icon: "📱", tags: ["Generator", "QR Code"] },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ConvertFree",
    url: "https://www.convertfree.cc",
    description: "Free online file converter and developer tools. 100% browser-based, no upload to servers.",
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `https://www.convertfree.cc${tool.href}`,
    })),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Free Online File Converter
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
          Convert images, PDFs, data, and text instantly in your browser.
          100% free, no sign-up, no data sent to servers.
        </p>
      </section>

      {/* Tool Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold group-hover:text-primary transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Trust Section */}
      <section className="text-center py-8 border-t">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div>
            <p className="text-2xl font-bold text-primary">{tools.length}</p>
            <p className="text-sm text-muted-foreground">Free Tools</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-sm text-muted-foreground">Browser-based</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Files Uploaded to Server</p>
          </div>
        </div>
      </section>
    </div>
  );
}
