"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UrlEncodeDecodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setError("");
    } catch {
      setError("Failed to encode. Please check your input.");
    }
  }, [input]);

  const decode = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      setError("");
    } catch {
      setError("Invalid URL-encoded string. Please check your input.");
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
    a.download = "url-output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">URL Encoder & Decoder</h1>
        <p className="text-muted-foreground mt-1">Encode special characters for URLs or decode percent-encoded strings back to readable text.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={encode}>Encode</Button>
        <Button onClick={decode}>Decode</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Input</CardTitle></CardHeader>
          <CardContent><Textarea placeholder="Enter text to encode, or URL-encoded string to decode..." className="font-mono text-sm min-h-[300px] resize-none" value={input} onChange={(e) => setInput(e.target.value)} /></CardContent></Card>

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
          {[{ name: "Base64 Encode/Decode", href: "/tools/base64-encode-decode" }, { name: "JSON Formatter", href: "/tools/json-formatter" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is URL Encoding?</h2>
            <p><strong>URL encoding</strong> (also called percent-encoding) is a mechanism for converting characters that are not allowed in a URL into a format that can be transmitted over the internet. Special characters like spaces, ampersands (&amp;), and non-ASCII characters are replaced with a percent sign (%) followed by their hexadecimal byte values.</p>
            <p>For example, a space becomes <code>%20</code>, an ampersand becomes <code>%26</code>, and the Japanese character &quot;&#26481;&quot; becomes <code>%E6%9D%B1</code>. URL encoding is defined by <strong>RFC 3986</strong> and is essential for building valid query strings, form submissions, and API requests.</p>
            <p>This tool uses JavaScript&apos;s <code>encodeURIComponent()</code> for encoding, which encodes all characters except <code>A-Z a-z 0-9 - _ . ~ ! * &apos; ( )</code>. For decoding, it uses <code>decodeURIComponent()</code> to restore the original text.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Paste your <strong>plain text</strong> or <strong>URL-encoded string</strong> into the input box.</li>
              <li>Click <strong>&quot;Encode&quot;</strong> to percent-encode the text, or <strong>&quot;Decode&quot;</strong> to convert it back.</li>
              <li>Copy or download the result.</li>
            </ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">What is the difference between encodeURI and encodeURIComponent?</h3><p><code>encodeURI()</code> encodes a full URI but leaves reserved characters like <code>: / ? # &amp;</code> intact. <code>encodeURIComponent()</code> (used by this tool) encodes everything except basic alphanumeric characters, making it suitable for encoding individual query parameter values.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Why do I need to URL-encode query parameters?</h3><p>Characters like <code>&amp;</code>, <code>=</code>, and <code>?</code> have special meaning in URLs. If your parameter values contain these characters, they must be encoded to prevent them from being misinterpreted as URL delimiters.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Does it handle Unicode characters?</h3><p>Yes. Non-ASCII characters are encoded as their UTF-8 byte sequences in percent-encoded form. For example, a single CJK character may produce multiple <code>%XX</code> sequences.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
