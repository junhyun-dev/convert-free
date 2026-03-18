"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function tsvToCsv(tsv: string): string {
  const lines = tsv.split("\n");
  const csvLines: string[] = [];

  for (const line of lines) {
    if (line === "") {
      csvLines.push("");
      continue;
    }
    const fields = line.split("\t");
    const csvFields = fields.map((field) => {
      // Quote the field if it contains commas, double quotes, or newlines
      if (field.includes(",") || field.includes('"') || field.includes("\n")) {
        return '"' + field.replace(/"/g, '""') + '"';
      }
      return field;
    });
    csvLines.push(csvFields.join(","));
  }

  return csvLines.join("\n");
}

const SAMPLE = `Name\tAge\tCity\tEmail
Alice\t30\tNew York\talice@example.com
Bob\t25\tSan Francisco\tbob@example.com
Charlie\t35\tLondon\tcharlie@example.com
Diana\t28\tLos Angeles, CA\tdiana@example.com`;

export default function TsvToCsvPage() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const result = tsvToCsv(input);
      setOutput(result);
      setError("");
    } catch {
      setError("Invalid TSV format. Please check your input.");
    }
  }, [input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum size is 10MB for browser-based conversion.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => { setInput(e.target?.result as string); };
    reader.readAsText(f);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">TSV to CSV Converter</h1>
        <p className="text-muted-foreground mt-1">Convert tab-separated values to comma-separated values instantly. Paste text or upload a file.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={convert}>Convert</Button>
        <Button variant="secondary" onClick={() => setInput(SAMPLE)}>Sample</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
        <label className="cursor-pointer"><Button variant="outline" type="button">Upload TSV</Button>
          <input type="file" accept=".tsv,.txt" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} /></label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">TSV Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder="Paste TSV data here..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">CSV Output</CardTitle>
          {output && <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</Button>
            <Button variant="ghost" size="sm" onClick={downloadCsv}>Download</Button>
          </div>}
        </div></CardHeader><CardContent>
          {error ? <div className="font-mono text-sm bg-red-500/10 border border-red-500/20 px-3 py-3 rounded-md text-red-400 min-h-[300px]">{error}</div>
            : <Textarea readOnly className="font-mono text-sm min-h-[300px] resize-none" value={output} placeholder="CSV output will appear here..." />}
        </CardContent></Card>
      </div>

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "CSV to JSON", href: "/tools/csv-to-json" }, { name: "JSON to CSV", href: "/tools/json-to-csv" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is TSV to CSV?</h2>
            <p>TSV (Tab-Separated Values) uses tabs as delimiters, commonly exported from spreadsheets and databases. CSV (Comma-Separated Values) uses commas and is more widely supported by data tools, programming languages, and import wizards. Converting TSV to CSV ensures maximum compatibility across different applications.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Paste TSV data or upload a .tsv / .txt file.</li><li>Click &quot;Convert&quot;.</li><li>Copy or download the CSV output.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">What if my data contains commas?</h3><p>Fields containing commas are automatically wrapped in double quotes following the CSV standard (RFC 4180), so the data is preserved correctly.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Can I paste from Excel?</h3><p>Yes. When you copy cells from Excel or Google Sheets, they are tab-separated by default. Just paste directly into the input area.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
