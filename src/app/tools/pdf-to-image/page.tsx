"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConvertedPage { name: string; url: string; page: number; }

export default function PdfToImagePage() {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [converting, setConverting] = useState(false);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [dragOver, setDragOver] = useState(false);
  const [pageCount, setPageCount] = useState(0);


  useEffect(() => {
    return () => {
      pages.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFile = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!/\.pdf$/i.test(f.name)) return;
    if (f.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum size is 50MB for browser-based conversion.");
      return;
    }
    setFile(f);
    setPages([]);
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setConverting(true);

    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    setPageCount(pdf.numPages);

    const results: ConvertedPage[] = [];
    const baseName = file.name.replace(/\.pdf$/i, "");

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;

      if (format === "jpg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      await page.render({ canvasContext: ctx, viewport } as never).promise;

      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const ext = format === "png" ? ".png" : ".jpg";
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), mimeType, 0.92)
      );

      results.push({
        name: `${baseName}_page${i}${ext}`,
        url: URL.createObjectURL(blob),
        page: i,
      });
    }

    setPages(results);
    setConverting(false);
  }, [file, scale, format]);

  const downloadAll = () => { pages.forEach((f) => { const a = document.createElement("a"); a.href = f.url; a.download = f.name; a.click(); }); };
  const clear = () => { pages.forEach((f) => URL.revokeObjectURL(f.url)); setFile(null); setPages([]); setPageCount(0); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">PDF to Image Converter</h1><p className="text-muted-foreground mt-1">Convert each PDF page to a high-quality PNG or JPG image.</p><Badge variant="secondary" className="mt-2">No data sent to server</Badge></div>

      <Card><CardContent className="pt-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Format:</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as "png" | "jpg")} className="px-2 py-1 rounded-md border bg-background text-sm">
              <option value="png">PNG</option><option value="jpg">JPG</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Scale: {scale}x</label>
            <input type="range" min="1" max="4" step="0.5" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-32" />
          </div>
        </div>
      </CardContent></Card>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}>
          {file ? (<div><p className="font-medium">{file.name}</p>{pageCount > 0 && <p className="text-sm text-muted-foreground">{pageCount} pages</p>}<Button variant="ghost" size="sm" className="mt-2" onClick={clear}>Remove</Button></div>)
            : (<><p className="text-lg font-medium">Drag & drop a PDF here</p><label className="cursor-pointer"><Button variant="secondary" className="mt-4" type="button">Select PDF</Button><input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files)} /></label></>)}
        </div>
      </CardContent></Card>

      {file && (
        <div className="flex gap-2">
          <Button onClick={convert} disabled={converting}>{converting ? "Converting..." : `Convert to ${format.toUpperCase()}`}</Button>
        </div>
      )}

      {pages.length > 0 && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-400">{pages.length} page{pages.length > 1 ? "s" : ""} converted</CardTitle>
          <Button size="sm" onClick={downloadAll}>Download All</Button>
        </div></CardHeader><CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((p) => (
              <div key={p.page} className="border rounded-md overflow-hidden bg-muted/30">
                <img src={p.url} alt={`Page ${p.page}`} className="w-full h-auto" />
                <div className="p-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Page {p.page}</span>
                  <a href={p.url} download={p.name} className="text-primary hover:underline">Download</a>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Image to PDF", href: "/tools/image-to-pdf" }, { name: "PDF Merge", href: "/tools/pdf-merge" }, { name: "PDF Split", href: "/tools/pdf-split" }].map((t) => (
            <a key={t.href} href={t.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{t.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">Why Convert PDF to Images?</h2><p>Converting PDFs to images is useful for sharing on social media, embedding in presentations, creating thumbnails, or when you need to edit PDF content in an image editor. Each page becomes a separate high-resolution image.</p></TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">How to Use</h2><ol className="list-decimal list-inside space-y-2"><li>Choose output format (PNG for quality, JPG for smaller files).</li><li>Set scale (2x recommended for sharp images).</li><li>Upload a PDF.</li><li>Click Convert and download your images.</li></ol></TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">FAQ</h2><div><h3 className="text-sm font-semibold text-foreground">What scale should I use?</h3><p>1x for web thumbnails, 2x for general use, 3-4x for print quality. Higher scale = larger files but sharper images.</p></div></TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
