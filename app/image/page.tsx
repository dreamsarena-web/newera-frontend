"use client";

import { useState, useCallback } from "react";
import { 
  Wand2, 
  Loader2, 
  Download, 
  Sparkles, 
  Image as ImageIcon, 
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  timestamp: number;
  style: string;
  size: string;
  status: "loading" | "success" | "error";
}

const STYLES = [
  { id: "realistic", name: "واقعي", emoji: "📸", prompt: "ultra realistic, 8k uhd, professional photography, highly detailed, sharp focus" },
  { id: "anime", name: "أنمي", emoji: "🎌", prompt: "anime style, manga art, vibrant colors, studio ghibli inspired" },
  { id: "3d", name: "ثلاثي الأبعاد", emoji: "🎮", prompt: "3d render, octane render, cinematic lighting, unreal engine 5" },
  { id: "painting", name: "رسم زيتي", emoji: "🎨", prompt: "oil painting, classical art style, detailed brushstrokes, masterpiece" },
  { id: "cartoon", name: "كرتون", emoji: "🦸", prompt: "cartoon style, disney pixar animation, colorful, family friendly" },
  { id: "cyberpunk", name: "سايبر بانك", emoji: "🌃", prompt: "cyberpunk style, neon lights, futuristic city, blade runner aesthetic" },
];

const SIZES = [
  { id: "512x512", name: "مربع صغير", width: 512, height: 512 },
  { id: "1024x1024", name: "مربع كبير", width: 1024, height: 1024 },
  { id: "1024x768", name: "أفقي", width: 1024, height: 768 },
  { id: "768x1024", name: "عمودي", width: 768, height: 1024 },
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);

  const buildEnhancedPrompt = useCallback((userPrompt: string, style: typeof STYLES[0]) => {
    const cleanPrompt = userPrompt.trim();
    return `${cleanPrompt}, ${style.prompt}, high quality, masterpiece`;
  }, []);

  const generateImageUrl = useCallback((
    enhancedPrompt: string, 
    width: number, 
    height: number,
    seed: number
  ) => {
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString(),
      nologo: "true",
      enhance: "true",
      model: "flux",
    });
    
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
  }, []);

  const handleGenerate = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    
    if (!trimmedPrompt) {
      toast.error("الرجاء كتابة وصف الصورة");
      return;
    }

    if (trimmedPrompt.length < 3) {
      toast.error("الوصف قصير جداً، اكتب وصف أوضح");
      return;
    }

    if (isGenerating) return;

    setIsGenerating(true);
    
    const loadingToast = toast.loading("🎨 جاري إنشاء الصورة...", {
      duration: Infinity,
    });

    try {
      const enhancedPrompt = buildEnhancedPrompt(trimmedPrompt, selectedStyle);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = generateImageUrl(
        enhancedPrompt, 
        selectedSize.width, 
        selectedSize.height,
        seed
      );

      const newImage: GeneratedImage = {
        id: `img_${Date.now()}_${seed}`,
        prompt: trimmedPrompt,
        url: imageUrl,
        timestamp: Date.now(),
        style: selectedStyle.name,
        size: selectedSize.id,
        status: "loading",
      };

      setCurrentImage(newImage);

      // Preload the image with timeout
      const img = new window.Image();
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("timeout"));
        }, 60000); // 60 seconds timeout

        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("load_error"));
        };

        img.src = imageUrl;
      });

      await loadPromise;

      // Success
      const successImage = { ...newImage, status: "success" as const };
      setCurrentImage(successImage);
      setHistory((prev) => [successImage, ...prev].slice(0, 20));
      
      toast.success("✨ تم إنشاء الصورة بنجاح!", { id: loadingToast });

    } catch (error: any) {
      console.error("Image generation error:", error);
      
      if (error.message === "timeout") {
        toast.error("⏱️ استغرق وقت طويل، جرب مرة أخرى", { 
          id: loadingToast,
          duration: 4000 
        });
      } else {
        toast.error("❌ فشل توليد الصورة، جرب وصف آخر", { 
          id: loadingToast,
          duration: 4000 
        });
      }

      if (currentImage) {
        setCurrentImage({ ...currentImage, status: "error" });
      }
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, selectedSize, isGenerating, buildEnhancedPrompt, generateImageUrl, currentImage]);

  const handleDownload = useCallback(async (image: GeneratedImage) => {
    const downloadToast = toast.loading("جاري التحميل...");

    try {
      const response = await fetch(image.url, {
        mode: "cors",
      });
      
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `newera-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast.success("📥 تم التحميل!", { id: downloadToast });
    } catch (error) {
      // Fallback: open in new tab
      window.open(image.url, "_blank");
      toast.success("افتح الصورة واحفظها يدوياً", { id: downloadToast });
    }
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  }, [handleGenerate]);

  const isReady = prompt.trim().length >= 3 && !isGenerating;

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
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-bold text-gray-300">
              صف الصورة اللي تريدها:
            </label>
            <span className="text-xs text-gray-500">
              {prompt.length} حرف
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="مثال: قطة لطيفة تجلس على سطح القمر مع نجوم متلألئة في السماء"
            disabled={isGenerating}
            rows={3}
            maxLength={500}
            className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-newera-pink transition-colors resize-none disabled:opacity-50 text-lg"
          />

          {/* Styles */}
          <div className="mt-5">
            <label className="block text-sm font-bold text-gray-300 mb-3">
              اختر الستايل:
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  disabled={isGenerating}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedStyle.id === style.id
                      ? "bg-newera-gradient border-transparent text-white scale-105"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-2xl mb-1">{style.emoji}</div>
                  <div className="text-xs font-bold">{style.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-5">
            <label className="block text-sm font-bold text-gray-300 mb-3">
              اختر الحجم:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  disabled={isGenerating}
                  className={`p-3 rounded-xl border transition-all text-sm ${
                    selectedSize.id === size.id
                      ? "bg-newera-gradient border-transparent text-white font-bold scale-105"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div>{size.name}</div>
                  <div className="text-xs opacity-70 mt-1">{size.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!isReady}
            className="mt-6 w-full px-6 py-4 bg-newera-gradient rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-100 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                إنشاء الصورة
              </>
            )}
          </button>

          {!isGenerating && prompt.length > 0 && prompt.length < 3 && (
            <p className="mt-3 text-sm text-yellow-400 text-center">
              ⚠️ اكتب وصف أطول (3 أحرف على الأقل)
            </p>
          )}
        </div>

        {/* Current Image */}
        {currentImage && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {currentImage.status === "success" && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                  {currentImage.status === "loading" && (
                    <Loader2 className="w-5 h-5 animate-spin text-newera-pink" />
                  )}
                  {currentImage.status === "error" && (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <h2 className="text-xl font-bold">
                    {currentImage.status === "success" && "تمت بنجاح ✨"}
                    {currentImage.status === "loading" && "جاري الإنشاء..."}
                    {currentImage.status === "error" && "فشل التحميل"}
                  </h2>
                </div>

                {currentImage.status === "success" && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      توليد جديد
                    </button>
                    <button
                      onClick={() => handleDownload(currentImage)}
                      className="px-4 py-2 bg-newera-gradient rounded-lg font-bold flex items-center gap-2 text-sm hover:scale-105 transition-transform"
                    >
                      <Download className="w-4 h-4" />
                      تحميل
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative bg-gray-900 min-h-[400px] flex items-center justify-center">
              {currentImage.status === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900/95">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-newera-gradient animate-pulse opacity-50" />
                    <Loader2 className="w-12 h-12 animate-spin text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-gray-300 font-bold mt-4">جاري إنشاء الصورة...</p>
                  <p className="text-xs text-gray-500 mt-1">قد يستغرق 15-60 ثانية</p>
                </div>
              )}

              {currentImage.status === "error" && (
                <div className="text-center p-8">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">فشل تحميل الصورة</p>
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-3 bg-newera-gradient rounded-lg font-bold"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}

              {currentImage.status !== "error" && (
                <img
                  src={currentImage.url}
                  alt={currentImage.prompt}
                  className="w-full h-auto"
                  style={{ display: currentImage.status === "success" ? "block" : "none" }}
                />
              )}
            </div>

            <div className="p-6 space-y-2">
              <p className="text-gray-400 text-sm">
                <span className="font-bold text-gray-300">الوصف:</span> {currentImage.prompt}
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>🎨 {currentImage.style}</span>
                <span>📐 {currentImage.size}</span>
              </div>
            </div>
          </div>
        )}

        {/* History Gallery */}
        {history.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              معرض الصور ({history.length})
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer hover:scale-105 transition-transform aspect-square"
                  onClick={() => setCurrentImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-xs text-white line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                        className="flex-1 p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-1 text-xs"
                      >
                        <Download className="w-3 h-3" />
                        تحميل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentImage && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-newera-gradient rounded-full mb-4 opacity-30">
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              ابدأ بإنشاء صورتك الأولى
            </h3>
            <p className="text-gray-500">
              اكتب وصف واختر ستايل وحجم، ثم اضغط إنشاء
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
