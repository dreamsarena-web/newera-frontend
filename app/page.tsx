"use client";

import Link from "next/link";
import { MessageCircle, Swords, Code, Image, Smartphone, Video, Sparkles, Zap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: MessageCircle,
      title: "Chat",
      description: "محادثة ذكية مع أقوى نماذج AI",
      href: "/chat",
      available: true,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Swords,
      title: "Battle",
      description: "قارن بين نماذج AI في معارك حية",
      href: "/battle",
      available: true,
      color: "from-orange-500 to-pink-500",
    },
    {
      icon: Code,
      title: "Code Lab",
      description: "توليد أكواد احترافية بأي لغة",
      href: "/code",
      available: false,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Image,
      title: "Image Studio",
      description: "إنشاء صور إبداعية بالذكاء الاصطناعي",
      href: "/image",
      available: false,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Smartphone,
      title: "App Builder",
      description: "بناء تطبيقات كاملة بضغطة زر",
      href: "/apps",
      available: false,
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Video,
      title: "Video Studio",
      description: "توليد فيديوهات بالذكاء الاصطناعي",
      href: "/video",
      available: false,
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10" />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-newera-orange" />
            <span className="text-sm text-gray-300">عصر جديد للذكاء الاصطناعي</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="text-gradient">NewEra</span>
            <span className="text-white"> AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            منصة شاملة تجمع أقوى نماذج الذكاء الاصطناعي في مكان واحد
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/chat"
              className="group px-8 py-4 bg-newera-gradient rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              ابدأ الآن
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-all duration-300"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">اكتشف</span> ما يمكنك فعله
          </h2>
          <p className="text-gray-400 text-lg">
            6 أدوات قوية في منصة واحدة
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 NewEra AI - The New Era of AI</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description, href, available, color }: any) {
  const Card = (
    <div className={`group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 ${available ? 'hover:scale-105 cursor-pointer' : 'opacity-60'}`}>
      {!available && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
          قريباً
        </div>
      )}
      
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>

      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>

      {available && (
        <div className="mt-4 flex items-center gap-2 text-newera-pink font-bold">
          <span>جرب الآن</span>
          <span className="group-hover:translate-x-1 transition-transform">←</span>
        </div>
      )}
    </div>
  );

  return available ? <Link href={href}>{Card}</Link> : Card;
}
