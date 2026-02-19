"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/components/AppProvider';

export default function HomePage() {
  const { lang, openAuthModal } = useAppContext(); // 👈 openAuthModal 추가!
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 메인 화면도 '번역 API 통제소'를 이용하도록 수정!
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // PetaPixel 원본 대신 우리가 만든 번역 API로 3개만 요청!
        const res = await fetch(`/api/news?limit=3&lang=${lang}`);
        const data = await res.json();
        setNewsItems(data.items);
      } catch (error) {
        console.error('뉴스 연동 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [lang]); // KR/EN 언어 토글이 바뀔 때마다 다시 번역해 옵니다.

  // 🎯 다국어 번역 딕셔너리
  const t = {
    heroTag: 'Next-Gen Camera Archive',
    heroTitle1: lang === 'KR' ? '당신의 완벽한' : 'Find Your Perfect',
    heroTitle2: lang === 'KR' ? '카메라를 찾으세요' : 'Camera Gear',
    heroDesc: lang === 'KR'
      ? '최신 미러리스 바디부터 최상급 렌즈 성능까지, 전문가급 데이터베이스와 AI 가이드가 당신의 선택을 도와드립니다.'
      : 'From the latest mirrorless bodies to flagship lenses, our pro-level database and AI guide will help your choice.',
    btnBody: lang === 'KR' ? '카메라 둘러보기' : 'Browse Cameras',
    btnLens: lang === 'KR' ? '렌즈 대백과 보기' : 'Lens Encyclopedia',
    newsBadge: 'Latest Updates',
    newsTitle: lang === 'KR' ? '글로벌 최신 뉴스' : 'Global Camera News',
    newsAll: lang === 'KR' ? 'PetaPixel 전체보기' : 'View All PetaPixel',
    newsLoading: lang === 'KR' ? '최신 뉴스를 번역 중입니다... 📡' : 'Fetching latest news... 📡'
  };

  return (
    <div className="flex flex-col items-center relative overflow-hidden pb-32 transition-colors duration-300">

      {/* 🌟 상단: 히어로(메인 대문) 영역 */}
      <div className="min-h-[50vh] mt-10 flex flex-col items-center justify-center relative w-full pt-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-900/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="text-center z-10 px-4 mb-10 animate-fade-in-up">
          <h2 className="text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] text-xs md:text-sm mb-6 uppercase border border-gray-300 dark:border-gray-800 rounded-full px-4 py-1.5 inline-block bg-white dark:bg-[#1c1c1c] shadow-sm">
            {t.heroTag}
          </h2>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
            {t.heroTitle1} <br className="hidden md:block" />
            {t.heroTitle2}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium break-keep mb-10">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/bodies" className="px-8 py-3.5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black font-extrabold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg">
              {t.btnBody}
            </Link>
            <Link href="/lenses" className="px-8 py-3.5 rounded-full bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 font-extrabold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {t.btnLens}
            </Link>
          </div>
        </div>
      </div>

      {/* 📰 하단: 실시간 뉴스 영역 */}
      <div className="w-full max-w-7xl px-6 z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-end justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            <span className="text-yellow-600 dark:text-yellow-500 font-bold text-xs tracking-wider uppercase mb-1 block flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {t.newsBadge}
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.newsTitle}</h2>
          </div>
          <Link href="/news" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 font-medium">
            {t.newsAll} <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading || newsItems.length === 0 ? (
            <div className="col-span-3 text-center py-20 text-gray-500 bg-gray-50 dark:bg-[#1c1c1c] rounded-3xl border border-gray-200 dark:border-gray-800 font-medium animate-pulse">
              {t.newsLoading}
            </div>
          ) : (
            newsItems.map((news: any, index: number) => {
              const pubDate = new Date(news.pubDate).toLocaleDateString(lang === 'KR' ? 'ko-KR' : 'en-US');

              return (
                <a key={index} href={news.link} target="_blank" rel="noreferrer" className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 shadow-md hover:shadow-xl dark:shadow-none">
                  <div className="h-48 overflow-hidden relative bg-gray-100 dark:bg-gray-900">
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded z-10">PetaPixel</span>

                    {/* 👇 추가된 스크랩 버튼! (absolute로 우측 상단에 띄웁니다) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // 링크 이동 막기
                        e.stopPropagation(); // 부모 클릭 방지
                        openAuthModal(); // 로그인 팝업 띄우기!
                      }}
                      className="absolute top-3 right-3 bg-white/80 dark:bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 transition-colors z-20 shadow-sm"
                      title={lang === 'KR' ? '뉴스 스크랩하기' : 'Save News'}
                    >
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                    </button>

                    <img
                      src={news.thumbnail || 'https://placehold.co/600x400/1f2937/ffffff.png?text=Camera+News'}
                      alt="News"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {news.description}
                    </p>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                      {pubDate}
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
