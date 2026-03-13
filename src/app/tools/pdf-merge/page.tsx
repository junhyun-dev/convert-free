"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PdfMergePage() {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [dragOver, setDragOver] = useState(false);


  useEffect(() => {
    return () => {
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => /\.pdf$/i.test(f.name) && f.size <= MAX_FILE_SIZE);
    if (valid.length < newFiles.length) alert("Some files exceeded 50MB limit and were skipped.");
    setFiles((prev) => [...prev, ...valid]);
    setMergedUrl(null);
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) return;
    setMerging(true);
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }
    const pdfBytes = await merged.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    setMergedUrl(URL.createObjectURL(blob));
    setMerging(false);
  }, [files]);

  const clear = () => { if (mergedUrl) URL.revokeObjectURL(mergedUrl); setFiles([]); setMergedUrl(null); };
  const formatSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">PDF Merge</h1><p className="text-muted-foreground mt-1">Combine multiple PDF files into one document. Fast, free, browser-based.</p><Badge variant="secondary" className="mt-2">No data sent to server</Badge></div>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}>
          <p className="text-lg font-medium">Drag & drop PDF files here</p><p className="text-sm text-muted-foreground mt-1">Add 2 or more PDFs to merge</p>
          <label className="cursor-pointer"><Button variant="secondary" className="mt-4" type="button">Select PDFs</Button>
            <input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} /></label>
        </div>
      </CardContent></Card>

      {files.length > 0 && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">{files.length} PDF{files.length > 1 ? "s" : ""} — merged in order shown</CardTitle>
          <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={clear}>Clear</Button>
            <Button size="sm" onClick={merge} disabled={merging || files.length < 2}>{merging ? "Merging..." : "Merge PDFs"}</Button></div>
        </div></CardHeader><CardContent><div className="space-y-2">
          {files.map((file, i) => (<div key={`${file.name}-${i}`} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 text-sm"><span className="truncate"><span className="text-muted-foreground mr-2">#{i + 1}</span>{file.name}</span><span className="text-muted-foreground ml-2 shrink-0">{formatSize(file.size)}</span></div>))}
        </div></CardContent></Card>
      )}

      {mergedUrl && (
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-400">Merged successfully!</CardTitle>
          <a href={mergedUrl} download="merged.pdf"><Button size="sm">Download PDF</Button></a>
        </div></CardHeader></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "PDF Split", href: "/tools/pdf-split" }, { name: "Image to PDF", href: "/tools/image-to-pdf" }, { name: "PDF to Image", href: "/tools/pdf-to-image" }].map((t) => (
            <a key={t.href} href={t.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{t.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">Why Merge PDFs?</h2><p>Combining multiple PDFs into one makes documents easier to share, print, and organize. Common use cases include merging scanned pages, combining reports, and creating document packages.</p></TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">How to Use</h2><ol className="list-decimal list-inside space-y-2"><li>Add 2 or more PDF files.</li><li>Files are merged in the order shown.</li><li>Click &quot;Merge PDFs&quot; and download.</li></ol></TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">FAQ</h2><div><h3 className="text-sm font-semibold text-foreground">Is there a file size limit?</h3><p>No hard limit, but very large PDFs (100+ MB) may be slow since processing happens in your browser.</p></div></TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
