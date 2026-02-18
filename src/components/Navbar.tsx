"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Navbar() {
    const searchParams = useSearchParams();
    const [isAdminVisible, setIsAdminVisible] = useState(false);

    useEffect(() => {
        const isLocal = window.location.hostname === 'localhost';
        const hasAdminQuery = searchParams.get('admin') === 'true';
        setIsAdminVisible(isLocal || hasAdminQuery);
    }, [searchParams]);

    return (
        <nav className="border-b border-gray-800 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">

                {/* 🎯 로고 (클릭 시 홈으로 이동!) */}
                <Link href="/" className="text-xl font-black text-white tracking-tighter hover:text-blue-400 transition-colors">
                    CAMERA HUB
                </Link>

                {/* 🎯 메인 메뉴 ('홈' 삭제, '뉴스' 독립) */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-300">
                    <Link href="/news" className="hover:text-white transition-colors">뉴스</Link>
                    <Link href="/bodies" className="hover:text-white transition-colors">바디</Link>
                    <Link href="/lenses" className="hover:text-white transition-colors">렌즈</Link>
                    <Link href="/lectures" className="hover:text-white transition-colors">사진 강의</Link>
                    <Link href="/community" className="hover:text-white transition-colors">커뮤니티</Link>
                    <Link href="/ai-guide" className="hover:text-blue-400 transition-colors text-blue-500">AI 가이드</Link>
                </div>

                {/* 다크모드/프로필 아이콘 자리 및 Admin */}
                <div className="flex items-center gap-4">
                    {isAdminVisible && (
                        <Link href="/admin" className="hidden sm:inline-flex text-[10px] font-black px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full border border-gray-700 hover:text-white transition-colors">
                            ADMIN
                        </Link>
                    )}
                    <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400">
                        ☾
                    </button>
                </div>

            </div>
        </nav>
    );
}
