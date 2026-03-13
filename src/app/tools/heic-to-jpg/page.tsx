"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConvertedFile { name: string; url: string; size: number; }

export default function HeicToJpgPage() {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const [files, setFiles] = useState<File[]>([]);
  const [converted, setConverted] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [quality, setQuality] = useState(0.92);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    return () => {
      converted.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => /\.(heic|heif)$/i.test(f.name) && f.size <= MAX_FILE_SIZE);
    if (valid.length < newFiles.length) alert("Some files exceeded 20MB limit and were skipped.");
    setFiles((prev) => [...prev, ...valid]);
    setConverted([]);
    setError("");
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setConverting(true);
    setError("");

    try {
      // Dynamically import heic2any
      const heic2any = (await import("heic2any")).default;
      const results: ConvertedFile[] = [];

      for (const file of files) {
        try {
          const blob = await heic2any({ blob: file, toType: "image/jpeg", quality }) as Blob;
          const jpgName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
          results.push({ name: jpgName, url: URL.createObjectURL(blob), size: blob.size });
        } catch {
          // Fallback: try canvas method
          const img = new Image();
          const url = URL.createObjectURL(file);
          await new Promise<void>((resolve) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext("2d")!;
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                if (blob) results.push({ name: file.name.replace(/\.(heic|heif)$/i, ".jpg"), url: URL.createObjectURL(blob), size: blob.size });
                URL.revokeObjectURL(url);
                resolve();
              }, "image/jpeg", quality);
            };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
            img.src = url;
          });
        }
      }

      setConverted(results);
      if (results.length === 0) setError("Could not convert files. Make sure they are valid HEIC images.");
    } catch {
      setError("HEIC conversion library failed to load. Please try again.");
    }
    setConverting(false);
  }, [files, quality]);

  const downloadAll = () => { converted.forEach((f) => { const a = document.createElement("a"); a.href = f.url; a.download = f.name; a.click(); }); };
  const clear = () => { converted.forEach((f) => URL.revokeObjectURL(f.url)); setFiles([]); setConverted([]); setError(""); };
  const formatSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HEIC to JPG Converter</h1>
        <p className="text-muted-foreground mt-1">Convert iPhone HEIC/HEIF photos to universally-supported JPG format.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card><CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium whitespace-nowrap">Quality: {Math.round(quality * 100)}%</label>
          <input type="range" min="0.5" max="1" step="0.01" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="flex-1" />
        </div>
      </CardContent></Card>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}>
          <p className="text-lg font-medium">Drag & drop HEIC files here</p>
          <p className="text-sm text-muted-foreground mt-1">iPhone photos (.heic, .heif)</p>
          <label className="cursor-pointer"><Button variant="secondary" className="mt-4" type="button">Select Files</Button>
            <input type="file" accept=".heic,.heif" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} /></label>
        </div>
      </CardContent></Card>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-sm text-red-400">{error}</div>}

      {files.length > 0 && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">{files.length} file{files.length > 1 ? "s" : ""} selected</CardTitle>
          <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={clear}>Clear</Button>
            <Button size="sm" onClick={convert} disabled={converting}>{converting ? "Converting..." : "Convert to JPG"}</Button></div>
        </div></CardHeader><CardContent><div className="space-y-2">
          {files.map((file, i) => (<div key={`${file.name}-${i}`} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 text-sm"><span className="truncate">{file.name}</span><span className="text-muted-foreground ml-2 shrink-0">{formatSize(file.size)}</span></div>))}
        </div></CardContent></Card>
      )}

      {converted.length > 0 && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-400">{converted.length} converted</CardTitle>
          <Button size="sm" onClick={downloadAll}>Download All</Button>
        </div></CardHeader><CardContent><div className="space-y-2">
          {converted.map((file, i) => (<div key={`${file.name}-${i}`} className="flex items-center justify-between py-2 px-3 rounded-md bg-green-500/10 text-sm"><span className="truncate">{file.name}</span>
            <div className="flex items-center gap-3 ml-2 shrink-0"><span className="text-muted-foreground">{formatSize(file.size)}</span><a href={file.url} download={file.name} className="text-primary hover:underline">Download</a></div></div>))}
        </div></CardContent></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "JPG to PNG", href: "/tools/jpg-to-png" }, { name: "Image Compressor", href: "/tools/image-compressor" }, { name: "Image Resizer", href: "/tools/image-resizer" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">What is HEIC?</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is HEIC?</h2>
            <p>HEIC (High Efficiency Image Container) is the default photo format on iPhones since iOS 11. It provides better compression than JPG (50% smaller files at the same quality) but isn&apos;t universally supported. Windows, many websites, and older software can&apos;t open HEIC files, making conversion to JPG essential.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Transfer HEIC photos from your iPhone to your computer.</li><li>Drop them here or click to browse.</li><li>Click &quot;Convert to JPG&quot;.</li><li>Download your JPG files.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Why can&apos;t I open HEIC on Windows?</h3><p>Windows doesn&apos;t natively support HEIC. You need the HEIF Image Extensions from the Microsoft Store, or simply convert to JPG with this tool.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
