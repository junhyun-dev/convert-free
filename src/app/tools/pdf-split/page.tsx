"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PdfSplitPage() {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [splitUrls, setSplitUrls] = useState<{ name: string; url: string }[]>([]);
  const [splitting, setSplitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);


  useEffect(() => {
    return () => {
      splitUrls.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFile = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!/\.pdf$/i.test(f.name)) return;
    if (f.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum size is 50MB for browser-based conversion.");
      return;
    }
    setFile(f);
    setSplitUrls([]);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
    setPageRange(`1-${doc.getPageCount()}`);
  }, []);

  const split = useCallback(async () => {
    if (!file) return;
    setSplitting(true);
    const { PDFDocument } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(bytes);
    const results: { name: string; url: string }[] = [];

    // Parse page range: "1-3,5,7-9"
    const pages: number[] = [];
    for (const part of pageRange.split(",")) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map(Number);
        for (let i = start; i <= Math.min(end, pageCount); i++) pages.push(i);
      } else {
        const n = Number(trimmed);
        if (n >= 1 && n <= pageCount) pages.push(n);
      }
    }

    if (pages.length === 0) { setSplitting(false); return; }

    // Extract each page as separate PDF
    for (const p of pages) {
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(srcDoc, [p - 1]);
      newDoc.addPage(copied);
      const pdfBytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const baseName = file.name.replace(/\.pdf$/i, "");
      results.push({ name: `${baseName}_page${p}.pdf`, url: URL.createObjectURL(blob) });
    }

    setSplitUrls(results);
    setSplitting(false);
  }, [file, pageRange, pageCount]);

  const downloadAll = () => { splitUrls.forEach((f) => { const a = document.createElement("a"); a.href = f.url; a.download = f.name; a.click(); }); };
  const clear = () => { splitUrls.forEach((f) => URL.revokeObjectURL(f.url)); setFile(null); setSplitUrls([]); setPageCount(0); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">PDF Split</h1><p className="text-muted-foreground mt-1">Extract specific pages from a PDF. Split into individual pages or custom ranges.</p><Badge variant="secondary" className="mt-2">No data sent to server</Badge></div>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}>
          {file ? (<div><p className="font-medium">{file.name}</p><p className="text-sm text-muted-foreground">{pageCount} pages</p><Button variant="ghost" size="sm" className="mt-2" onClick={clear}>Remove</Button></div>)
            : (<><p className="text-lg font-medium">Drag & drop a PDF here</p><label className="cursor-pointer"><Button variant="secondary" className="mt-4" type="button">Select PDF</Button><input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files)} /></label></>)}
        </div>
      </CardContent></Card>

      {file && pageCount > 0 && (
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium">Pages:</label>
            <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} placeholder="e.g. 1-3, 5, 7-9" className="flex-1 min-w-[200px] px-3 py-1.5 rounded-md border bg-background text-sm" />
            <Button onClick={split} disabled={splitting}>{splitting ? "Splitting..." : "Split PDF"}</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Enter page numbers or ranges (e.g. 1-3, 5, 7-9). Total: {pageCount} pages.</p>
        </CardContent></Card>
      )}

      {splitUrls.length > 0 && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-400">{splitUrls.length} page{splitUrls.length > 1 ? "s" : ""} extracted</CardTitle>
          <Button size="sm" onClick={downloadAll}>Download All</Button>
        </div></CardHeader><CardContent><div className="space-y-2">
          {splitUrls.map((f, i) => (<div key={i} className="flex items-center justify-between py-2 px-3 rounded-md bg-green-500/10 text-sm"><span className="truncate">{f.name}</span>
            <a href={f.url} download={f.name} className="text-primary hover:underline ml-2">Download</a></div>))}
        </div></CardContent></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "PDF Merge", href: "/tools/pdf-merge" }, { name: "PDF to Image", href: "/tools/pdf-to-image" }, { name: "Image to PDF", href: "/tools/image-to-pdf" }].map((t) => (
            <a key={t.href} href={t.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{t.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">Why Split PDFs?</h2><p>Splitting PDFs is useful for extracting specific pages from large documents, separating chapters, or sharing only relevant sections. All processing happens in your browser.</p></TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">How to Use</h2><ol className="list-decimal list-inside space-y-2"><li>Upload a PDF file.</li><li>Enter page numbers or ranges.</li><li>Click Split and download the results.</li></ol></TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">FAQ</h2><div><h3 className="text-sm font-semibold text-foreground">Can I extract non-consecutive pages?</h3><p>Yes! Use commas to separate: &quot;1, 3, 5-7&quot; extracts pages 1, 3, 5, 6, and 7.</p></div></TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
