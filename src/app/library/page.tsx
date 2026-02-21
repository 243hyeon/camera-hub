"use client";

import { useEffect, useState } from 'react';
import { useAppContext } from '@/components/AppProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LibraryPage() {
    const { lang, user, isAuthModalOpen, openAuthModal, toggleScrap, toggleAiScrap, savedNewsLinks, savedAiChats } = useAppContext();
    const router = useRouter();
    const [savedNews, setSavedNews] = useState<any[]>([]);
    const [savedChats, setSavedChats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'news' | 'ai'>('news');

    // 로그인 검사
    useEffect(() => {
        if (user === null && !isAuthModalOpen) {
            const timeout = setTimeout(() => {
                if (!user) {
                    openAuthModal();
                    router.push('/');
                }
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [user, isAuthModalOpen, router, openAuthModal]);

    // 데이터 패치
    useEffect(() => {
        const fetchLibraryData = async () => {
            if (!user) return;
            setIsLoading(true);

            // Fetch saved news details
            const { data: newsData } = await supabase
                .from('saved_news')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (newsData) {
                setSavedNews(newsData);
            }

            // Fetch saved AI chats details
            const { data: chatsData } = await supabase
                .from('saved_ai_chats')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (chatsData) {
                setSavedChats(chatsData);
            }

            setIsLoading(false);
        };

        if (user) {
            fetchLibraryData();
        }
    }, [user, savedNewsLinks, savedAiChats]); // Re-fetch if global state changes

    // 🌟 AI가 추천한 제품의 이름을 DB에서 찾아 상세 페이지로 연결하는 함수
    const handleProductClick = async (productName: string) => {
        // 1. 렌즈 테이블에서 이름으로 검색 (대소문자 무시, 포함 여부 검색)
        const { data: lensData } = await supabase
            .from('lenses')
            .select('id')
            .ilike('name', `%${productName}%`)
            .single();

        if (lensData) {
            window.open(`/lenses/${lensData.id}`, '_blank'); // 👈 대화가 끊기지 않게 새 창으로 엽니다!
            return;
        }

        // 2. 렌즈가 아니면 바디 테이블에서 검색
        const { data: bodyData } = await supabase
            .from('bodies')
            .select('id')
            .ilike('name', `%${productName}%`)
            .single();

        if (bodyData) {
            window.open(`/bodies/${bodyData.id}`, '_blank');
            return;
        }

        // 3. 우리 DB에 없는 제품일 경우 알림
        alert(lang === 'KR' ? '아직 데이터베이스에 등록되지 않은 제품입니다. 😅' : 'Product not found in our database. 😅');
    };

    const t = {
        title: lang === 'KR' ? '내 서재' : 'My Library',
        desc: lang === 'KR' ? '스크랩한 뉴스와 AI 답변을 한 곳에서 모아보세요.' : 'Manage all your saved news and AI chats in one place.',
        tabNews: lang === 'KR' ? '뉴스 관리' : 'Saved News',
        tabAi: lang === 'KR' ? 'AI 답변 노트' : 'AI Notes',
        emptyNewsTitle: lang === 'KR' ? '아직 스크랩한 뉴스가 없습니다.' : 'No saved news yet.',
        emptyNewsDesc: lang === 'KR' ? '글로벌 뉴스 페이지에서 좋은 정보를 저장해보세요!' : 'Save useful articles from the global news page!',
        emptyAiTitle: lang === 'KR' ? '아직 저장된 AI 답변이 없습니다.' : 'No saved AI responses.',
        emptyAiDesc: lang === 'KR' ? 'AI 가이드에게 궁금한 것을 묻고 저장해보세요!' : 'Ask the AI guide and save important answers!',
        readMore: lang === 'KR' ? '원문 보기' : 'Read original',
        loading: lang === 'KR' ? '서재를 불러오는 중입니다...' : 'Loading library...'
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
                    <div className="text-gray-500 dark:text-gray-400 font-medium">Please login...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl mt-10 relative pb-32 animate-fade-in-up transition-colors duration-300">
            {/* 타이틀 영역 */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 flex items-center gap-3">
                        <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                        {t.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{t.desc}</p>
                </div>
            </div>

            {/* 탭 영역 */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-px">
                <button
                    onClick={() => setActiveTab('news')}
                    className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 ${activeTab === 'news'
                        ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                >
                    {t.tabNews} <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full ml-1 text-gray-600 dark:text-gray-300">{savedNews.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 ${activeTab === 'ai'
                        ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                >
                    {t.tabAi} <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full ml-1 text-gray-600 dark:text-gray-300">{savedChats.length}</span>
                </button>
            </div>

            {/* 내용 영역 */}
            {isLoading ? (
                <div className="py-20 text-center text-gray-500 animate-pulse font-medium">{t.loading}</div>
            ) : (
                <>
                    {/* 뉴스 탭 */}
                    {activeTab === 'news' && (
                        <div>
                            {savedNews.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 dark:bg-[#1c1c1c] rounded-3xl border border-gray-200 dark:border-gray-800">
                                    <div className="text-4xl mb-4 opacity-50">📰</div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.emptyNewsTitle}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{t.emptyNewsDesc}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedNews.map((news) => (
                                        <div key={news.id} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow relative">
                                            {/* 북마크 삭제 버튼 */}
                                            <button
                                                onClick={(e) => toggleScrap(news, e)}
                                                className="absolute top-3 right-3 p-2 rounded-full bg-yellow-400 text-white hover:bg-red-500 transition-colors z-20 shadow-sm"
                                                title="Remove"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                                </svg>
                                            </button>

                                            <div className="h-40 overflow-hidden relative bg-gray-100 dark:bg-gray-900">
                                                <img
                                                    src={news.thumbnail || 'https://placehold.co/600x400/1f2937/ffffff.png?text=News'}
                                                    alt="News"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-snug mb-3 line-clamp-2">
                                                    {news.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed flex-grow">
                                                    {news.description}
                                                </p>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span>{new Date(news.created_at).toLocaleDateString(lang === 'KR' ? 'ko-KR' : 'en-US')}</span>
                                                    <a href={news.link} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">{t.readMore} →</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI 탭 */}
                    {activeTab === 'ai' && (
                        <div className="space-y-6">
                            {savedChats.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 dark:bg-[#1c1c1c] rounded-3xl border border-gray-200 dark:border-gray-800">
                                    <div className="text-4xl mb-4 opacity-50">🤖</div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.emptyAiTitle}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{t.emptyAiDesc}</p>
                                </div>
                            ) : (
                                savedChats.map((chat) => (
                                    <div key={chat.id} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative group">
                                        <button
                                            onClick={(e) => toggleAiScrap(chat.content, e)}
                                            className="absolute top-4 right-4 p-2 rounded-full bg-yellow-400 text-white hover:bg-red-500 transition-colors z-20 shadow-sm opacity-0 group-hover:opacity-100"
                                            title="Remove"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                        </button>
                                        <div className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 p-1">🤖</span>
                                            {new Date(chat.created_at).toLocaleString(lang === 'KR' ? 'ko-KR' : 'en-US')}
                                        </div>
                                        <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed break-keep">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    strong: ({ node, ...props }) => <strong className="font-extrabold text-blue-600 dark:text-blue-400" {...props} />,
                                                    table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="w-full text-left border-collapse min-w-full text-sm" {...props} /></div>,
                                                    th: ({ node, ...props }) => <th className="border-b-2 border-gray-300 dark:border-gray-600 px-4 py-3 font-bold bg-gray-100 dark:bg-gray-700/50 whitespace-nowrap" {...props} />,
                                                    td: ({ node, ...props }) => <td className="border-b border-gray-200 dark:border-gray-700/50 px-4 py-3" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                                                    p: ({ node, ...props }) => <p className="m-0 mb-4" {...props} />,
                                                    // <a> 태그(링크)를 가로채서 우리가 원하는 버튼으로 커스텀합니다!
                                                    a: ({ node, href, children }) => {
                                                        // 우리가 만든 특수 링크(#compare:)인지 확인
                                                        if (href?.startsWith('#compare:')) {
                                                            const productName = decodeURIComponent(href.replace('#compare:', ''));
                                                            return (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleProductClick(productName);
                                                                    }}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-full text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors border border-blue-200 dark:border-blue-800 shadow-sm mx-1 my-1"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                                                    {children} 스펙 보기
                                                                </button>
                                                            );
                                                        }
                                                        // 일반 인터넷 링크는 원래대로 파란색 밑줄로 렌더링
                                                        return <a href={href} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{children}</a>;
                                                    }
                                                }}
                                            >
                                                {/* 👇 정규식을 이용해 [[COMPARE:이름]] 을 특수 마크다운 링크로 변환해서 렌더링! */}
                                                {chat.content.replace(/\[\[COMPARE:(.*?)\]\]/g, '[$1](#compare:$1)')}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
