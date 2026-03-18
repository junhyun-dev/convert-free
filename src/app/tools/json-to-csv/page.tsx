"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Input must be a non-empty JSON array.");
  }

  const headers = new Set<string>();
  for (const item of data) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      throw new Error("Each element must be a JSON object.");
    }
    Object.keys(item).forEach((k) => headers.add(k));
  }

  const headerArr = Array.from(headers);

  const escapeCsv = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = typeof val === "object" ? JSON.stringify(val) : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const lines = [headerArr.map(escapeCsv).join(",")];
  for (const item of data) {
    const row = headerArr.map((h) => escapeCsv(item[h]));
    lines.push(row.join(","));
  }
  return lines.join("\n");
}

const SAMPLE = `[
  {"name": "Alice", "age": 30, "city": "New York"},
  {"name": "Bob", "age": 25, "city": "London"},
  {"name": "Charlie", "age": 35, "city": "San Francisco"}
]`;

export default function JsonToCsvPage() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const result = jsonToCsv(input);
      setOutput(result);
      setError("");
    } catch {
      setError("Invalid JSON format. Input must be an array of objects.");
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
        <h1 className="text-3xl font-bold">JSON to CSV Converter</h1>
        <p className="text-muted-foreground mt-1">Convert JSON arrays to CSV format instantly. Paste text or upload a .json file.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={convert}>Convert</Button>
        <Button variant="secondary" onClick={() => setInput(SAMPLE)}>Sample</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
        <label className="cursor-pointer"><Button variant="outline" type="button">Upload JSON</Button>
          <input type="file" accept=".json" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} /></label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">JSON Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder="Paste JSON array here..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

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
          {[{ name: "CSV to JSON", href: "/tools/csv-to-json" }, { name: "JSON Formatter", href: "/tools/json-formatter" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is JSON to CSV?</h2>
            <p>JSON (JavaScript Object Notation) is a lightweight data interchange format widely used in APIs and web applications. CSV (Comma-Separated Values) is a tabular format supported by spreadsheet programs like Excel and Google Sheets. Converting JSON to CSV is essential when you need to analyze API data in a spreadsheet or import it into database tools.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Paste a JSON array of objects or upload a .json file.</li><li>Click &quot;Convert&quot;.</li><li>Copy or download the CSV output.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">How are nested objects handled?</h3><p>Nested objects and arrays are serialized as JSON strings in the CSV output, so no data is lost.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">What if objects have different keys?</h3><p>All unique keys across all objects are collected as CSV headers. Missing values are left empty.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
