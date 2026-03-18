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

export default function WebpToJpgPage() {
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
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
      /\.(webp)$/i.test(f.name) && f.size <= MAX_FILE_SIZE
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
                results.push({
                  name: file.name.replace(/\.(webp)$/i, ".jpg"),
                  url: URL.createObjectURL(blob),
                  size: blob.size,
                });
              }
              URL.revokeObjectURL(url);
              resolve();
            },
            "image/jpeg",
            0.92
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
        <h1 className="text-3xl font-bold">WebP to JPG Converter</h1>
        <p className="text-muted-foreground mt-1">
          Convert WebP images to JPG format for universal compatibility. Fast, free, and completely browser-based.
        </p>
        <Badge variant="secondary" className="mt-2">
          No data sent to server
        </Badge>
      </div>

      {/* Drop Zone */}
      <Card>
        <CardContent className="p-8">
          <label
            className={`block border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
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
              Drag & drop WebP files here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
            <span className="inline-block mt-4 px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Select Files
            </span>
            <input
              type="file"
              accept=".webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
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
            { name: "PNG to JPG", href: "/tools/png-to-jpg" },
            { name: "Image Compressor", href: "/tools/image-compressor" },
            { name: "WebP to PNG", href: "/tools/webp-to-png" },
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
            <TabsTrigger value="what">What is WebP to JPG?</TabsTrigger>
            <TabsTrigger value="how">How to Use</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is WebP to JPG Conversion?</h2>
            <p>
              WebP is a modern image format developed by Google that offers excellent compression. However, not all
              software and platforms support WebP natively. JPG (JPEG) is the most universally supported image format,
              compatible with virtually every device, browser, and application.
            </p>
            <h3 className="text-base font-semibold text-foreground">When to Convert WebP to JPG</h3>
            <p>
              Convert WebP to JPG when you need to share images with people using older software, upload to platforms
              that don&apos;t accept WebP, or when you need guaranteed compatibility across all devices and email clients.
            </p>
          </TabsContent>

          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Drag and drop your WebP files onto the upload area, or click to browse.</li>
              <li>You can add multiple files at once for batch conversion.</li>
              <li>Click &quot;Convert to JPG&quot; to start the conversion.</li>
              <li>Download individual files or use &quot;Download All&quot; to get everything.</li>
            </ol>
          </TabsContent>

          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Will I lose quality converting WebP to JPG?</h3>
              <p>Our converter uses a 92% quality setting which preserves excellent visual quality. Since both WebP and JPG use lossy compression, there may be minimal quality loss that is virtually imperceptible.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Does this work with animated WebP files?</h3>
              <p>This converter extracts the first frame from animated WebP files and converts it to a static JPG image.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Why convert WebP to JPG?</h3>
              <p>JPG is the most widely supported image format. While WebP offers better compression, some older browsers, email clients, and image editors still don&apos;t fully support it. Converting to JPG ensures universal compatibility.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
