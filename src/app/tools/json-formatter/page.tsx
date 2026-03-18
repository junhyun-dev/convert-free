"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SAMPLE = `{"name":"John Doe","age":30,"address":{"street":"123 Main St","city":"New York","state":"NY"},"hobbies":["reading","coding","gaming"],"active":true}`;

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");
  const [copied, setCopied] = useState(false);

  const getIndent = useCallback(() => {
    if (indent === "tab") return "\t";
    return parseInt(indent);
  }, [indent]);

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, getIndent());
      setOutput(formatted);
      setError("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(`Invalid JSON: ${msg}`);
      setOutput("");
    }
  }, [input, getIndent]);

  const minify = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(`Invalid JSON: ${msg}`);
      setOutput("");
    }
  }, [input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">JSON Formatter & Validator</h1>
        <p className="text-muted-foreground mt-1">Format, beautify, minify, and validate JSON data. Customize indentation to your preference.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={format}>Format</Button>
        <Button variant="secondary" onClick={minify}>Minify</Button>
        <Button variant="secondary" onClick={() => setInput(SAMPLE)}>Sample</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-sm text-muted-foreground mr-1">Indent:</span>
          {(["2", "4", "tab"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setIndent(opt)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                indent === opt
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              {opt === "tab" ? "Tab" : `${opt} spaces`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">JSON Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder='Paste JSON here... e.g. {"key": "value"}' className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">Formatted Output</CardTitle>
          {output && <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</Button>
            <Button variant="ghost" size="sm" onClick={downloadOutput}>Download</Button>
          </div>}
        </div></CardHeader><CardContent>
          {error ? <div className="font-mono text-sm bg-red-500/10 border border-red-500/20 px-3 py-3 rounded-md text-red-400 min-h-[300px] whitespace-pre-wrap">{error}</div>
            : <Textarea readOnly className="font-mono text-sm min-h-[300px] resize-none" value={output} placeholder="Formatted JSON will appear here..." />}
        </CardContent></Card>
      </div>

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "JSON to CSV", href: "/tools/json-to-csv" }, { name: "JSON to YAML", href: "/tools/json-to-yaml" }, { name: "JSON to XML", href: "/tools/json-to-xml" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is JSON Formatting?</h2>
            <p><strong>JSON</strong> (JavaScript Object Notation) is a lightweight data interchange format widely used in web APIs, configuration files, and data storage. Raw JSON from APIs or minified sources is often a single long line that is difficult to read.</p>
            <p>A <strong>JSON formatter</strong> (also called a JSON beautifier or pretty-printer) adds proper indentation and line breaks to make the structure visible at a glance. This tool also <strong>validates</strong> your JSON, catching syntax errors like missing commas, unmatched brackets, or trailing commas before they cause issues in your code.</p>
            <p>You can choose between <strong>2-space</strong>, <strong>4-space</strong>, or <strong>tab</strong> indentation. The <strong>minify</strong> option removes all whitespace, producing the most compact representation for production use or network transfer.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Paste your JSON data into the input box, or click <strong>&quot;Sample&quot;</strong> to load example data.</li>
              <li>Select your preferred <strong>indentation</strong> (2 spaces, 4 spaces, or tabs).</li>
              <li>Click <strong>&quot;Format&quot;</strong> to beautify the JSON, or <strong>&quot;Minify&quot;</strong> to compress it.</li>
              <li>If there are syntax errors, they will be displayed with the specific error message from the JSON parser.</li>
              <li>Copy or download the result.</li>
            </ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Does it fix invalid JSON automatically?</h3><p>No. This tool validates and formats valid JSON only. If your JSON has syntax errors (like trailing commas or single quotes), you need to fix them manually. The error message will point you to the approximate location of the issue.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">What is the maximum JSON size supported?</h3><p>Since everything runs in your browser, the limit depends on your device&apos;s available memory. Most modern browsers can handle JSON files up to 50-100 MB without issues.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Does minification change the data?</h3><p>No. Minification only removes whitespace (spaces, tabs, newlines). The actual data values remain identical. You can format a minified JSON and get back the same structured output.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
