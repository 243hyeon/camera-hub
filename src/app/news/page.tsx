"use client";

import { useEffect, useState } from 'react';
import { useAppContext } from '@/components/AppProvider'; // 👈 중앙 통제실에서 언어 정보 가져오기

export default function NewsPage() {
    const { lang, openAuthModal, user } = useAppContext();
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // 우리가 방금 만든 '내부 API'에 12개 기사와 현재 언어(KR/EN)를 요청!
                const res = await fetch(`/api/news?limit=12&lang=${lang}`);
                const data = await res.json();
                setNewsItems(data.items);
            } catch (error) {
                console.error('뉴스 가져오기 실패:', error);
            }
            setLoading(false);
        };
        fetchNews();
    }, [lang]); // 언어(KR/EN)가 바뀔 때마다 뉴스를 다시 번역해서 가져옴

    // 다국어 번역 딕셔너리
    const t = {
        tag: 'Global Camera Insight',
        title: lang === 'KR' ? '글로벌 최신 뉴스' : 'Global Latest News',
        desc: lang === 'KR' ? 'PetaPixel 등 세계 최고의 카메라 매체에서 방금 올라온 소식들을 확인하세요.' : 'Check out the latest news from world-class camera media like PetaPixel.',
        aiStatus: lang === 'KR' ? '한국어 실시간 AI 번역 작동 중' : 'Live English Feed',
        loading: lang === 'KR' ? '해외 뉴스를 수신하고 번역 중입니다... 📡' : 'Fetching global news... 📡',
        originalBtn: lang === 'KR' ? '원문 보기 →' : 'Read Article →'
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-10 relative pb-32 animate-fade-in-up transition-colors duration-300">

            {/* 타이틀 영역 */}
            <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-blue-600 dark:text-blue-500 font-black tracking-[0.2em] uppercase text-sm mb-2 block">{t.tag}</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">{t.desc}</p>
                </div>

                {/* 번역 상태 표시기 */}
                <div className="flex items-center gap-3 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 px-5 py-3 rounded-full shadow-sm">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${lang === 'KR' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.aiStatus}</span>
                </div>
            </div>

            {/* 뉴스 리스트 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading || newsItems.length === 0 ? (
                    <div className="col-span-full text-center py-32 text-gray-500 bg-white dark:bg-[#1c1c1c] rounded-3xl border border-gray-200 dark:border-gray-800 text-lg shadow-sm">
                        {t.loading}
                    </div>
                ) : (
                    newsItems.map((news: any, index: number) => {
                        const pubDate = new Date(news.pubDate).toLocaleDateString(lang === 'KR' ? 'ko-KR' : 'en-US');

                        return (
                            <a key={index} href={news.link} target="_blank" rel="noreferrer" className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full hover:-translate-y-2 shadow-md hover:shadow-xl dark:shadow-none">
                                <div className="h-40 overflow-hidden relative bg-gray-100 dark:bg-gray-900">
                                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded z-10 border border-gray-700">PetaPixel</span>

                                    {/* 👇 추가된 스크랩 버튼! */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!user) {
                                                openAuthModal();
                                            } else {
                                                alert(lang === 'KR' ? '기사가 스크랩되었습니다! 🔖' : 'News saved! 🔖');
                                            }
                                        }}
                                        className="absolute top-3 right-3 bg-white/80 dark:bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 transition-colors z-20 shadow-sm"
                                        title={lang === 'KR' ? '뉴스 스크랩하기' : 'Save News'}
                                    >
                                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                                    </button>

                                    <img
                                        src={news.thumbnail || 'https://placehold.co/600x400/1f2937/ffffff.png?text=News'}
                                        alt="News"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-snug mb-3 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {news.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                                        {news.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                                        <span className="text-xs text-gray-500 font-medium">{pubDate}</span>
                                        <span className="text-xs text-blue-600 dark:text-blue-500 font-bold group-hover:translate-x-1 transition-transform">{t.originalBtn}</span>
                                    </div>
                                </div>
                            </a>
                        );
                    })
                )}
            </div>
        </div>
    );
}
