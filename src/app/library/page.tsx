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

    // 페이지가 열릴 때, 브라우저 수첩에 적어둔 탭 이름이 있는지 확인
    useEffect(() => {
        const savedTab = sessionStorage.getItem('libraryCurrentTab') as 'news' | 'ai' | null;
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, []);

    const handleTabChange = (tabName: 'news' | 'ai') => {
        setActiveTab(tabName);
        sessionStorage.setItem('libraryCurrentTab', tabName);
    };

    const [copiedId, setCopiedId] = useState<string | number | null>(null);

    const handleCopy = async (text: string, id: string | number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다. 다시 시도해 주세요!');
        }
    };

    const [selectedProduct, setSelectedProduct] = useState<any>(null); // 검색된 제품의 모든 정보 저장
    const [isProductModalOpen, setIsProductModalOpen] = useState(false); // 팝업창 열림/닫힘 스위치
    const [productType, setProductType] = useState<'body' | 'lens' | 'not_found' | null>(null); // 바디인지 렌즈인지 구분

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
    // 🌟 AI가 추천한 제품의 정보를 가져와서 팝업창에 띄우는 함수
    const handleProductClick = async (productName: string) => {

        // 💡 핵심 1: AI가 'Canon-EOS-R10'처럼 주더라도 'Canon EOS R10'으로 찰떡같이 알아듣게 변환!
        const searchName = productName.replace(/-/g, ' ');

        // 1. 렌즈 테이블에서 모든 정보(*) 검색
        const { data: lensData } = await supabase
            .from('lenses')
            .select('*') // 👈 이제 id만 가져오는 게 아니라 전부 다 가져옵니다!
            .ilike('name', `%${searchName}%`)
            .limit(1)
            .maybeSingle(); // 💡 핵심 2: 에러 없이 깔끔하게 검색

        if (lensData) {
            setSelectedProduct(lensData);
            setProductType('lens');
            setIsProductModalOpen(true); // 👈 새 창 대신 팝업 스위치 ON!
            return;
        }

        // 2. 바디 테이블에서 모든 정보(*) 검색
        const { data: bodyData } = await supabase
            .from('bodies')
            .select('*')
            .ilike('name', `%${searchName}%`)
            .limit(1)
            .maybeSingle();

        if (bodyData) {
            setSelectedProduct(bodyData);
            setProductType('body');
            setIsProductModalOpen(true); // 👈 새 창 대신 팝업 스위치 ON!
            return;
        }

        // 3. 정말 우리 DB에 없는 제품일 경우 알림
        setSelectedProduct({ name: searchName });
        setProductType('not_found');
        setIsProductModalOpen(true);
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
                    onClick={() => handleTabChange('news')}
                    className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 ${activeTab === 'news'
                        ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                >
                    {t.tabNews} <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full ml-1 text-gray-600 dark:text-gray-300">{savedNews.length}</span>
                </button>
                <button
                    onClick={() => handleTabChange('ai')}
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
                                    <div key={chat.id} className="bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow relative group">
                                        {/* 🌟 상단 헤더 영역 (날짜와 복사 버튼을 양쪽으로 배치) */}
                                        <div className="flex items-start justify-between mb-4">
                                            {/* 왼쪽: 로봇 아이콘과 날짜 */}
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                                                <span className="text-sm">🤖</span>
                                                <time>
                                                    {new Date(chat.created_at).toLocaleDateString(lang === 'KR' ? 'ko-KR' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </time>
                                            </div>

                                            {/* 우측 상단 버튼 그룹 */}
                                            <div className="flex items-center gap-2">
                                                {/* 1. 복사 버튼 */}
                                                <button
                                                    onClick={() => handleCopy(chat.content, chat.id)}
                                                    className="p-2 z-10 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 opacity-100 lg:opacity-0 group-hover:opacity-100"
                                                    title={lang === 'KR' ? '답변 내용 복사하기' : 'Copy answer content'}
                                                    aria-label={lang === 'KR' ? '답변 내용 복사하기' : 'Copy answer content'}
                                                >
                                                    {copiedId === chat.id ? (
                                                        // ✅ 복사 성공 시 (초록색 V 체크 아이콘)
                                                        <svg className="w-5 h-5 text-green-500 scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    ) : (
                                                        // 📋 평상시 (범용적인 클립보드 아이콘)
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                                                        </svg>
                                                    )}
                                                </button>

                                                {/* 2. 북마크(삭제) 버튼 */}
                                                <button
                                                    onClick={(e) => toggleAiScrap(chat.content, e)}
                                                    className="p-2 rounded-xl bg-yellow-400 text-white hover:bg-red-500 transition-colors z-20 shadow-sm opacity-100 lg:opacity-0 group-hover:opacity-100"
                                                    title="Remove"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200 pl-1 break-keep">
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
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
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

            {/* 🌟 팝업창 (Modal) UI */}
            {isProductModalOpen && selectedProduct && (
                // 1. 어두운 배경 (여백 클릭 시 닫힘)
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in px-4"
                    onClick={() => setIsProductModalOpen(false)}
                >
                    {/* 2. 팝업창 본체 (클릭해도 안 닫히게 방어!) */}
                    <div
                        className="relative w-full max-w-3xl bg-white dark:bg-[#121212] rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 우측 상단 X 버튼 */}
                        <button
                            onClick={() => setIsProductModalOpen(false)}
                            className="absolute top-5 right-5 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* 👇 여기서부터 분기 처리! */}
                        {productType === 'not_found' ? (
                            // 🌟 데이터가 없을 때 보여줄 예쁜 에러 화면
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
                                    아직 등록되지 않은 장비입니다 😅
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                                    <strong className="text-blue-500">{selectedProduct?.name}</strong> 모델은 현재 데이터베이스에 없습니다.<br />
                                    빠른 시일 내에 스펙을 업데이트해 두겠습니다!
                                </p>
                                <button
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="mt-8 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    돌아가기
                                </button>
                            </div>
                        ) : (
                            // 🌟 기존 바디/렌즈 상세 정보 레이아웃
                            <div className="flex flex-col md:flex-row gap-8 mt-4">
                                {/* 왼쪽: 이미지 */}
                                <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-white rounded-2xl p-6">
                                    <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-auto max-h-64 object-contain" />
                                </div>

                                {/* 오른쪽: 스펙 텍스트 */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center">
                                    <span className="text-blue-600 dark:text-blue-500 font-extrabold text-xs uppercase tracking-widest mb-2">
                                        {selectedProduct.brand}
                                    </span>
                                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                                        {selectedProduct.name}
                                    </h2>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                                        {selectedProduct.price?.toLocaleString()} <span className="text-base font-medium text-gray-500">원</span>
                                    </p>

                                    {/* 🌟 상세 설명 영역 (상세 페이지와 동일하게 추가) */}
                                    {selectedProduct.description && (
                                        <div className="mb-6">
                                            <p className="text-xs text-gray-500 font-bold mb-1">상세 설명</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {selectedProduct.description}
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">주요 스펙</p>

                                    {/* 핵심 스펙 그리드 */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {productType === 'body' ? (
                                            <>
                                                {/* 1. 센서 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">센서</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.sensor}</span>
                                                </div>
                                                {/* 2. 화소수 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">화소수</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.pixels}</span>
                                                </div>
                                                {/* 3. 렌즈 마운트 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">렌즈 마운트</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.mount}</span>
                                                </div>
                                                {/* 4. 손떨림 보정 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">손떨림 보정</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.stabilization}</span>
                                                </div>
                                                {/* 5. 디스플레이 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">디스플레이</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.display}</span>
                                                </div>
                                                {/* 6. 연사 속도 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">연사 속도</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.fps}</span>
                                                </div>
                                                {/* 7. 동영상 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">동영상</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.video}</span>
                                                </div>
                                                {/* 8. 무게 */}
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">무게</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.weight}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">화각</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.angle}</span>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">종류</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.lens_type}</span>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">조리개</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.aperture}</span>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-500 font-bold block mb-1">필터 구경</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{selectedProduct.filter_size}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
