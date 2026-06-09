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
import axios from "axios";
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
  { id: "realistic", name: "واقعي", emoji: "📸" },
  { id: "anime", name: "أنمي", emoji: "🎌" },
  { id: "3d", name: "ثلاثي الأبعاد", emoji: "🎮" },
  { id: "painting", name: "رسم زيتي", emoji: "🎨" },
  { id: "cartoon", name: "كرتون", emoji: "🦸" },
  { id: "cyberpunk", name: "سايبر بانك", emoji: "🌃" },
];

const SIZES = [
  { id: "512x512", name: "مربع صغير", width: 512, height: 512 },
  { id: "1024x1024", name: "مربع كبير", width: 1024, height: 1024 },
  { id: "1024x768", name: "أفقي", width: 1024, height: 768 },
  { id: "768x1024", name: "عمودي", width: 768, height: 1024 },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-arena-backend-knyp.onrender.com";

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);

  const handleGenerate = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    
    if (!trimmedPrompt || trimmedPrompt.length < 3) {
      toast.error("الرجاء كتابة وصف الصورة (3 أحرف على الأقل)");
      return;
    }

    if (isGenerating) return;

    setIsGenerating(true);
    
    const loadingToast = toast.loading("🎨 جاري إنشاء الصورة...", {
      duration: Infinity,
    });

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/images/generate`,
        {
          prompt: trimmedPrompt,
          style: selectedStyle.id,
          width: selectedSize.width,
          height: selectedSize.height,
        },
        {
          timeout: 120000, // 2 minutes
        }
      );

      const data = response.data;

      if (!data.success || !data.url) {
        throw new Error(data.error || "فشل توليد الصورة");
      }

      const newImage: GeneratedImage = {
        id: `img_${Date.now()}`,
        prompt: trimmedPrompt,
        url: data.url,
        timestamp: Date.now(),
        style: selectedStyle.name,
        size: selectedSize.id,
        status: "success",
      };

      setCurrentImage(newImage);
      setHistory((prev) => [newImage, ...prev].slice(0, 20));
      
      toast.success("✨ تم إنشاء الصورة بنجاح!", { id: loadingToast });

    } catch (error: any) {
      console.error("Image generation error:", error);
      
      let errorMessage = "حدث خطأ، حاول مرة أخرى";
      
      if (error.code === "ECONNABORTED") {
        errorMessage = "⏱️ استغرق وقت طويل، جرب مرة أخرى";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage, { 
        id: loadingToast,
        duration: 4000 
      });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, selectedSize, isGenerating]);

  const handleDownload = useCallback(async (image: GeneratedImage) => {
    const downloadToast = toast.loading("جاري التحميل...");

    try {
      const response = await fetch(image.url);
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
      window.open(image.url, "_blank");
      toast.success("افتح الصورة واحفظها يدوياً", { id: downloadToast });
    }
  }, []);

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
              {prompt.length} / 500
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: قطة لطيفة تجلس على سطح القمر مع نجوم متلألئة"
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
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  } disabled:opacity-50`}
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
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  } disabled:opacity-50`}
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
            className="mt-6 w-full px-6 py-4 bg-newera-gradient rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </div>

        {/* Current Image */}
        {currentImage && currentImage.status === "success" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-bold">تمت بنجاح ✨</h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
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
              </div>
            </div>

            <div className="bg-gray-900">
              <img
                src={currentImage.url}
                alt={currentImage.prompt}
                className="w-full h-auto"
              />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-xs text-white line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <Download className="w-3 h-3" />
                      تحميل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentImage && !isGenerating && (
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
