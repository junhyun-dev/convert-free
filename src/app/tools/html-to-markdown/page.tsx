"use client";

import { useState, useCallback } from "react";
import TurndownService from "turndown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function htmlToMarkdown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  return turndownService.turndown(html);
}

const SAMPLE = `<h1>Welcome to My Blog</h1>
<p>This is a <strong>sample article</strong> with various HTML elements.</p>

<h2>Features</h2>
<ul>
  <li>Easy to use</li>
  <li>Fast conversion</li>
  <li>100% free</li>
</ul>

<h2>Code Example</h2>
<pre><code>const greeting = "Hello, World!";
console.log(greeting);</code></pre>

<h2>Links and Images</h2>
<p>Visit <a href="https://example.com">Example.com</a> for more info.</p>
<p>Here is a <em>blockquote</em>:</p>
<blockquote><p>The best way to predict the future is to create it.</p></blockquote>

<h3>Table Example</h3>
<table>
  <tr><th>Name</th><th>Age</th></tr>
  <tr><td>Alice</td><td>30</td></tr>
  <tr><td>Bob</td><td>25</td></tr>
</table>`;

export default function HtmlToMarkdownPage() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const result = htmlToMarkdown(input);
      setOutput(result);
      setError("");
    } catch {
      setError("Invalid HTML format. Please check your input.");
    }
  }, [input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
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
        <h1 className="text-3xl font-bold">HTML to Markdown Converter</h1>
        <p className="text-muted-foreground mt-1">Convert HTML to clean Markdown format instantly. Paste text or upload a .html file.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={convert}>Convert</Button>
        <Button variant="secondary" onClick={() => setInput(SAMPLE)}>Sample</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
        <label className="cursor-pointer"><Button variant="outline" type="button">Upload HTML</Button>
          <input type="file" accept=".html,.htm" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} /></label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">HTML Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder="Paste HTML here..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">Markdown Output</CardTitle>
          {output && <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</Button>
            <Button variant="ghost" size="sm" onClick={downloadMarkdown}>Download</Button>
          </div>}
        </div></CardHeader><CardContent>
          {error ? <div className="font-mono text-sm bg-red-500/10 border border-red-500/20 px-3 py-3 rounded-md text-red-400 min-h-[300px]">{error}</div>
            : <Textarea readOnly className="font-mono text-sm min-h-[300px] resize-none" value={output} placeholder="Markdown output will appear here..." />}
        </CardContent></Card>
      </div>

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Markdown to PDF", href: "/tools/markdown-to-pdf" }, { name: "CSV to JSON", href: "/tools/csv-to-json" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is HTML to Markdown?</h2>
            <p>Markdown is a lightweight markup language widely used for documentation, README files, blog posts, and static site generators like Jekyll and Hugo. Converting HTML to Markdown produces clean, readable text that is easy to edit and version control. This is especially useful for migrating content from CMS platforms or web pages to Markdown-based systems.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2"><li>Paste HTML code or upload a .html file.</li><li>Click &quot;Convert&quot;.</li><li>Copy or download the Markdown output.</li></ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Which HTML elements are supported?</h3><p>Headings (h1-h6), paragraphs, bold, italic, links, images, lists (ordered/unordered), blockquotes, code blocks, and horizontal rules are all converted to their Markdown equivalents.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">What about inline styles and classes?</h3><p>CSS classes and inline styles are stripped during conversion since Markdown does not support styling. Only the semantic content is preserved.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
