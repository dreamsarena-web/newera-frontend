"use client";

import { useState } from "react";
import { Send, Loader2, Swords, Trophy, Zap } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Header from "../components/Header";

interface BattleResponse {
  model: string;
  provider: string;
  response?: string;
  error?: string;
  status: string;
}

interface BattleResult {
  id: string;
  prompt: string;
  responses: BattleResponse[];
  execution_time: number;
}

export default function BattlePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BattleResult | null>(null);

  const handleBattle = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ai-arena-backend-knyp.onrender.com";
      
      const response = await axios.post(`${apiUrl}/api/v1/battles/`, {
        prompt: prompt.trim(),
        category: "battle",
      });

      setResult(response.data);
      toast.success("🎉 اكتملت المعركة!");
    } catch (error: any) {
      toast.error("حدث خطأ، حاول مرة أخرى");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
            <Swords className="w-4 h-4 text-newera-orange" />
            <span className="text-sm text-orange-300">معركة AI حية</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="text-gradient">⚔️ Battle Arena</span>
          </h1>
          <p className="text-gray-400 text-lg">
            قارن بين Gemini و Mistral في معركة مباشرة
          </p>
        </div>

        {/* Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-bold text-gray-300 mb-3">
            اكتب سؤالك أو طلبك:
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: اشرح لي ما هو الذكاء الاصطناعي في 3 جمل بسيطة"
            disabled={isLoading}
            rows={4}
            className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-newera-pink transition-colors resize-none disabled:opacity-50"
          />

          <button
            onClick={handleBattle}
            disabled={isLoading || !prompt.trim()}
            className="mt-4 w-full px-6 py-4 bg-newera-gradient rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري المعركة...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                ابدأ المعركة!
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-newera-orange" />
                <span>{result.execution_time}s</span>
              </div>
            </div>

            {/* Responses Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {result.responses.map((response, index) => (
                <ResponseCard key={index} response={response} index={index} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ResponseCard({ response, index }: { response: BattleResponse; index: number }) {
  const isSuccess = response.status === "success";
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-orange-500 to-pink-500",
  ];

  return (
    <div className={`rounded-2xl border ${isSuccess ? "border-white/10" : "border-red-500/30"} bg-white/5 overflow-hidden`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors[index]} p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/80 mb-1">{response.provider}</div>
            <div className="font-bold text-white text-lg">{response.model}</div>
          </div>
          {isSuccess ? (
            <Trophy className="w-6 h-6 text-white" />
          ) : (
            <div className="text-red-200 text-sm">❌ فشل</div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isSuccess ? (
          <div className="prose prose-invert max-w-none text-sm">
            <ReactMarkdown>{response.response || ""}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-red-400 text-sm">
            <p className="font-bold mb-2">حدث خطأ:</p>
            <p className="text-xs opacity-70">{response.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
