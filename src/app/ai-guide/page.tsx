"use client";

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/components/AppProvider';

type Message = {
    id: number;
    role: 'user' | 'ai';
    content: string;
};

export default function AIGuidePage() {
    const { lang } = useAppContext();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'ai',
            content: lang === 'KR'
                ? '안녕하세요! Camera Hub의 수석 큐레이터 AI입니다. 카메라 추천, 렌즈 스펙, 사진 촬영 기법 등 무엇이든 물어보세요! 📸'
                : 'Hello! I am the Chief Curator AI of Camera Hub. Ask me anything about camera recommendations, lens specs, or photography techniques! 📸'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 채팅이 추가될 때마다 자동으로 맨 아래로 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 🎯 시니어/입문자를 위한 '추천 질문' 리스트
    const suggestedQuestions = lang === 'KR' ? [
        "👶 손주 찍어줄 가볍고 빠른 카메라 추천해 줘",
        "🌸 배경이 예쁘게 흐려지는(아웃포커싱) 렌즈는 뭐야?",
        "✈️ 여행 갈 때 들고 가기 좋은 소니 렌즈 찾아줘",
        "🤔 미러리스와 DSLR의 차이점이 뭐야?"
    ] : [
        "👶 Recommend a light & fast camera for taking photos of my grandkids",
        "🌸 What lens is good for blurry backgrounds (bokeh)?",
        "✈️ Find me a good Sony lens for travel",
        "🤔 What's the difference between mirrorless and DSLR?"
    ];

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // 1. 유저 메시지 화면에 추가
        const newUserMsg: Message = { id: Date.now(), role: 'user', content: text };
        setMessages((prev) => [...prev, newUserMsg]);
        setInput('');
        setIsLoading(true);

        // 2. 가짜 지연 시간 (실제 AI가 생각하는 것처럼 연출)
        setTimeout(() => {
            let aiResponse = '';

            // 🎯 [정체성 지키기 로직] 카메라 관련 키워드가 있는지 검사합니다.
            const cameraKeywords = ['카메라', '렌즈', '소니', '캐논', '니콘', '사진', '화소', '조리개', '미러리스', 'dslr', '추천', '찍', '초점', 'camera', 'lens', 'sony', 'canon', 'nikon', 'photo'];
            const isRelevant = cameraKeywords.some(keyword => text.toLowerCase().includes(keyword));

            if (isRelevant) {
                aiResponse = lang === 'KR'
                    ? `[AI 가이드 모의 응답] 카메라/사진에 대한 아주 좋은 질문입니다! "${text}"에 대한 전문적인 장비 추천과 스펙 비교를 곧 Gemini API를 통해 제공할 예정입니다. 🚀`
                    : `[AI Guide Mock Response] Great question about cameras/photography! Professional gear recommendations for "${text}" will soon be provided via Gemini API. 🚀`;
            } else {
                // 카메라와 무관한 질문일 경우 철벽 방어! (가드레일)
                aiResponse = lang === 'KR'
                    ? `🙏 죄송합니다. 저는 Camera Hub의 사진 및 카메라 장비 전문 가이드입니다. 날씨, 요리, 일상 등 사진과 무관한 질문에는 답변해 드릴 수 없습니다. 카메라나 렌즈에 대해 궁금한 점을 물어봐 주시면 최선을 다해 도와드리겠습니다!`
                    : `🙏 I apologize. I am a specialized guide for photography and camera gear at Camera Hub. I cannot answer questions unrelated to photography. Please ask me anything about cameras or lenses, and I'll do my best to help!`;
            }

            setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', content: aiResponse }]);
            setIsLoading(false);
        }, 1000); // 1초 대기
    };

    const t = {
        title: lang === 'KR' ? '스마트 AI 큐레이터' : 'Smart AI Curator',
        desc: lang === 'KR' ? '방대한 데이터베이스를 바탕으로 당신에게 딱 맞는 장비를 찾아드립니다.' : 'We find the perfect gear for you based on our massive database.',
        placeholder: lang === 'KR' ? '카메라, 렌즈, 사진에 대해 무엇이든 물어보세요...' : 'Ask anything about cameras, lenses, or photography...',
        send: lang === 'KR' ? '전송' : 'Send',
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl mt-10 h-[80vh] flex flex-col transition-colors duration-300">

            {/* 헤더 영역 */}
            <div className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    {t.title} <span className="text-blue-500">✨</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{t.desc}</p>
            </div>

            {/* 추천 질문 버튼 영역 */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {suggestedQuestions.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-xs md:text-sm bg-white dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* 채팅 창 영역 */}
            <div className="flex-grow bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg dark:shadow-none overflow-hidden flex flex-col">

                {/* 대화 내역 */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-4 text-sm md:text-base leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-2 border border-gray-200 dark:border-gray-700">
                                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 입력 창 영역 */}
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
        </div>
    );
}
