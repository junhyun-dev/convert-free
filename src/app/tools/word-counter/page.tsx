"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
}

function computeStats(text: string): Stats {
  if (!text.trim()) {
    return { characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, lines: 0, readingTime: "0 sec" };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = text.split("\n").length;

  const minutes = words / 200;
  let readingTime: string;
  if (minutes < 1) {
    readingTime = `${Math.max(1, Math.ceil(minutes * 60))} sec`;
  } else if (minutes < 60) {
    readingTime = `${Math.ceil(minutes)} min`;
  } else {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.ceil(minutes % 60);
    readingTime = `${hrs} hr ${mins} min`;
  }

  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime };
}

export default function WordCounterPage() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => computeStats(input), [input]);

  const statCards = [
    { label: "Characters", value: stats.characters.toLocaleString(), sub: "with spaces" },
    { label: "Characters", value: stats.charactersNoSpaces.toLocaleString(), sub: "without spaces" },
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Reading Time", value: stats.readingTime, sub: "~200 wpm" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Word & Character Counter</h1>
        <p className="text-muted-foreground mt-1">Count words, characters, sentences, paragraphs, lines, and estimate reading time in real-time.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Your Text</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            placeholder="Start typing or paste your text here..."
            className="text-sm min-h-[250px] resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {statCards.map((s, idx) => (
          <Card key={idx}>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              {s.sub && <div className="text-xs text-muted-foreground/60">{s.sub}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Case Converter", href: "/tools/case-converter" }, { name: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum-generator" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is a Word Counter?</h2>
            <p>A <strong>word counter</strong> is a tool that analyzes text and provides detailed statistics including word count, character count, sentence count, and more. It is essential for writers, students, content creators, and SEO professionals who need to meet specific word count requirements.</p>
            <p>This tool counts <strong>characters</strong> (with and without spaces), <strong>words</strong> (separated by whitespace), <strong>sentences</strong> (separated by periods, exclamation marks, or question marks), <strong>paragraphs</strong> (separated by blank lines), and <strong>lines</strong> (separated by line breaks).</p>
            <p>The <strong>reading time</strong> estimate is based on an average reading speed of 200 words per minute, which is a commonly accepted rate for English prose. All statistics update in real-time as you type, with no button click required.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Type or paste your text into the <strong>text area</strong>.</li>
              <li>All statistics update <strong>instantly</strong> as you type.</li>
              <li>No button click needed &mdash; results are always in sync with your input.</li>
            </ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">How are words counted?</h3><p>Words are counted by splitting the text on whitespace (spaces, tabs, newlines). Consecutive whitespace is treated as a single delimiter. Hyphenated words like &quot;well-known&quot; count as one word.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">How is reading time calculated?</h3><p>Reading time is estimated at 200 words per minute, which is the average silent reading speed for English text. Technical or dense content may take longer. Very short texts show the estimate in seconds.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Does it count characters in different languages?</h3><p>Yes. The character count includes all characters regardless of language. CJK characters, emojis, and diacritics are each counted as one character. Spaces and punctuation are also counted in the &quot;with spaces&quot; metric.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
