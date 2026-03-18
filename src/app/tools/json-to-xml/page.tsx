"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function jsonValueToXml(key: string, value: unknown, indent: string): string {
  if (value === null || value === undefined) {
    return `${indent}<${key}/>\n`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => jsonValueToXml(key, item, indent)).join("");
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return `${indent}<${key}/>\n`;
    }
    let xml = `${indent}<${key}>\n`;
    for (const k of keys) {
      xml += jsonValueToXml(k, obj[k], indent + "  ");
    }
    xml += `${indent}</${key}>\n`;
    return xml;
  }

  return `${indent}<${key}>${escapeXml(String(value))}</${key}>\n`;
}

function jsonToXml(json: string): string {
  const data = JSON.parse(json);

  if (typeof data !== "object" || data === null) {
    throw new Error("Input must be a JSON object.");
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

  if (Array.isArray(data)) {
    xml += "<root>\n";
    for (const item of data) {
      xml += jsonValueToXml("item", item, "  ");
    }
    xml += "</root>\n";
  } else {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      xml += jsonValueToXml(keys[0], data[keys[0]], "");
    } else {
      xml += "<root>\n";
      for (const key of keys) {
        xml += jsonValueToXml(key, data[key], "  ");
      }
      xml += "</root>\n";
    }
  }

  return xml.trimEnd();
}

const SAMPLE = `{
  "users": {
    "user": [
      {"name": "Alice", "age": 30},
      {"name": "Bob", "age": 25}
    ]
  }
}`;

export default function JsonToXmlPage() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const result = jsonToXml(input);
      setOutput(result);
      setError("");
    } catch {
      setError("Invalid JSON format. Please check your input.");
    }
  }, [input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadXml = () => {
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xml";
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
        <h1 className="text-3xl font-bold">JSON to XML Converter</h1>
        <p className="text-muted-foreground mt-1">Convert JSON data to XML format instantly. Paste text or upload a .json file.</p>
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
          <CardContent><Textarea placeholder="Paste JSON data here..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">XML Output</CardTitle>
          {output && <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</Button>
            <Button variant="ghost" size="sm" onClick={downloadXml}>Download</Button>
          </div>}
        </div></CardHeader><CardContent>
          {error ? <div className="font-mono text-sm bg-red-500/10 border border-red-500/20 px-3 py-3 rounded-md text-red-400 min-h-[300px]">{error}</div>
            : <Textarea readOnly className="font-mono text-sm min-h-[300px] resize-none" value={output} placeholder="XML output will appear here..." />}
        </CardContent></Card>
      </div>

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "XML to JSON", href: "/tools/xml-to-json" }, { name: "JSON Formatter", href: "/tools/json-formatter" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is JSON to XML?</h2>
            <p>JSON to XML conversion transforms JavaScript Object Notation data into eXtensible Markup Language format. This is useful when integrating with SOAP web services, generating configuration files, or working with systems that require XML input like Android manifests and Maven build files.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Paste JSON data or upload a .json file.</li><li>Click &quot;Convert&quot;.</li><li>Copy or download the XML output.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">How are arrays converted?</h3><p>JSON arrays are converted to repeated XML elements with the same tag name. For example, a &quot;user&quot; array produces multiple &lt;user&gt; elements.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Is the XML declaration included?</h3><p>Yes. The output includes the standard {`<?xml version="1.0" encoding="UTF-8"?>`} declaration at the top.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
