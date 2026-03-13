"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResizedFile { name: string; url: string; size: number; width: number; height: number; }

export default function ImageResizerPage() {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [keepAspect, setKeepAspect] = useState(true);
  const [resized, setResized] = useState<ResizedFile | null>(null);
  const [resizing, setResizing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (resized?.url) URL.revokeObjectURL(resized.url);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = useCallback((newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    const f = newFiles[0];
    if (!/\.(jpe?g|png|webp)$/i.test(f.name)) return;
    if (f.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum size is 20MB for browser-based conversion.");
      return;
    }
    setFile(f);
    setResized(null);
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      alert("Failed to load image. The file may be corrupted.");
      setFile(null);
    };
    img.src = URL.createObjectURL(f);
  }, []);

  const updateWidth = (w: number) => {
    setTargetWidth(w);
    if (keepAspect && originalDimensions.width > 0) {
      setTargetHeight(Math.round((w / originalDimensions.width) * originalDimensions.height));
    }
  };

  const updateHeight = (h: number) => {
    setTargetHeight(h);
    if (keepAspect && originalDimensions.height > 0) {
      setTargetWidth(Math.round((h / originalDimensions.height) * originalDimensions.width));
    }
  };

  const resize = useCallback(async () => {
    if (!file) return;
    setResizing(true);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const isJpg = /\.(jpe?g)$/i.test(file.name);
      const mimeType = isJpg ? "image/jpeg" : "image/png";
      canvas.toBlob((blob) => {
        if (blob) {
          const ext = isJpg ? ".jpg" : ".png";
          const baseName = file.name.replace(/\.[^.]+$/, "");
          setResized({ name: `${baseName}_${targetWidth}x${targetHeight}${ext}`, url: URL.createObjectURL(blob), size: blob.size, width: targetWidth, height: targetHeight });
        }
        URL.revokeObjectURL(url);
        setResizing(false);
      }, mimeType, 0.92);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setResizing(false);
      alert("Failed to load image for resizing. The file may be corrupted.");
    };
    img.src = url;
  }, [file, targetWidth, targetHeight]);

  const clear = () => { if (resized) URL.revokeObjectURL(resized.url); setFile(null); setResized(null); };
  const formatSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  const presets = [
    { label: "Instagram Post", w: 1080, h: 1080 },
    { label: "Instagram Story", w: 1080, h: 1920 },
    { label: "Twitter Header", w: 1500, h: 500 },
    { label: "YouTube Thumbnail", w: 1280, h: 720 },
    { label: "Facebook Cover", w: 820, h: 312 },
    { label: "HD 1080p", w: 1920, h: 1080 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Image Resizer</h1>
        <p className="text-muted-foreground mt-1">Resize images to exact dimensions. Supports JPG, PNG, WebP with aspect ratio lock.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}>
          {file ? (
            <div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{originalDimensions.width} × {originalDimensions.height} — {formatSize(file.size)}</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={clear}>Remove</Button></div>
          ) : (
            <><p className="text-lg font-medium">Drag & drop an image here</p><p className="text-sm text-muted-foreground mt-1">JPG, PNG, or WebP</p>
              <label className="cursor-pointer"><Button variant="secondary" className="mt-4" type="button">Select File</Button>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => handleFile(e.target.files)} /></label></>
          )}
        </div>
      </CardContent></Card>

      {file && (
        <>
          {/* Presets */}
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Quick Presets</CardTitle></CardHeader>
            <CardContent><div className="flex flex-wrap gap-2">
              {presets.map((p) => (<Button key={p.label} variant="outline" size="sm" onClick={() => { setTargetWidth(p.w); setTargetHeight(p.h); setKeepAspect(false); }}>{p.label} ({p.w}×{p.h})</Button>))}
            </div></CardContent>
          </Card>

          {/* Size Controls */}
          <Card><CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2"><label className="text-sm font-medium">W:</label>
                <input type="number" value={targetWidth} onChange={(e) => updateWidth(Number(e.target.value))} className="w-24 px-2 py-1 rounded-md border bg-background text-sm" /></div>
              <span className="text-muted-foreground">×</span>
              <div className="flex items-center gap-2"><label className="text-sm font-medium">H:</label>
                <input type="number" value={targetHeight} onChange={(e) => updateHeight(Number(e.target.value))} className="w-24 px-2 py-1 rounded-md border bg-background text-sm" /></div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} className="rounded" />
                Keep aspect ratio
              </label>
              <Button onClick={resize} disabled={resizing}>{resizing ? "Resizing..." : "Resize"}</Button>
            </div>
          </CardContent></Card>
        </>
      )}

      {resized && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-400">Resized: {resized.width} × {resized.height} — {formatSize(resized.size)}</CardTitle>
          <a href={resized.url} download={resized.name}><Button size="sm">Download</Button></a>
        </div></CardHeader></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Image Compressor", href: "/tools/image-compressor" }, { name: "PNG to JPG", href: "/tools/png-to-jpg" }, { name: "JPG to PNG", href: "/tools/jpg-to-png" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">Why Resize Images?</h2>
            <p>Social media platforms, websites, and email services all have different image size requirements. Uploading oversized images wastes bandwidth and loads slowly. This tool lets you resize to exact dimensions or use presets for popular platforms.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Upload an image.</li><li>Choose a preset or enter custom dimensions.</li><li>Toggle aspect ratio lock if needed.</li><li>Click Resize and download.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Will resizing reduce quality?</h3><p>Enlarging images may reduce quality. Shrinking is generally safe. For best results, start with the highest resolution source.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
