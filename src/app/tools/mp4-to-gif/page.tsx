"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Mp4ToGifPage() {
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const [file, setFile] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState("");
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);

  useEffect(() => {
    return () => {
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!/\.(mp4|webm|mov)$/i.test(f.name)) return;
    if (f.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum size is 100MB for browser-based conversion.");
      return;
    }
    setFile(f);
    setGifUrl(null);
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
      setProgress("Processing video...");

      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(file));
      await ffmpeg.exec([
        "-i", `input.${ext}`,
        "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        "-loop", "0",
        "output.gif",
      ]);

      const data = await ffmpeg.readFile("output.gif");
      const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: "image/gif" });
      setGifUrl(URL.createObjectURL(blob));
      setProgress("Done!");
      ffmpeg.terminate();
    } catch (err) {
      setProgress("Error: conversion failed. Try a shorter video or different format.");
      console.error(err);
    }

    setConverting(false);
  }, [file, fps, width]);

  const clear = () => {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setFile(null);
    setGifUrl(null);
    setProgress("");
  };

  const formatSize = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MP4 to GIF Converter</h1>
        <p className="text-muted-foreground mt-1">Convert MP4 videos to GIF animations. Adjust FPS and width for optimal size.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      <Card><CardContent className="pt-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">FPS: {fps}</label>
            <input type="range" min="5" max="30" step="1" value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-32" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Width:</label>
            <select value={width} onChange={(e) => setWidth(Number(e.target.value))} className="px-2 py-1 rounded-md border bg-background text-sm">
              <option value={320}>320px</option>
              <option value={480}>480px</option>
              <option value={640}>640px</option>
              <option value={800}>800px</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Lower FPS and width = smaller GIF file size.</p>
      </CardContent></Card>

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
              <p className="text-lg font-medium">Drag & drop a video here</p>
              <p className="text-sm text-muted-foreground mt-1">MP4, WebM, or MOV</p>
              <label className="cursor-pointer">
                <Button variant="secondary" className="mt-4" type="button">Select Video</Button>
                <input type="file" accept=".mp4,.webm,.mov" className="hidden" onChange={(e) => handleFile(e.target.files)} />
              </label>
            </>
          )}
        </div>
      </CardContent></Card>

      {file && (
        <div className="flex items-center gap-4">
          <Button onClick={convert} disabled={converting}>{converting ? "Converting..." : "Convert to GIF"}</Button>
          {progress && <span className="text-sm text-muted-foreground" aria-live="polite">{progress}</span>}
        </div>
      )}

      {gifUrl && (
        <Card><CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-green-400">GIF created!</CardTitle>
            <a href={gifUrl} download={file ? file.name.replace(/\.(mp4|webm|mov)$/i, ".gif") : "output.gif"}>
              <Button size="sm">Download GIF</Button>
            </a>
          </div>
        </CardHeader><CardContent>
          <img src={gifUrl} alt="Converted GIF" className="max-w-full rounded-md mx-auto" style={{ maxHeight: 400 }} />
        </CardContent></Card>
      )}

      <section className="py-6"><h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "GIF to MP4", href: "/tools/gif-to-mp4" }, { name: "Image Compressor", href: "/tools/image-compressor" }, { name: "Image Resizer", href: "/tools/image-resizer" }].map((t) => (
            <a key={t.href} href={t.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{t.name}</a>))}
        </div>
      </section>

      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what"><TabsList><TabsTrigger value="what">About</TabsTrigger><TabsTrigger value="how">How to Use</TabsTrigger><TabsTrigger value="faq">FAQ</TabsTrigger></TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">Why Convert MP4 to GIF?</h2><p>GIFs are perfect for short animations, reactions, tutorials, and social media. They play automatically without a video player and work everywhere — emails, forums, messaging apps, and websites. While GIFs are larger than MP4, they&apos;re more universally embeddable.</p></TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">How to Use</h2><ol className="list-decimal list-inside space-y-2"><li>Set FPS (10 recommended) and width (480px for web).</li><li>Upload an MP4, WebM, or MOV video.</li><li>Click &quot;Convert to GIF&quot;.</li><li>Preview and download.</li></ol></TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm"><h2 className="text-lg font-semibold text-foreground">FAQ</h2><div><h3 className="text-sm font-semibold text-foreground">Why is the GIF so large?</h3><p>GIFs are inherently large compared to video. Reduce FPS to 10 and width to 320px for smaller files. Keep videos short (under 10 seconds) for best results.</p></div><div><h3 className="text-sm font-semibold text-foreground">Is there a video length limit?</h3><p>No hard limit, but longer videos (30s+) will take more time and produce very large GIF files. We recommend clips under 15 seconds.</p></div></TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
