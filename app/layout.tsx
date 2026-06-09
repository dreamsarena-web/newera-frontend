import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "NewEra AI - The New Era of AI",
  description: "Chat, Battle, Code, Create with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-950 text-white">
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
