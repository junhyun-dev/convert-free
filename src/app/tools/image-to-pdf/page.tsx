"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImageToPdfPage() {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const [files, setFiles] = useState<File[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);


  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name) && f.size <= MAX_FILE_SIZE);
    if (valid.length < newFiles.length) alert("Some files exceeded 50MB limit and were skipped.");
    setFiles((prev) => [...prev, ...valid]);
    setPdfUrl(null);
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setConverting(true);

    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      let img;
      try {
        if (/\.png$/i.test(file.name)) {
          img = await pdfDoc.embedPng(bytes);
        } else {
          img = await pdfDoc.embedJpg(bytes);
        }
      } catch {
        // If embedding fails, try converting via canvas
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);
        const jpgBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92));
        const jpgBytes = await jpgBlob.arrayBuffer();
        img = await pdfDoc.embedJpg(jpgBytes);
      }

      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    setPdfUrl(URL.createObjectURL(blob));
    setConverting(false);
  }, [files]);

  const clear = () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); setFiles([]); setPdfUrl(null); };
  const formatSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Image to PDF Converter</h1>
        <p className="text-muted-foreground mt-1">Combine multiple images into a single PDF. Supports JPG, PNG, WebP.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}>
          <p className="text-lg font-medium">Drag & drop images here</p>
          <p className="text-sm text-muted-foreground mt-1">Each image becomes a PDF page</p>
          <label className="cursor-pointer"><Button variant="secondary" className="mt-4" type="button">Select Images</Button>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} /></label>
        </div>
      </CardContent></Card>

      {files.length > 0 && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">{files.length} image{files.length > 1 ? "s" : ""} — each becomes a page</CardTitle>
          <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={clear}>Clear</Button>
            <Button size="sm" onClick={convert} disabled={converting}>{converting ? "Creating PDF..." : "Create PDF"}</Button></div>
        </div></CardHeader><CardContent><div className="space-y-2">
          {files.map((file, i) => (<div key={`${file.name}-${i}`} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 text-sm">
            <span className="truncate"><span className="text-muted-foreground mr-2">Page {i + 1}:</span>{file.name}</span>
            <span className="text-muted-foreground ml-2 shrink-0">{formatSize(file.size)}</span></div>))}
        </div></CardContent></Card>
      )}

      {pdfUrl && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-400">PDF created — {files.length} page{files.length > 1 ? "s" : ""}</CardTitle>
          <a href={pdfUrl} download="images.pdf"><Button size="sm">Download PDF</Button></a>
        </div></CardHeader></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "PDF to Image", href: "/tools/pdf-to-image" }, { name: "PDF Merge", href: "/tools/pdf-merge" }, { name: "Image Compressor", href: "/tools/image-compressor" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">Why Convert Images to PDF?</h2>
            <p>PDFs are the universal document format. Converting images to PDF makes them easier to share, print, and archive. This is perfect for scanning documents, creating photo albums, or combining receipts into a single file.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Drop images in the order you want them.</li><li>Each image becomes one PDF page.</li><li>Click &quot;Create PDF&quot; and download.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Can I reorder the pages?</h3><p>Currently, pages are ordered by the order you add the files. Add them in the order you want.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
