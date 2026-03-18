"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Base64EncodDecodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError("");
    } catch {
      setError("Failed to encode. Please check your input.");
    }
  }, [input]);

  const decode = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError("");
    } catch {
      setError("Invalid Base64 string. Please check your input.");
    }
  }, [input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "base64-output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Base64 Encoder & Decoder</h1>
        <p className="text-muted-foreground mt-1">Encode text to Base64 or decode Base64 back to text. Supports UTF-8 characters.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={encode}>Encode</Button>
        <Button onClick={decode}>Decode</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder="Enter text to encode, or Base64 string to decode..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between">
          <CardTitle className="text-sm">Output</CardTitle>
          {output && <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</Button>
            <Button variant="ghost" size="sm" onClick={downloadOutput}>Download</Button>
          </div>}
        </div></CardHeader><CardContent>
          {error ? <div className="font-mono text-sm bg-red-500/10 border border-red-500/20 px-3 py-3 rounded-md text-red-400 min-h-[300px]">{error}</div>
            : <Textarea readOnly className="font-mono text-sm min-h-[300px] resize-none" value={output} placeholder="Output will appear here..." />}
        </CardContent></Card>
      </div>

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "URL Encode/Decode", href: "/tools/url-encode-decode" }, { name: "JSON Formatter", href: "/tools/json-formatter" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is Base64 Encoding?</h2>
            <p><strong>Base64</strong> is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It is commonly used to embed binary data in text-based formats such as JSON, XML, HTML, and email (MIME).</p>
            <p>Base64 encoding increases the data size by approximately 33%, but ensures the data can be safely transmitted through text-only channels without corruption. Common use cases include encoding images as data URIs, transmitting file attachments in emails, and storing binary data in JSON APIs.</p>
            <p>This tool handles <strong>UTF-8 text</strong> correctly, meaning you can encode and decode strings containing non-ASCII characters like emojis, Chinese, Japanese, Korean, and other Unicode characters without data loss.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Paste your <strong>plain text</strong> (to encode) or <strong>Base64 string</strong> (to decode) into the input box.</li>
              <li>Click <strong>&quot;Encode&quot;</strong> to convert text to Base64, or <strong>&quot;Decode&quot;</strong> to convert Base64 back to text.</li>
              <li>Copy the result with the <strong>Copy</strong> button or save it with <strong>Download</strong>.</li>
            </ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Does it support Unicode and emojis?</h3><p>Yes. This tool uses UTF-8 encoding internally, so characters like accented letters, CJK characters, and emojis are fully supported.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Is Base64 encryption?</h3><p>No. Base64 is an <strong>encoding</strong>, not encryption. It does not provide any security. Anyone can decode a Base64 string. Never use Base64 to hide sensitive data.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Why is the encoded output longer than the input?</h3><p>Base64 encoding increases data size by about 33% because it maps every 3 bytes of input to 4 ASCII characters. This is a trade-off for making binary data safe for text-based transport.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
