import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonBar from "@/components/ComparisonBar";
import { AppProvider } from "@/components/AppProvider";
import AuthModal from "@/components/AuthModal"; // 👈 1. 팝업 컴포넌트 불러오기!

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Camera Hub | All-in-One Photo Info",
  description: "실제 AI가 추천하는 카메라 & 렌즈 정보 아카이브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      {/* 라이트모드는 밝은 배경(bg-gray-50), 다크모드는 어두운 배경(dark:bg-[#121212]) */}
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212] transition-colors duration-300`}>
        <AppProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <div className="flex-1">
            {children}
          </div>
          <ComparisonBar />
          <Footer />
          <AuthModal /> {/* 👈 2. Footer 바로 아래에 팝업을 장착! (평소엔 숨어있습니다) */}
        </AppProvider>
      </body>
    </html>
  );
}
