"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ai-arena-backend-knyp.onrender.com";
      
      // FastAPI يستخدم form data للـ login
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        `${apiUrl}/api/v1/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, user } = response.data;
      
      login(access_token, user);
      toast.success(`أهلاً ${user.username}! 🎉`);
      
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.detail || "حدث خطأ، حاول مرة أخرى";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-newera-orange" />
              <h1 className="text-3xl font-black">
                <span className="text-gradient">NewEra</span>
                <span className="text-white"> AI</span>
              </h1>
            </div>
            <h2 className="text-2xl font-bold mb-2">مرحباً بعودتك! 👋</h2>
            <p className="text-gray-400">سجل دخولك للمتابعة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-newera-pink transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-newera-pink transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full px-6 py-3 bg-newera-gradient rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الدخول...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">أو</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400">
              ليس لديك حساب؟{" "}
              <Link
                href="/register"
                className="text-newera-pink font-bold hover:underline"
              >
                أنشئ حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
