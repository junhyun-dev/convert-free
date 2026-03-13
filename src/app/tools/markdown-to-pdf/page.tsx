"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SAMPLE_MD = `# Sample Document

## Introduction
This is a **Markdown to PDF** converter. It supports:

- **Bold** and *italic* text
- Lists (ordered and unordered)
- Code blocks
- Headings (H1-H6)
- Horizontal rules

## Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Table Example
| Feature | Supported |
|---------|-----------|
| Bold    | Yes       |
| Italic  | Yes       |
| Lists   | Yes       |

---

*Converted with ConvertFree.cc*
`;

export default function MarkdownToPdfPage() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const [markdown, setMarkdown] = useState(SAMPLE_MD);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("document");

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!/\.(md|markdown|txt)$/i.test(f.name)) return;
    if (f.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum size is 10MB for browser-based conversion.");
      return;
    }
    setFileName(f.name.replace(/\.(md|markdown|txt)$/i, ""));
    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdown(e.target?.result as string);
      setPdfUrl(null);
    };
    reader.readAsText(f);
  }, []);

  const convert = useCallback(async () => {
    if (!markdown.trim()) return;
    setConverting(true);

    const { jsPDF } = await import("jspdf");
    const { marked } = await import("marked");
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const addPage = () => { doc.addPage(); y = margin; };
    const checkPage = (needed: number) => { if (y + needed > pageHeight - margin) addPage(); };
    const stripInline = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/__(.+?)__/g, "$1").replace(/_(.+?)_/g, "$1").replace(/`(.+?)`/g, "$1").replace(/~~(.+?)~~/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    const tokens = marked.lexer(markdown);

    for (const token of tokens) {
      switch (token.type) {
        case "heading": {
          const sizes = [22, 18, 15, 13, 11, 10];
          const fontSize = sizes[(token.depth || 1) - 1];
          checkPage(fontSize * 0.8);
          y += token.depth <= 2 ? 6 : 3;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(fontSize);
          doc.setTextColor(30, 30, 30);
          const wrapped = doc.splitTextToSize(stripInline(token.text), maxWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * fontSize * 0.45 + 3;
          break;
        }

        case "paragraph": {
          checkPage(6);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          const wrapped = doc.splitTextToSize(stripInline(token.text), maxWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 4.5 + 2;
          break;
        }

        case "list": {
          const items = token.items || [];
          for (let idx = 0; idx < items.length; idx++) {
            const item = items[idx];
            checkPage(6);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            const bullet = token.ordered ? `${idx + 1}.` : "\u2022";
            doc.text(bullet, margin, y);
            const itemText = stripInline(item.text);
            const wrapped = doc.splitTextToSize(itemText, maxWidth - 8);
            doc.text(wrapped, margin + 6, y);
            y += wrapped.length * 4.5 + 1;
          }
          y += 2;
          break;
        }

        case "code": {
          checkPage(8);
          doc.setFont("courier", "normal");
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          const codeLines = (token.text || "").split("\n");
          for (const codeLine of codeLines) {
            checkPage(5);
            const wrapped = doc.splitTextToSize(codeLine || " ", maxWidth - 4);
            const blockH = wrapped.length * 4;
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, y - 2.5, maxWidth, blockH + 1, "F");
            doc.text(wrapped, margin + 2, y);
            y += blockH + 0.5;
          }
          y += 3;
          break;
        }

        case "table": {
          const header = token.header || [];
          const rows = token.rows || [];
          const colCount = header.length || 1;
          const colWidth = maxWidth / colCount;

          // Header row
          checkPage(7);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(30, 30, 30);
          header.forEach((cell: { text: string }, i: number) => {
            doc.text(stripInline(cell.text), margin + i * colWidth + 2, y + 3);
          });
          doc.setDrawColor(150, 150, 150);
          doc.line(margin, y + 5, pageWidth - margin, y + 5);
          y += 7;

          // Data rows
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          for (const row of rows) {
            checkPage(7);
            (row as { text: string }[]).forEach((cell: { text: string }, i: number) => {
              doc.text(stripInline(cell.text), margin + i * colWidth + 2, y + 3);
            });
            doc.setDrawColor(220, 220, 220);
            doc.line(margin, y + 5, pageWidth - margin, y + 5);
            y += 7;
          }
          y += 3;
          break;
        }

        case "hr": {
          checkPage(8);
          y += 3;
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, y, pageWidth - margin, y);
          y += 5;
          break;
        }

        case "blockquote": {
          checkPage(6);
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(120, 120, 120);
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.5);
          doc.line(margin, y - 1, margin, y + 4);
          const bqText = stripInline(token.text);
          const wrapped = doc.splitTextToSize(bqText, maxWidth - 6);
          doc.text(wrapped, margin + 4, y);
          y += wrapped.length * 4.5 + 2;
          break;
        }

        case "space": {
          y += 3;
          break;
        }
      }
    }

    const blob = doc.output("blob");
    setPdfUrl(URL.createObjectURL(blob));
    setConverting(false);
  }, [markdown]);

  const clear = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setMarkdown(SAMPLE_MD);
    setFileName("document");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Markdown to PDF Converter</h1>
        <p className="text-muted-foreground mt-1">Convert Markdown documents to beautifully formatted PDF files.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}>
          <p className="text-sm text-muted-foreground">Drag & drop a .md file here, or</p>
          <label className="cursor-pointer">
            <Button variant="secondary" size="sm" className="mt-2" type="button">Upload .md File</Button>
            <input type="file" accept=".md,.markdown,.txt" className="hidden" onChange={(e) => handleFile(e.target.files)} />
          </label>
        </div>
        <textarea
          value={markdown}
          onChange={(e) => { setMarkdown(e.target.value); setPdfUrl(null); }}
          className="w-full h-80 px-4 py-3 rounded-md border bg-background text-sm font-mono resize-y"
          placeholder="Type or paste Markdown here..."
        />
      </CardContent></Card>

      <div className="flex items-center gap-3">
        <Button onClick={convert} disabled={converting || !markdown.trim()}>{converting ? "Converting..." : "Convert to PDF"}</Button>
        <Button variant="ghost" size="sm" onClick={clear}>Reset</Button>
      </div>

      {pdfUrl && (
        <Card><CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-green-400">PDF created!</CardTitle>
            <a href={pdfUrl} download={`${fileName}.pdf`}><Button size="sm">Download PDF</Button></a>
          </div>
        </CardHeader><CardContent>
          <iframe src={pdfUrl} className="w-full h-96 rounded-md border" />
        </CardContent></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "CSV to JSON", href: "/tools/csv-to-json" }, { name: "Image to PDF", href: "/tools/image-to-pdf" }, { name: "PDF Merge", href: "/tools/pdf-merge" }].map((t) => (
            <a key={t.href} href={t.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{t.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">Why Convert Markdown to PDF?</h2><p>Markdown is great for writing, but PDFs are the standard for sharing documents. This tool lets you write in Markdown and produce clean, professional PDFs for reports, documentation, or sharing with non-technical people.</p></TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">How to Use</h2><ol className="list-decimal list-inside space-y-2"><li>Type or paste Markdown text, or upload a .md file.</li><li>Click &quot;Convert to PDF&quot;.</li><li>Preview the PDF and download.</li></ol></TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">FAQ</h2><div><h3 className="text-sm font-semibold text-foreground">What Markdown features are supported?</h3><p>Headings, bold, italic, strikethrough, lists, code blocks, tables, blockquotes, horizontal rules, and links.</p></div><div><h3 className="text-sm font-semibold text-foreground">Can I use custom styling?</h3><p>The PDF uses clean, professional formatting optimized for readability. Custom CSS is not supported.</p></div></TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
