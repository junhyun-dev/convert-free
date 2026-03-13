"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompressedFile {
  name: string;
  url: string;
  originalSize: number;
  compressedSize: number;
}

export default function ImageCompressorPage() {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const [files, setFiles] = useState<File[]>([]);
  const [compressed, setCompressed] = useState<CompressedFile[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [dragOver, setDragOver] = useState(false);


  useEffect(() => {
    return () => {
      compressed.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f.name) && f.size <= MAX_FILE_SIZE
    );
    if (valid.length < newFiles.length) alert("Some files exceeded 20MB limit and were skipped.");
    setFiles((prev) => [...prev, ...valid]);
    setCompressed([]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const compress = useCallback(async () => {
    if (files.length === 0) return;
    setCompressing(true);
    const results: CompressedFile[] = [];

    for (const file of files) {
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;

          // For JPG output, fill white background
          const isJpg = /\.(jpe?g)$/i.test(file.name);
          const outputType = isJpg ? "image/jpeg" : "image/webp";

          if (isJpg) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const ext = isJpg ? ".jpg" : ".webp";
                const baseName = file.name.replace(/\.[^.]+$/, "");
                results.push({
                  name: `${baseName}_compressed${ext}`,
                  url: URL.createObjectURL(blob),
                  originalSize: file.size,
                  compressedSize: blob.size,
                });
              }
              URL.revokeObjectURL(url);
              resolve();
            },
            outputType,
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

    setCompressed(results);
    setCompressing(false);
  }, [files, quality]);

  const downloadAll = () => {
    for (const file of compressed) {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    }
  };

  const clear = () => {
    compressed.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setCompressed([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalOriginal = compressed.reduce((s, f) => s + f.originalSize, 0);
  const totalCompressed = compressed.reduce((s, f) => s + f.compressedSize, 0);
  const totalSavings = totalOriginal > 0 ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Image Compressor</h1>
        <p className="text-muted-foreground mt-1">
          Compress images to reduce file size while maintaining quality. Supports JPG, PNG, and WebP.
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
              Compression: {Math.round(quality * 100)}%
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
            <span className="text-xs text-muted-foreground w-24 text-right">
              {quality < 0.5 ? "Max compression" : quality > 0.85 ? "High quality" : "Balanced"}
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
              Drag & drop images here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG, or WebP
            </p>
            <label className="cursor-pointer">
              <Button variant="secondary" className="mt-4" type="button">
                Select Files
              </Button>
              <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
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
                <Button size="sm" onClick={compress} disabled={compressing}>
                  {compressing ? "Compressing..." : "Compress"}
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
      {compressed.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-green-400">
                Saved {totalSavings}% — {formatSize(totalOriginal)} → {formatSize(totalCompressed)}
              </CardTitle>
              <Button size="sm" onClick={downloadAll}>
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {compressed.map((file, i) => {
                const savings = Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100);
                return (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-green-500/10 text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <div className="flex items-center gap-3 ml-2 shrink-0">
                      <span className="text-green-400 text-xs">-{savings}%</span>
                      <span className="text-muted-foreground">
                        {formatSize(file.compressedSize)}
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
                );
              })}
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
            { name: "Image Resizer", href: "/tools/image-resizer" },
            { name: "PNG to WebP", href: "/tools/png-to-webp" },
            { name: "JPG to PNG", href: "/tools/jpg-to-png" },
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
            <TabsTrigger value="what">About Image Compression</TabsTrigger>
            <TabsTrigger value="how">How to Use</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">About Image Compression</h2>
            <p>
              Image compression reduces file size by removing unnecessary data. Lossy compression (used for JPG and WebP)
              discards some visual information that&apos;s barely noticeable to the human eye, achieving significant size
              reductions. At 80% quality, most images look identical to the original but are 50-70% smaller.
            </p>
            <h3 className="text-base font-semibold text-foreground">Why Compress Images?</h3>
            <p>
              Smaller images load faster on websites, use less bandwidth on mobile, take up less storage,
              and are easier to share via email or messaging apps. Google also ranks faster-loading pages higher.
            </p>
          </TabsContent>

          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Set the compression level with the quality slider.</li>
              <li>Drag and drop images or click to browse.</li>
              <li>Click &quot;Compress&quot; to start.</li>
              <li>See the savings for each file and download the results.</li>
            </ol>
          </TabsContent>

          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Will compression ruin my image quality?</h3>
              <p>At 80% quality, the difference is barely visible. Below 50%, you&apos;ll start to see artifacts. Use the slider to find your sweet spot.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">What format is the output?</h3>
              <p>JPG files stay as JPG. PNG and WebP files are compressed to WebP format for the best size reduction.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
