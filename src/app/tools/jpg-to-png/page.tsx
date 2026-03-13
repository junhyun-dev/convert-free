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

export default function JpgToPngPage() {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const [files, setFiles] = useState<File[]>([]);
  const [converted, setConverted] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);


  useEffect(() => {
    return () => {
      converted.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) =>
      /\.(jpe?g)$/i.test(f.name) && f.size <= MAX_FILE_SIZE
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
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const pngName = file.name.replace(/\.(jpe?g)$/i, ".png");
                results.push({
                  name: pngName,
                  url: URL.createObjectURL(blob),
                  size: blob.size,
                });
              }
              URL.revokeObjectURL(url);
              resolve();
            },
            "image/png"
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
  }, [files]);

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
        <h1 className="text-3xl font-bold">JPG to PNG Converter</h1>
        <p className="text-muted-foreground mt-1">
          Convert JPG/JPEG images to PNG format with transparency support. Fast, free, and completely browser-based.
        </p>
        <Badge variant="secondary" className="mt-2">
          No data sent to server
        </Badge>
      </div>

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
              Drag & drop JPG files here
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
                  accept=".jpg,.jpeg"
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
                  {converting ? "Converting..." : "Convert to PNG"}
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
            { name: "PNG to JPG", href: "/tools/png-to-jpg" },
            { name: "Image Compressor", href: "/tools/image-compressor" },
            { name: "WebP to PNG", href: "/tools/webp-to-png" },
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
            <TabsTrigger value="what">What is JPG to PNG?</TabsTrigger>
            <TabsTrigger value="how">How to Use</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is JPG to PNG Conversion?</h2>
            <p>
              JPG (JPEG) and PNG are two of the most common image formats on the web. JPG uses lossy compression,
              making files smaller but losing some quality. PNG uses lossless compression, preserving every pixel
              and supporting transparency.
            </p>
            <h3 className="text-base font-semibold text-foreground">When to Convert JPG to PNG</h3>
            <p>
              Convert JPG to PNG when you need transparency (alpha channel), lossless quality for editing,
              or when working with graphics, logos, and screenshots that need crisp edges.
            </p>
          </TabsContent>

          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Drag and drop your JPG files onto the upload area, or click to browse.</li>
              <li>You can add multiple files at once for batch conversion.</li>
              <li>Click &quot;Convert to PNG&quot; to start the conversion.</li>
              <li>Download individual files or use &quot;Download All&quot; to get everything.</li>
            </ol>
          </TabsContent>

          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Is this converter really free?</h3>
              <p>Yes, 100% free with no limits on the number of conversions or file size.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Are my files uploaded to a server?</h3>
              <p>No. All conversion happens in your browser using the HTML5 Canvas API. Your files never leave your device.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Will the converted PNG be larger than the JPG?</h3>
              <p>Usually yes, because PNG uses lossless compression while JPG uses lossy compression. The tradeoff is perfect quality and transparency support.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
