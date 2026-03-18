"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function toWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamelCase(str: string): string {
  const words = toWords(str);
  if (words.length === 0) return "";
  return words[0].toLowerCase() + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function toSnakeCase(str: string): string {
  return toWords(str).map((w) => w.toLowerCase()).join("_");
}

function toKebabCase(str: string): string {
  return toWords(str).map((w) => w.toLowerCase()).join("-");
}

interface CaseResult {
  label: string;
  value: string;
}

export default function CaseConverterPage() {
  const [input, setInput] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const results: CaseResult[] = useMemo(() => {
    if (!input.trim()) return [];
    return [
      { label: "UPPERCASE", value: input.toUpperCase() },
      { label: "lowercase", value: input.toLowerCase() },
      { label: "Title Case", value: toTitleCase(input) },
      { label: "camelCase", value: toCamelCase(input) },
      { label: "snake_case", value: toSnakeCase(input) },
      { label: "kebab-case", value: toKebabCase(input) },
    ];
  }, [input]);

  const copyResult = async (value: string, idx: number) => {
    await navigator.clipboard.writeText(value);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Text Case Converter</h1>
        <p className="text-muted-foreground mt-1">Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case instantly.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Input Text</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type or paste your text here..."
            className="font-mono text-sm min-h-[150px] resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((r, idx) => (
            <Card key={r.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{r.label}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyResult(r.value, idx)}>
                    {copiedIdx === idx ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm bg-muted/50 rounded-md p-3 break-all whitespace-pre-wrap min-h-[60px]">
                  {r.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Word Counter", href: "/tools/word-counter" }, { name: "Base64 Encode/Decode", href: "/tools/base64-encode-decode" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is a Text Case Converter?</h2>
            <p>A <strong>text case converter</strong> transforms text between different capitalization and naming conventions. Developers frequently need to convert between naming styles when working across different programming languages, file formats, and coding standards.</p>
            <p>This tool supports six common formats: <strong>UPPERCASE</strong> (all capitals), <strong>lowercase</strong> (all small), <strong>Title Case</strong> (first letter of each word capitalized), <strong>camelCase</strong> (used in JavaScript and Java variables), <strong>snake_case</strong> (used in Python, Ruby, and SQL), and <strong>kebab-case</strong> (used in CSS classes and URL slugs).</p>
            <p>All conversions are displayed simultaneously, so you can see all output variations at once and copy whichever format you need.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Type or paste your text into the <strong>input box</strong>.</li>
              <li>All six case variations appear instantly below as you type.</li>
              <li>Click the <strong>Copy</strong> button on any output card to copy that format to your clipboard.</li>
            </ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">When should I use camelCase vs snake_case?</h3><p><strong>camelCase</strong> is the standard for JavaScript/TypeScript variables, Java methods, and C# properties. <strong>snake_case</strong> is preferred in Python, Ruby, Rust, and SQL column names. Follow the conventions of the language or framework you are working with.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">What is kebab-case used for?</h3><p><strong>kebab-case</strong> (words separated by hyphens) is widely used for CSS class names, HTML attributes, URL slugs, and file names. It is easy to read and avoids issues with case-sensitive file systems.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Does it handle multi-word input correctly?</h3><p>Yes. The converter splits input on spaces, underscores, hyphens, and camelCase boundaries. So &quot;hello world&quot;, &quot;hello_world&quot;, &quot;hello-world&quot;, and &quot;helloWorld&quot; all produce the same results.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
