"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const categories = [
  {
    label: "Image Converters",
    tools: [
      { name: "JPG to PNG", href: "/tools/jpg-to-png" },
      { name: "PNG to JPG", href: "/tools/png-to-jpg" },
      { name: "WebP to PNG", href: "/tools/webp-to-png" },
      { name: "PNG to WebP", href: "/tools/png-to-webp" },
      { name: "WebP to JPG", href: "/tools/webp-to-jpg" },
      { name: "JPG to WebP", href: "/tools/jpg-to-webp" },
      { name: "SVG to PNG", href: "/tools/svg-to-png" },
      { name: "HEIC to JPG", href: "/tools/heic-to-jpg" },
      { name: "BMP to PNG", href: "/tools/bmp-to-png" },
      { name: "BMP to JPG", href: "/tools/bmp-to-jpg" },
      { name: "GIF to PNG", href: "/tools/gif-to-png" },
      { name: "AVIF to PNG", href: "/tools/avif-to-png" },
      { name: "AVIF to JPG", href: "/tools/avif-to-jpg" },
    ],
  },
  {
    label: "Image Tools",
    tools: [
      { name: "Image Resizer", href: "/tools/image-resizer" },
      { name: "Image Compressor", href: "/tools/image-compressor" },
    ],
  },
  {
    label: "PDF Tools",
    tools: [
      { name: "PDF to Image", href: "/tools/pdf-to-image" },
      { name: "Image to PDF", href: "/tools/image-to-pdf" },
      { name: "PDF Merge", href: "/tools/pdf-merge" },
      { name: "PDF Split", href: "/tools/pdf-split" },
    ],
  },
  {
    label: "Video",
    tools: [
      { name: "GIF to MP4", href: "/tools/gif-to-mp4" },
      { name: "MP4 to GIF", href: "/tools/mp4-to-gif" },
    ],
  },
  {
    label: "Data Converters",
    tools: [
      { name: "CSV to JSON", href: "/tools/csv-to-json" },
      { name: "JSON to CSV", href: "/tools/json-to-csv" },
      { name: "XML to JSON", href: "/tools/xml-to-json" },
      { name: "JSON to XML", href: "/tools/json-to-xml" },
      { name: "YAML to JSON", href: "/tools/yaml-to-json" },
      { name: "JSON to YAML", href: "/tools/json-to-yaml" },
      { name: "TSV to CSV", href: "/tools/tsv-to-csv" },
      { name: "HTML to Markdown", href: "/tools/html-to-markdown" },
      { name: "Markdown to PDF", href: "/tools/markdown-to-pdf" },
    ],
  },
  {
    label: "Text Utilities",
    tools: [
      { name: "Base64 Encode/Decode", href: "/tools/base64-encode-decode" },
      { name: "URL Encode/Decode", href: "/tools/url-encode-decode" },
      { name: "JSON Formatter", href: "/tools/json-formatter" },
      { name: "Case Converter", href: "/tools/case-converter" },
      { name: "Word Counter", href: "/tools/word-counter" },
      { name: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum-generator" },
      { name: "QR Code Generator", href: "/tools/qr-code-generator" },
    ],
  },
];

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        All Tools
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[600px] bg-card border border-border rounded-lg shadow-xl p-4 z-50 columns-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.label} className="break-inside-avoid mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {cat.label}
              </h3>
              <ul className="space-y-1">
                {cat.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      onClick={() => setOpen(false)}
                      className="block text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 rounded px-2 py-1 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
