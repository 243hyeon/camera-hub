"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Navbar() {
    const searchParams = useSearchParams();
    const [isAdminVisible, setIsAdminVisible] = useState(false);
    // 🎯 글로벌 언어 설정 상태 (기본값: KR)
    const [lang, setLang] = useState('KR');

    useEffect(() => {
        const isLocal = window.location.hostname === 'localhost';
        const hasAdminQuery = searchParams.get('admin') === 'true';
        setIsAdminVisible(isLocal || hasAdminQuery);
    }, [searchParams]);

    const toggleLang = () => {
        setLang(lang === 'KR' ? 'EN' : 'KR');
        // 💡 실제 구현 시에는 이 부분에서 전역 상태나 next-intl 같은 번역 라이브러리를 호출하게 됩니다.
    };

    return (
        <nav className="border-b border-gray-800 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">

                {/* 🎯 로고 (클릭 시 홈으로 이동!) */}
                <Link href="/" className="text-xl font-black text-white tracking-tighter hover:text-blue-400 transition-colors">
                    CAMERA HUB
                </Link>

                {/* 🎯 메인 메뉴 ('홈' 삭제, '뉴스' 독립) */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-300">
                    <Link href="/news" className="hover:text-white transition-colors">{lang === 'KR' ? '뉴스' : 'News'}</Link>
                    <Link href="/bodies" className="hover:text-white transition-colors">{lang === 'KR' ? '바디' : 'Bodies'}</Link>
                    <Link href="/lenses" className="hover:text-white transition-colors">{lang === 'KR' ? '렌즈' : 'Lenses'}</Link>
                    <Link href="/lectures" className="hover:text-white transition-colors">{lang === 'KR' ? '사진 강의' : 'Lectures'}</Link>
                    <Link href="/community" className="hover:text-white transition-colors">{lang === 'KR' ? '커뮤니티' : 'Community'}</Link>
                    <Link href="/ai-guide" className="hover:text-blue-400 transition-colors text-blue-500">{lang === 'KR' ? 'AI 가이드' : 'AI Guide'}</Link>
                </div>

                {/* 우측 아이콘 & 언어 토글 영역 */}
                <div className="flex items-center gap-4">
                    {/* 👇 대망의 KR/EN 언어 토글 버튼 👇 */}
                    <button
                        onClick={toggleLang}
                        className="flex items-center bg-gray-800 text-gray-300 rounded-full px-3 py-1 text-xs font-extrabold hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
                    >
                        <span className={lang === 'KR' ? 'text-blue-400' : ''}>KR</span>
                        <span className="mx-1 text-gray-600">|</span>
                        <span className={lang === 'EN' ? 'text-blue-400' : ''}>EN</span>
                    </button>

                    {isAdminVisible && (
                        <Link href="/admin" className="hidden sm:inline-flex text-[10px] font-black px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full border border-gray-700 hover:text-white transition-colors">
                            ADMIN
                        </Link>
                    )}

                    {/* 다크모드/프로필 아이콘 자리 */}
                    <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400">
                        ☾
                    </button>
                </div>

            </div>
        </nav>
    );
}
