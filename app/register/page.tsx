"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, UserPlus, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ai-arena-backend-knyp.onrender.com";
      
      await axios.post(`${apiUrl}/api/v1/auth/register`, formData);
      
      toast.success("تم إنشاء الحساب بنجاح! 🎉");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      const message = error.response?.data?.detail || "حدث خطأ، حاول مرة أخرى";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
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
            <h2 className="text-2xl font-bold mb-2">انضم إلينا! 🚀</h2>
            <p className="text-gray-400">أنشئ حسابك مجاناً</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="محمد أحمد"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-newera-pink transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  required
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-newera-pink transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="•••••••• (6 أحرف على الأقل)"
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-newera-pink transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-newera-gradient rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  إنشاء حساب
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/login"
                className="text-newera-pink font-bold hover:underline"
              >
                سجل دخولك
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
