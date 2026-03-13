"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConvertedFile {
  name: string;
  url: string;
  size: number;
}

export default function PngToJpgPage() {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const [files, setFiles] = useState<File[]>([]);
  const [converted, setConverted] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [quality, setQuality] = useState(0.92);
  const [dragOver, setDragOver] = useState(false);


  useEffect(() => {
    return () => {
      converted.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) =>
      /\.png$/i.test(f.name) && f.size <= MAX_FILE_SIZE
    );
    if (valid.length < newFiles.length) alert("Some files exceeded 20MB limit and were skipped.");
    setFiles((prev) => [...prev, ...valid]);
    setConverted([]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setConverting(true);
    const results: ConvertedFile[] = [];

    for (const file of files) {
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          // Fill white background (JPG has no transparency)
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const jpgName = file.name.replace(/\.png$/i, ".jpg");
                results.push({
                  name: jpgName,
                  url: URL.createObjectURL(blob),
                  size: blob.size,
                });
              }
              URL.revokeObjectURL(url);
              resolve();
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
      await new Promise(r => setTimeout(r, 0));
    }

    setConverted(results);
    setConverting(false);
  }, [files, quality]);

  const downloadAll = () => {
    for (const file of converted) {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    }
  };

  const clear = () => {
    converted.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setConverted([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PNG to JPG Converter</h1>
        <p className="text-muted-foreground mt-1">
          Convert PNG images to JPG format with adjustable quality. Reduces file size significantly.
        </p>
        <Badge variant="secondary" className="mt-2">
          No data sent to server
        </Badge>
      </div>

      {/* Quality Slider */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium whitespace-nowrap">
              JPG Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-20 text-right">
              {quality < 0.5 ? "Small file" : quality > 0.85 ? "High quality" : "Balanced"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <Card>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <p className="text-lg font-medium">
              Drag & drop PNG files here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
            <label className="cursor-pointer">
              <Button variant="secondary" className="mt-4" type="button">
                Select Files
              </Button>
              <input
                  type="file"
                  accept=".png"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={clear}>
                  Clear
                </Button>
                <Button size="sm" onClick={convert} disabled={converting}>
                  {converting ? "Converting..." : "Convert to JPG"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-muted-foreground ml-2 shrink-0">
                    {formatSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {converted.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-green-400">
                {converted.length} file{converted.length > 1 ? "s" : ""} converted
              </CardTitle>
              <Button size="sm" onClick={downloadAll}>
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {converted.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-green-500/10 text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <div className="flex items-center gap-3 ml-2 shrink-0">
                    <span className="text-muted-foreground">
                      {formatSize(file.size)}
                    </span>
                    <a
                      href={file.url}
                      download={file.name}
                      className="text-primary hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Tools */}
      <section className="py-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "JPG to PNG", href: "/tools/jpg-to-png" },
            { name: "Image Compressor", href: "/tools/image-compressor" },
            { name: "PNG to WebP", href: "/tools/png-to-webp" },
            { name: "Image Resizer", href: "/tools/image-resizer" },
          ].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
              {tool.name}
            </a>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what">
          <TabsList>
            <TabsTrigger value="what">What is PNG to JPG?</TabsTrigger>
            <TabsTrigger value="how">How to Use</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is PNG to JPG Conversion?</h2>
            <p>
              PNG to JPG conversion reduces file size by switching from lossless to lossy compression.
              PNG files are often 3-5x larger than JPG for photos. Converting to JPG is ideal for
              web uploads, email attachments, and social media where transparency isn&apos;t needed.
            </p>
            <h3 className="text-base font-semibold text-foreground">Why Convert PNG to JPG?</h3>
            <p>
              JPG files are significantly smaller, making them faster to upload and download.
              Most social media platforms, email services, and websites prefer JPG for photographs.
              The quality slider lets you balance file size and image quality.
            </p>
          </TabsContent>

          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Adjust the quality slider (higher = better quality, larger file).</li>
              <li>Drag and drop your PNG files or click to browse.</li>
              <li>Click &quot;Convert to JPG&quot; to start the conversion.</li>
              <li>Download individual files or use &quot;Download All&quot;.</li>
            </ol>
          </TabsContent>

          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div>
              <h3 className="text-sm font-semibold text-foreground">What happens to transparent areas?</h3>
              <p>JPG doesn&apos;t support transparency. Transparent areas in your PNG will be filled with a white background.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">What quality should I use?</h3>
              <p>For photos: 85-92% gives the best balance. For web: 70-80% saves bandwidth. For print: 95-100%.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
