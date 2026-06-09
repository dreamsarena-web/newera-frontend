"use client";

import { useState } from "react";
import { Wand2, Loader2, Download, Sparkles, Image as ImageIcon, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  timestamp: number;
}

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [style, setStyle] = useState("realistic");
  const [size, setSize] = useState("1024x1024");
  const [imageLoading, setImageLoading] = useState(false);

  const styles = [
    { id: "realistic", name: "واقعي", emoji: "📸" },
    { id: "anime", name: "أنمي", emoji: "🎌" },
    { id: "3d", name: "ثلاثي الأبعاد", emoji: "🎮" },
    { id: "painting", name: "رسم زيتي", emoji: "🎨" },
    { id: "cartoon", name: "كرتون", emoji: "🦸" },
    { id: "cyberpunk", name: "سايبر بانك", emoji: "🌃" },
  ];

  const sizes = [
    { id: "512x512", name: "مربع صغير" },
    { id: "1024x1024", name: "مربع كبير" },
    { id: "1024x768", name: "أفقي" },
    { id: "768x1024", name: "عمودي" },
  ];

  const buildPrompt = () => {
    const stylePrompts: Record<string, string> = {
      realistic: "ultra realistic, 4k, photography, detailed",
      anime: "anime style, manga, vibrant colors",
      "3d": "3d render, octane render, cinematic",
      painting: "oil painting, classical art, detailed brushstrokes",
      cartoon: "cartoon style, disney pixar style",
      cyberpunk: "cyberpunk, neon lights, futuristic, dark",
    };

    return `${prompt}, ${stylePrompts[style]}`;
  };

  const handleGenerate = () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setImageLoading(true);

    try {
      const fullPrompt = buildPrompt();
      const [width, height] = size.split("x");
      const seed = Math.floor(Math.random() * 1000000);
      
      // Pollinations AI URL
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        fullPrompt
      )}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`;

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt,
        url: imageUrl,
        timestamp: Date.now(),
      };

      setCurrentImage(newImage);
      setHistory((prev) => [newImage, ...prev].slice(0, 12));
      
      toast.success("🎨 جاري إنشاء الصورة...");
    } catch (error) {
      toast.error("حدث خطأ، حاول مرة أخرى");
      console.error(error);
      setIsLoading(false);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoading(false);
    toast.success("✨ تم إنشاء الصورة!");
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageLoading(false);
    toast.error("فشل تحميل الصورة، حاول مرة أخرى");
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      toast.loading("جاري التحميل...", { id: "download" });
      
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newera-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("📥 تم تحميل الصورة!", { id: "download" });
    } catch (error) {
      toast.error("فشل التحميل", { id: "download" });
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">مجاني تماماً ✨</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="text-gradient">🎨 Image Studio</span>
          </h1>
          <p className="text-gray-400 text-lg">
            حوّل أفكارك إلى صور إبداعية بضغطة زر
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-bold text-gray-300 mb-3">
            صف الصورة اللي تريدها:
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: قطة لطيفة تجلس على سطح القمر مع نجوم متلألئة"
            disabled={isLoading}
            rows={3}
            className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-newera-pink transition-colors resize-none disabled:opacity-50 text-lg"
          />

          {/* Styles */}
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              الستايل:
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  disabled={isLoading}
                  className={`p-3 rounded-xl border transition-all ${
                    style === s.id
                      ? "bg-newera-gradient border-transparent text-white"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-xs font-bold">{s.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              الحجم:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  disabled={isLoading}
                  className={`p-3 rounded-xl border transition-all text-sm ${
                    size === s.id
                      ? "bg-newera-gradient border-transparent text-white font-bold"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  {s.name}
                  <div className="text-xs opacity-70">{s.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="mt-6 w-full px-6 py-4 bg-newera-gradient rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري الإنشاء... (15-30 ثانية)
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                إنشاء الصورة
              </>
            )}
          </button>
        </div>

        {/* Current Image */}
        {currentImage && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">آخر صورة 🎨</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة توليد
                </button>
                <button
                  onClick={() => handleDownload(currentImage)}
                  className="px-4 py-2 bg-newera-gradient rounded-lg font-bold flex items-center gap-2 text-sm hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  تحميل
                </button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[400px] flex items-center justify-center">
              {imageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-10">
                  <Loader2 className="w-12 h-12 animate-spin text-newera-pink mb-3" />
                  <p className="text-gray-400">جاري إنشاء الصورة...</p>
                  <p className="text-xs text-gray-500 mt-1">قد يستغرق 30 ثانية</p>
                </div>
              )}
              
              <img
                src={currentImage.url}
                alt={currentImage.prompt}
                className="w-full h-auto"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>

            <p className="mt-4 text-gray-400 text-sm">
              <span className="font-bold">الوصف:</span> {currentImage.prompt}
            </p>
          </div>
        )}

        {/* History Gallery */}
        {history.length > 1 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              معرض الصور ({history.length})
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.slice(1).map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setCurrentImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover aspect-square"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-xs text-white line-clamp-2">
                      {image.prompt}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                    className="absolute top-2 left-2 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentImage && !isLoading && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-newera-gradient rounded-full mb-4 opacity-50">
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              لا توجد صور بعد
            </h3>
            <p className="text-gray-500">
              اكتب وصف الصورة اللي تريدها واضغط "إنشاء"
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
