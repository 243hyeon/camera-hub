"use client";

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/components/AppProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';

type Message = {
    id: number;
    role: 'user' | 'ai';
    content: string;
};

export default function AIGuidePage() {
    const { lang, openAuthModal, user, savedAiChats, toggleAiScrap } = useAppContext();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null); // 검색된 제품의 모든 정보 저장
    const [isProductModalOpen, setIsProductModalOpen] = useState(false); // 팝업창 열림/닫힘 스위치
    const [productType, setProductType] = useState<'body' | 'lens' | 'not_found' | null>(null); // 바디인지 렌즈인지 구분

    // 언어 변경 시 초기 인사말 설정
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    role: 'ai',
                    content: lang === 'KR'
                        ? '안녕하세요! Camera Hub의 수석 큐레이터 AI입니다. 카메라 추천, 렌즈 스펙, 사진 촬영 기법 등 무엇이든 물어보세요! 📸'
                        : 'Hello! I am the Chief Curator AI of Camera Hub. Ask me anything about camera recommendations, lens specs, or photography techniques! 📸'
                }
            ]);
        }
    }, [lang, messages.length]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const suggestedQuestions = lang === 'KR' ? [
        "👶 손주 찍어줄 가볍고 빠른 카메라 추천해 줘",
        "🌸 배경이 예쁘게 흐려지는(아웃포커싱) 렌즈는 뭐야?",
        "✈️ 여행 갈 때 들고 가기 좋은 소니 렌즈 찾아줘",
        "🤔 미러리스와 DSLR의 차이점이 뭐야?"
    ] : [
        "👶 Recommend a light & fast camera for grandkids",
        "🌸 What lens is good for blurry backgrounds (bokeh)?",
        "✈️ Find me a good Sony lens for travel",
        "🤔 What's the difference between mirrorless and DSLR?"
    ];

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessageContent = text.trim();
        const newUserMsg: Message = { id: Date.now(), role: 'user', content: userMessageContent };

        setMessages((prev) => [...prev, newUserMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, newUserMsg],
                    lang: lang
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'AI 응답을 가져오는데 실패했습니다.');
            }

            const aiMsg: Message = {
                id: Date.now() + 1,
                role: 'ai',
                content: data.content || data.reply || 'No response content'
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (error: any) {
            console.error('Chat Error:', error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                role: 'ai',
                content: lang === 'KR'
                    ? '❌ 죄송합니다. AI 서비스 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
                    : '❌ Sorry, an error occurred while connecting to the AI service. Please try again later.'
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

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
        title: lang === 'KR' ? '스마트 AI 큐레이터' : 'Smart AI Curator',
        desc: lang === 'KR' ? '방대한 데이터베이스를 바탕으로 당신에게 딱 맞는 장비를 찾아드립니다.' : 'We find the perfect gear for you based on our massive database.',
        placeholder: lang === 'KR' ? '카메라, 렌즈, 사진에 대해 무엇이든 물어보세요...' : 'Ask anything about cameras, lenses, or photography...',
        send: lang === 'KR' ? '전송' : 'Send',
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl h-[calc(100vh-80px)] min-h-[700px] flex flex-col transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            <div className="mb-4 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    {t.title} <span className="text-blue-500">✨</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{t.desc}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {suggestedQuestions.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        disabled={isLoading}
                        className="text-xs md:text-sm bg-white dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm disabled:opacity-50"
                    >
                        {q}
                    </button>
                ))}
            </div>

            <div className="flex-grow bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg dark:shadow-none overflow-hidden flex flex-col">

                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-4 text-sm md:text-base leading-relaxed group relative ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-sm shadow-md whitespace-pre-wrap'
                                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700'
                                } shadow-sm`}>
                                {msg.role === 'user' ? (
                                    msg.content
                                ) : (
                                    <div className="space-y-4 break-keep markdown-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                strong: ({ node, ...props }) => <strong className="font-extrabold text-blue-600 dark:text-blue-400" {...props} />,
                                                table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="w-full text-left border-collapse min-w-full text-sm" {...props} /></div>,
                                                th: ({ node, ...props }) => <th className="border-b-2 border-gray-300 dark:border-gray-600 px-4 py-3 font-bold bg-gray-100 dark:bg-gray-700/50 whitespace-nowrap" {...props} />,
                                                td: ({ node, ...props }) => <td className="border-b border-gray-200 dark:border-gray-700/50 px-4 py-3" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                                                p: ({ node, ...props }) => <p className="m-0 leading-relaxed" {...props} />,
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
                                            {msg.content.replace(/\[\[COMPARE:(.*?)\]\]/g, '[$1](#compare:$1)')}
                                        </ReactMarkdown>
                                    </div>
                                )}

                                {/* 👇 여기에 AI 답변일 때만 나오는 [저장] 버튼을 추가합니다! 👇 */}
                                {msg.role === 'ai' && msg.id !== 1 && ( // (id가 1인 첫 인사말에는 저장 버튼을 띄우지 않습니다)
                                    (() => {
                                        const isSaved = savedAiChats.includes(msg.content);
                                        return (
                                            <div className="absolute -bottom-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    onClick={(e) => toggleAiScrap(msg.content, e)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md border transition-colors text-xs font-bold
                                                        ${isSaved
                                                            ? 'bg-yellow-400 text-white border-yellow-500 hover:bg-yellow-500' // 저장됨
                                                            : 'bg-white dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500' // 저장 안됨
                                                        }
                                                    `}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                                                    {isSaved ? (lang === 'KR' ? '저장됨' : 'Saved') : (lang === 'KR' ? '답변 저장' : 'Save')}
                                                </button>
                                            </div>
                                        );
                                    })()
                                )}
                                {/* 👆 추가 끝 👆 */}

                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-2 border border-gray-200 dark:border-gray-700">
                                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                        className="flex gap-3 relative"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t.placeholder}
                            className="flex-grow bg-white dark:bg-[#1c1c1c] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full pl-6 pr-24 py-4 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-full px-6 font-bold transition-colors shadow-md"
                        >
                            {t.send}
                        </button>
                    </form>
                </div>

            </div>

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
