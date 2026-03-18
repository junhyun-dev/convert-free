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

export default function JpgToWebpPage() {
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
                results.push({
                  name: file.name.replace(/\.(jpe?g)$/i, ".webp"),
                  url: URL.createObjectURL(blob),
                  size: blob.size,
                });
              }
              URL.revokeObjectURL(url);
              resolve();
            },
            "image/webp",
            0.85
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
        <h1 className="text-3xl font-bold">JPG to WebP Converter</h1>
        <p className="text-muted-foreground mt-1">
          Convert JPG/JPEG images to WebP format for smaller file sizes and faster web performance. Free, fast, and browser-based.
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
              Drag & drop JPG files here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
            <span className="inline-block mt-4 px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Select Files
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg"
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
                  {converting ? "Converting..." : "Convert to WebP"}
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
            <TabsTrigger value="what">What is JPG to WebP?</TabsTrigger>
            <TabsTrigger value="how">How to Use</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is JPG to WebP Conversion?</h2>
            <p>
              WebP is a modern image format developed by Google that provides superior compression compared to JPG.
              WebP images are typically 25-35% smaller than equivalent JPG files at the same visual quality, making
              them ideal for websites and web applications where page load speed matters.
            </p>
            <h3 className="text-base font-semibold text-foreground">When to Convert JPG to WebP</h3>
            <p>
              Convert JPG to WebP when optimizing images for websites, improving Core Web Vitals scores,
              reducing bandwidth usage, or whenever you need smaller file sizes without sacrificing visual quality.
              All modern browsers now support WebP.
            </p>
          </TabsContent>

          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Drag and drop your JPG/JPEG files onto the upload area, or click to browse.</li>
              <li>You can add multiple files at once for batch conversion.</li>
              <li>Click &quot;Convert to WebP&quot; to start the conversion.</li>
              <li>Download individual files or use &quot;Download All&quot; to get everything.</li>
            </ol>
          </TabsContent>

          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div>
              <h3 className="text-sm font-semibold text-foreground">How much smaller will my WebP files be?</h3>
              <p>WebP files are typically 25-35% smaller than JPG at comparable quality. Our converter uses 85% quality which provides an excellent balance between file size reduction and visual fidelity.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Do all browsers support WebP?</h3>
              <p>Yes, all modern browsers including Chrome, Firefox, Safari, and Edge support WebP. Only very old browser versions (like IE11) lack support.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Is WebP better than JPG for websites?</h3>
              <p>Yes. WebP delivers smaller file sizes with the same visual quality, which means faster page loads and better Core Web Vitals scores. Google recommends using WebP for web images.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
