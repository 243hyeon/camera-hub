import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonBar from "@/components/ComparisonBar";
import { AppProvider } from "@/components/AppProvider";

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
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212] transition-colors duration-300`}>
        <AppProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <div className="flex-1">
            {children}
          </div>
          <ComparisonBar />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
