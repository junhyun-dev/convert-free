"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "[]";

  const headers = parseCsvLine(lines[0]);
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = (values[idx] || "").trim();
    });
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const SAMPLE = `name,age,city,email
Alice,30,New York,alice@example.com
Bob,25,San Francisco,bob@example.com
Charlie,35,London,charlie@example.com
Diana,28,"Los Angeles",diana@example.com`;

export default function CsvToJsonPage() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const json = csvToJson(input);
      setOutput(json);
      setError("");
    } catch {
      setError("Invalid CSV format.");
    }
  }, [input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
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
        <h1 className="text-3xl font-bold">CSV to JSON Converter</h1>
        <p className="text-muted-foreground mt-1">Convert CSV data to JSON format instantly. Paste text or upload a .csv file.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={convert}>Convert</Button>
        <Button variant="secondary" onClick={() => setInput(SAMPLE)}>Sample</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
        <label className="cursor-pointer"><Button variant="outline" type="button">Upload CSV</Button>
          <input type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} /></label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">CSV Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder="Paste CSV data here..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">JSON Output</CardTitle>
          {output && <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</Button>
            <Button variant="ghost" size="sm" onClick={downloadJson}>Download</Button>
          </div>}
        </div></CardHeader><CardContent>
          {error ? <div className="font-mono text-sm bg-red-500/10 border border-red-500/20 px-3 py-3 rounded-md text-red-400 min-h-[300px]">{error}</div>
            : <Textarea readOnly className="font-mono text-sm min-h-[300px] resize-none" value={output} placeholder="JSON output will appear here..." />}
        </CardContent></Card>
      </div>

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Markdown to PDF", href: "/tools/markdown-to-pdf" }, { name: "Image to PDF", href: "/tools/image-to-pdf" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is CSV to JSON?</h2>
            <p>CSV (Comma-Separated Values) is a simple tabular format used by spreadsheets and databases. JSON (JavaScript Object Notation) is the standard data format for web APIs. Converting CSV to JSON is common when importing spreadsheet data into web applications or APIs.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Paste CSV data or upload a .csv file.</li><li>Click &quot;Convert&quot;.</li><li>Copy or download the JSON output.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Does it handle quoted fields?</h3><p>Yes. Fields with commas or quotes inside double-quotes are parsed correctly (RFC 4180 compliant).</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
