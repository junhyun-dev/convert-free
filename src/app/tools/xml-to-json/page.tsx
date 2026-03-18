"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function xmlNodeToJson(node: Element): unknown {
  const obj: Record<string, unknown> = {};

  // Handle attributes
  if (node.attributes && node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      obj["@" + attr.nodeName] = attr.nodeValue;
    }
  }

  // Handle child nodes
  const children = node.childNodes;
  let hasElementChildren = false;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.nodeType === 1) {
      hasElementChildren = true;
      const childElement = child as Element;
      const tagName = childElement.tagName;
      const childValue = xmlNodeToJson(childElement);

      if (obj[tagName] !== undefined) {
        if (!Array.isArray(obj[tagName])) {
          obj[tagName] = [obj[tagName]];
        }
        (obj[tagName] as unknown[]).push(childValue);
      } else {
        obj[tagName] = childValue;
      }
    }
  }

  // If no element children and no attributes, return text content
  if (!hasElementChildren && Object.keys(obj).length === 0) {
    const text = node.textContent?.trim() || "";
    // Try to parse as number or boolean
    if (text === "true") return true;
    if (text === "false") return false;
    if (text !== "" && !isNaN(Number(text))) return Number(text);
    return text;
  }

  // If has text content mixed with attributes but no element children
  if (!hasElementChildren && Object.keys(obj).length > 0) {
    const text = node.textContent?.trim() || "";
    if (text) obj["#text"] = text;
  }

  return obj;
}

function xmlToJson(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + errorNode.textContent);
  }

  const root = doc.documentElement;
  const result: Record<string, unknown> = {};
  result[root.tagName] = xmlNodeToJson(root);

  return JSON.stringify(result, null, 2);
}

const SAMPLE = `<users>
  <user id="1">
    <name>Alice</name>
    <age>30</age>
    <city>New York</city>
  </user>
  <user id="2">
    <name>Bob</name>
    <age>25</age>
    <city>London</city>
  </user>
</users>`;

export default function XmlToJsonPage() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const result = xmlToJson(input);
      setOutput(result);
      setError("");
    } catch {
      setError("Invalid XML format. Please check your input.");
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
        <h1 className="text-3xl font-bold">XML to JSON Converter</h1>
        <p className="text-muted-foreground mt-1">Convert XML data to JSON format instantly. Paste text or upload a .xml file.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={convert}>Convert</Button>
        <Button variant="secondary" onClick={() => setInput(SAMPLE)}>Sample</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
        <label className="cursor-pointer"><Button variant="outline" type="button">Upload XML</Button>
          <input type="file" accept=".xml" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} /></label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">XML Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder="Paste XML data here..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

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
          {[{ name: "JSON to XML", href: "/tools/json-to-xml" }, { name: "CSV to JSON", href: "/tools/csv-to-json" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is XML to JSON?</h2>
            <p>XML (eXtensible Markup Language) is a structured document format commonly used in SOAP APIs, configuration files, and RSS feeds. JSON is the preferred format for modern REST APIs and web apps. Converting XML to JSON simplifies working with legacy data in modern JavaScript applications.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Paste XML data or upload a .xml file.</li><li>Click &quot;Convert&quot;.</li><li>Copy or download the JSON output.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">How are XML attributes handled?</h3><p>Attributes are prefixed with @ in the JSON output. For example, &lt;user id=&quot;1&quot;&gt; becomes {`{"@id": "1"}`}.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">What about repeated elements?</h3><p>Repeated sibling elements with the same tag name are automatically grouped into a JSON array.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
