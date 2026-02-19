"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from './AppProvider';

export default function Navbar() {
    const { lang, toggleLang, theme, toggleTheme, openAuthModal } = useAppContext();
    const searchParams = useSearchParams();
    const [isAdminVisible, setIsAdminVisible] = useState(false);

    useEffect(() => {
        const isLocal = window.location.hostname === 'localhost';
        const hasAdminQuery = searchParams.get('admin') === 'true';
        setIsAdminVisible(isLocal || hasAdminQuery);
    }, [searchParams]);

    return (
        <nav className="border-b bg-white/80 border-gray-200 dark:bg-[#121212]/80 dark:border-gray-800 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">

                <Link href="/" className="text-xl font-black text-gray-900 dark:text-white tracking-tighter hover:text-blue-500 transition-colors">
                    CAMERA HUB
                </Link>

                <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600 dark:text-gray-300">
                    <Link href="/news" className="hover:text-blue-500 dark:hover:text-white transition-colors">{lang === 'KR' ? '뉴스' : 'News'}</Link>
                    <Link href="/bodies" className="hover:text-blue-500 dark:hover:text-white transition-colors">{lang === 'KR' ? '바디' : 'Bodies'}</Link>
                    <Link href="/lenses" className="hover:text-blue-500 dark:hover:text-white transition-colors">{lang === 'KR' ? '렌즈' : 'Lenses'}</Link>
                    <Link href="/lectures" className="hover:text-blue-500 dark:hover:text-white transition-colors">{lang === 'KR' ? '사진 강의' : 'Lectures'}</Link>
                    <Link href="/community" className="hover:text-blue-500 dark:hover:text-white transition-colors">{lang === 'KR' ? '커뮤니티' : 'Community'}</Link>
                    <Link href="/ai-guide" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">{lang === 'KR' ? 'AI 가이드' : 'AI Guide'}</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleLang} className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-extrabold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700">
                        <span className={lang === 'KR' ? 'text-blue-600 dark:text-blue-400' : ''}>KR</span>
                        <span className="mx-1 text-gray-400 dark:text-gray-600">|</span>
                        <span className={lang === 'EN' ? 'text-blue-600 dark:text-blue-400' : ''}>EN</span>
                    </button>

                    {isAdminVisible && (
                        <Link href="/admin" className="hidden sm:inline-flex text-[10px] font-black px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full border border-gray-300 dark:border-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                            ADMIN
                        </Link>
                    )}

                    {/* 로그인 버튼 추가! */}
                    <button
                        onClick={openAuthModal}
                        className="px-3 py-1.5 text-xs font-extrabold rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                    >
                        {lang === 'KR' ? '로그인' : 'Login'}
                    </button>

                    {/* 테마 변경 버튼 (해/달) */}
                    <button onClick={toggleTheme} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 text-sm">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>

            </div>
        </nav>
    );
}
