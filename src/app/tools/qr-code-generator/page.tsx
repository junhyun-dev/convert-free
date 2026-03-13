"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "qrcode";

type QrMode = "text" | "url" | "wifi" | "email";

export default function QrCodeGeneratorPage() {
  const [mode, setMode] = useState<QrMode>("url");
  const [text, setText] = useState("https://www.convertfree.cc");
  const [url, setUrl] = useState("https://www.convertfree.cc");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [size, setSize] = useState("300");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getQrContent = useCallback((): string => {
    switch (mode) {
      case "url": return url;
      case "text": return text;
      case "wifi": return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case "email": {
        const params = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        return `mailto:${emailTo}${params.length ? "?" + params.join("&") : ""}`;
      }
      default: return "";
    }
  }, [mode, text, url, wifiSsid, wifiPassword, wifiEncryption, emailTo, emailSubject, emailBody]);

  const generate = useCallback(async () => {
    const content = getQrContent();
    if (!content.trim()) {
      setError("Please enter some content to generate a QR code.");
      setQrDataUrl("");
      return;
    }

    try {
      const sizeNum = Math.max(100, Math.min(1000, parseInt(size) || 300));
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, content, {
        width: sizeNum,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "M",
      });

      setQrDataUrl(canvas.toDataURL("image/png"));
      setError("");
    } catch {
      setError("Failed to generate QR code. Content may be too long.");
      setQrDataUrl("");
    }
  }, [getQrContent, size, fgColor, bgColor]);

  // Auto-generate on mount and when inputs change
  useEffect(() => {
    const timer = setTimeout(() => { generate(); }, 300);
    return () => clearTimeout(timer);
  }, [generate]);

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = async () => {
    const content = getQrContent();
    if (!content.trim()) return;
    try {
      const sizeNum = Math.max(100, Math.min(1000, parseInt(size) || 300));
      const svgStr = await QRCode.toString(content, {
        type: "svg",
        width: sizeNum,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "M",
      });
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(urlObj);
    } catch {
      // ignore
    }
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvasRef.current!.toBlob(resolve, "image/png")
      );
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      }
    } catch {
      // Fallback: copy data URL as text
      if (qrDataUrl) await navigator.clipboard.writeText(qrDataUrl);
    }
  };

  const modes: { key: QrMode; label: string }[] = [
    { key: "url", label: "URL" },
    { key: "text", label: "Text" },
    { key: "wifi", label: "Wi-Fi" },
    { key: "email", label: "Email" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
        <p className="text-muted-foreground mt-1">Generate QR codes for URLs, text, Wi-Fi networks, and email. Download as PNG or SVG.</p>
        <Badge variant="secondary" className="mt-2">No data sent to server</Badge>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              mode === m.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "url" && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
            )}

            {mode === "text" && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Text Content</label>
                <Textarea
                  placeholder="Enter any text..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">{text.length}/2000</p>
              </div>
            )}

            {mode === "wifi" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Network Name (SSID)</label>
                  <input placeholder="My Wi-Fi Network" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Password</label>
                  <input type="password" placeholder="Password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Encryption</label>
                  <select
                    className="w-full h-12 rounded-md border border-input bg-background px-3 text-sm"
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value as "WPA" | "WEP" | "nopass")}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
              </>
            )}

            {mode === "email" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Email Address</label>
                  <input type="email" placeholder="hello@example.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Subject</label>
                  <input placeholder="Subject line" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Body</label>
                  <Textarea placeholder="Email body..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="min-h-[80px] resize-none" />
                </div>
              </>
            )}

            {/* Customization */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Customize</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Size (px)</label>
                  <input type="number" min="100" max="1000" value={size} onChange={(e) => setSize(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Foreground</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-input" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-input" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white rounded-lg p-4 border border-border inline-block">
                <canvas ref={canvasRef} className={qrDataUrl ? "" : "hidden"} />
                {!qrDataUrl && !error && (
                  <div className="w-[200px] h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                    Enter content to generate
                  </div>
                )}
                {error && (
                  <div className="w-[200px] h-[200px] flex items-center justify-center text-red-500 text-sm text-center px-4">
                    {error}
                  </div>
                )}
              </div>

              {qrDataUrl && (
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button onClick={downloadPng}>Download PNG</Button>
                  <Button variant="secondary" onClick={downloadSvg}>Download SVG</Button>
                  <Button variant="outline" onClick={copyToClipboard}>Copy Image</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Tools */}
      <section className="py-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {[{ name: "Image Compressor", href: "/tools/image-compressor" }, { name: "SVG to PNG", href: "/tools/svg-to-png" }, { name: "Image Resizer", href: "/tools/image-resizer" }].map((tool) => (
            <a key={tool.href} href={tool.href} className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">{tool.name}</a>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="space-y-4 py-8 border-t">
        <Tabs defaultValue="what">
          <TabsList>
            <TabsTrigger value="what">About</TabsTrigger>
            <TabsTrigger value="how">How to Use</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="what" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">What is a QR Code?</h2>
            <p>A <strong>QR code</strong> (Quick Response code) is a two-dimensional barcode that can store text, URLs, contact information, Wi-Fi credentials, and more. Invented in 1994 by Denso Wave, QR codes have become ubiquitous in modern life — from restaurant menus and payment systems to event tickets and product packaging.</p>
            <p>This generator creates <strong>high-quality QR codes</strong> with customizable colors and sizes. It supports four content types: <strong>URLs</strong> (website links), <strong>plain text</strong>, <strong>Wi-Fi network credentials</strong> (scan to connect), and <strong>email addresses</strong> with pre-filled subject and body. All QR codes use <strong>error correction level M</strong>, which can recover up to 15% of damaged data.</p>
            <p>Unlike many QR code generators that require server-side processing, this tool runs <strong>100% in your browser</strong>. Your data never leaves your device, making it ideal for generating QR codes containing <strong>sensitive information</strong> like Wi-Fi passwords or private URLs.</p>
          </TabsContent>
          <TabsContent value="how" className="mt-4 space-y-3 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Choose a <strong>content type</strong>: URL, Text, Wi-Fi, or Email.</li>
              <li>Enter the content you want to encode in the QR code.</li>
              <li>Optionally customize the <strong>size</strong> (100-1000px) and <strong>colors</strong>.</li>
              <li>The QR code generates automatically as you type.</li>
              <li>Click <strong>Download PNG</strong> for a raster image, <strong>Download SVG</strong> for a scalable vector, or <strong>Copy Image</strong> to paste directly.</li>
            </ol>
          </TabsContent>
          <TabsContent value="faq" className="mt-4 space-y-4 text-muted-foreground text-sm">
            <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
            <div><h3 className="text-sm font-semibold text-foreground">What is the maximum content length?</h3><p>QR codes can store up to approximately 4,296 alphanumeric characters. However, longer content produces denser QR codes that may be harder to scan. For best results, keep content under 500 characters.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Should I download PNG or SVG?</h3><p>Use <strong>SVG</strong> if you need to resize the QR code for print materials (flyers, posters, business cards) — it scales infinitely without losing quality. Use <strong>PNG</strong> for digital use (websites, social media, emails).</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Can I use custom colors?</h3><p>Yes. You can change both the foreground (dark modules) and background colors. Make sure there is sufficient contrast between the two colors for reliable scanning.</p></div>
            <div><h3 className="text-sm font-semibold text-foreground">Is my data safe?</h3><p>Absolutely. The QR code is generated entirely in your browser using JavaScript. No data is sent to any server. You can verify this by disconnecting from the internet — the tool will still work.</p></div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
