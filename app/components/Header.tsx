"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, MessageCircle, Swords, Home, User, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <Sparkles className="w-6 h-6 text-newera-orange group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-black">
              <span className="text-gradient">NewEra</span>
              <span className="text-white"> AI</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 flex-1 justify-center">
            <NavLink href="/" icon={Home} label="الرئيسية" />
            <NavLink href="/chat" icon={MessageCircle} label="Chat" />
            <NavLink href="/battle" icon={Swords} label="Battle" />
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isLoading ? (
              <div className="w-20 h-10 bg-white/5 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-newera-gradient flex items-center justify-center font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold">{user.username}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">دخول</span>
                </Link>
                
                <Link
                  href="/register"
                  className="px-4 py-2 bg-newera-gradient rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, icon: Icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline text-sm">{label}</span>
    </Link>
  );
}
