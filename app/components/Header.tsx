"use client";

import Link from "next/link";
import { Sparkles, MessageCircle, Swords, Home } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-newera-orange group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-black">
              <span className="text-gradient">NewEra</span>
              <span className="text-white"> AI</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <NavLink href="/" icon={Home} label="الرئيسية" />
            <NavLink href="/chat" icon={MessageCircle} label="Chat" />
            <NavLink href="/battle" icon={Swords} label="Battle" />
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, icon: Icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
