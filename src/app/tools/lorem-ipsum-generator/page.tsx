"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus, nec egestas arcu porttitor vel.",
  "Proin gravida nibh vel velit auctor aliquet aenean sollicitudin.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  "Vestibulum tortor quam, feugiat vitae ultricies eget, tempor sit amet ante.",
  "Donec eu libero sit amet quam egestas semper aenean ultricies mi vitae est.",
  "Mauris placerat eleifend leo quis pellentesque sagittis.",
  "Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui.",
  "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
  "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
  "Maecenas sed diam eget risus varius blandit sit amet non magna.",
  "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  "Cras mattis consectetur purus sit amet fermentum.",
  "Aenean lacinia bibendum nulla sed consectetur praesent commodo cursus magna.",
  "Nullam quis risus eget urna mollis ornare vel eu leo.",
  "Etiam porta sem malesuada magna mollis euismod.",
  "Donec sed odio dui cras justo odio dapibus ut facilisis.",
  "Vestibulum id ligula porta felis euismod semper.",
  "Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus.",
  "Nulla vitae elit libero, a pharetra augue mollis interdum.",
  "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
  "Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
  "Vivamus elementum semper nisi aenean vulputate eleifend tellus.",
  "Aenean leo ligula, porttitor eu consequat vitae, eleifend ac enim.",
  "Aliquam lorem ante, dapibus in viverra quis, feugiat a tellus.",
  "Phasellus viverra nulla ut metus varius laoreet quisque rutrum.",
];

const CLASSIC_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

function generateParagraph(sentenceCount: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    const idx = Math.floor(Math.random() * LOREM_SENTENCES.length);
    sentences.push(LOREM_SENTENCES[idx]);
  }
  return sentences.join(" ");
}

function generateLoremIpsum(paragraphs: number, startWithClassic: boolean): string {
  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    const sentenceCount = 4 + Math.floor(Math.random() * 4); // 4-7 sentences per paragraph
    let para = generateParagraph(sentenceCount);
    if (i === 0 && startWithClassic) {
      para = CLASSIC_START + " " + para;
    }
    result.push(para);
  }
  return result.join("\n\n");
}

export default function LoremIpsumGeneratorPage() {
  const [paragraphCount, setParagraphCount] = useState(3);
  const [startWithClassic, setStartWithClassic] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const text = generateLoremIpsum(paragraphCount, startWithClassic);
    setOutput(text);
  }, [paragraphCount, startWithClassic]);

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
    a.download = "lorem-ipsum.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground mt-1">Generate Lorem Ipsum placeholder text for your designs, mockups, and layouts.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Options</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Paragraphs</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={paragraphCount}
                  onChange={(e) => setParagraphCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="h-10 w-20 rounded-md border border-input bg-background px-3 text-sm"
                />
                <span className="text-xs text-muted-foreground">1-20</span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={startWithClassic}
                onChange={(e) => setStartWithClassic(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm text-muted-foreground">Start with &quot;Lorem ipsum dolor sit amet...&quot;</span>
            </label>
          </div>

          <Button onClick={generate}>Generate</Button>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Generated Text</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</Button>
                <Button variant="ghost" size="sm" onClick={downloadOutput}>Download</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea readOnly className="text-sm min-h-[300px] resize-none" value={output} />
          </CardContent>
        </Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Word Counter", href: "/tools/word-counter" }, { name: "Case Converter", href: "/tools/case-converter" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is Lorem Ipsum?</h2>
            <p><strong>Lorem Ipsum</strong> is dummy placeholder text used in the printing and typesetting industry since the 1500s. It originates from a scrambled passage of &quot;De Finibus Bonorum et Malorum&quot; (On the Ends of Good and Evil) written by Cicero in 45 BC.</p>
            <p>Designers and developers use Lorem Ipsum to fill layouts and mockups with realistic-looking text before final content is available. Its Latin-like appearance prevents readers from being distracted by readable content and lets them focus on the visual design instead.</p>
            <p>This generator creates paragraphs by randomly combining authentic Latin-style sentences. You can choose how many paragraphs to generate (1-20) and optionally start with the classic &quot;Lorem ipsum dolor sit amet&quot; opening.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Set the number of <strong>paragraphs</strong> you need (1-20).</li>
              <li>Choose whether to start with the classic <strong>&quot;Lorem ipsum dolor sit amet...&quot;</strong> opening.</li>
              <li>Click <strong>&quot;Generate&quot;</strong>.</li>
              <li>Copy the text with the <strong>Copy</strong> button or save it with <strong>Download</strong>.</li>
            </ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">Is Lorem Ipsum real Latin?</h3><p>Partially. The text is derived from Cicero&apos;s philosophical work, but has been altered and scrambled over centuries. Many words are not real Latin, but the text has a natural rhythm and word-length distribution that mimics real writing.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Why use Lorem Ipsum instead of English placeholder text?</h3><p>Using real-language text in mockups causes viewers to read and critique the content rather than evaluating the design. Lorem Ipsum&apos;s unfamiliar Latin-like appearance keeps the focus on layout, typography, and visual hierarchy.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Is the generated text the same every time?</h3><p>No. Each paragraph is composed of randomly selected sentences, so every generation produces a unique combination. Only the optional classic opening sentence stays the same.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
