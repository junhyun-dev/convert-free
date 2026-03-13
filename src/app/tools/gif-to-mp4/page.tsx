"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GifToMp4Page() {
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const [file, setFile] = useState<File | null>(null);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    return () => {
      if (mp4Url) URL.revokeObjectURL(mp4Url);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

const handleFile = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!/\.gif$/i.test(f.name)) return;
    if (f.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum size is 100MB for browser-based conversion.");
      return;
    }
    setFile(f);
    setMp4Url(null);
    setProgress("");
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setConverting(true);
    setProgress("Loading FFmpeg...");

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(`Converting... ${Math.round(p * 100)}%`);
      });

      await ffmpeg.load();
      setProgress("Processing GIF...");

      await ffmpeg.writeFile("input.gif", await fetchFile(file));
      await ffmpeg.exec([
        "-i", "input.gif",
        "-movflags", "faststart",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: "video/mp4" });
      setMp4Url(URL.createObjectURL(blob));
      setProgress("Done!");
      ffmpeg.terminate();
    } catch (err) {
      setProgress("Error: conversion failed. Try a different GIF.");
      console.error(err);
    }

    setConverting(false);
  }, [file]);

  const clear = () => {
    if (mp4Url) URL.revokeObjectURL(mp4Url);
    setFile(null);
    setMp4Url(null);
    setProgress("");
  };

  const formatSize = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GIF to MP4 Converter</h1>
        <p className="text-muted-foreground mt-1">Convert GIF animations to MP4 video. Much smaller file size with better quality.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card><CardContent className="p-8">
        <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}>
          {file ? (
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={clear}>Remove</Button>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium">Drag & drop a GIF here</p>
              <label className="cursor-pointer">
                <Button variant="secondary" className="mt-4" type="button">Select GIF</Button>
                <input type="file" accept=".gif" className="hidden" onChange={(e) => handleFile(e.target.files)} />
              </label>
            </>
          )}
        </div>
      </CardContent></Card>

      {file && (
        <div className="flex items-center gap-4">
          <Button onClick={convert} disabled={converting}>{converting ? "Converting..." : "Convert to MP4"}</Button>
          {progress && <span className="text-sm text-muted-foreground" aria-live="polite">{progress}</span>}
        </div>
      )}

      {mp4Url && (
        <Card><CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-green-400">Conversion complete!</CardTitle>
            <a href={mp4Url} download={file ? file.name.replace(/\.gif$/i, ".mp4") : "output.mp4"}>
              <Button size="sm">Download MP4</Button>
            </a>
          </div>
        </CardHeader><CardContent>
          <video src={mp4Url} controls loop className="max-w-full rounded-md mx-auto" style={{ maxHeight: 400 }} />
        </CardContent></Card>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "MP4 to GIF", href: "/tools/mp4-to-gif" }, { name: "Image Compressor", href: "/tools/image-compressor" }, { name: "Image Resizer", href: "/tools/image-resizer" }].map((t) => (
            <a key={t.href} href={t.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{t.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">Why Convert GIF to MP4?</h2><p>MP4 videos are typically 80-90% smaller than GIF files while maintaining better visual quality. They load faster on websites, use less bandwidth, and are supported everywhere. If you&apos;re sharing animations online, MP4 is the modern standard.</p></TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">How to Use</h2><ol className="list-decimal list-inside space-y-2"><li>Upload a GIF file.</li><li>Click &quot;Convert to MP4&quot;.</li><li>Wait for processing (first load may take a moment).</li><li>Preview and download the MP4 video.</li></ol></TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">FAQ</h2><div><h3 className="text-sm font-semibold text-foreground">Why is the first conversion slow?</h3><p>FFmpeg needs to load in your browser on first use (~30MB). Subsequent conversions are faster.</p></div><div><h3 className="text-sm font-semibold text-foreground">Is there a file size limit?</h3><p>No hard limit, but very large GIFs (50MB+) may be slow since processing happens in your browser.</p></div></TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
