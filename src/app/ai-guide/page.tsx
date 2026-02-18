"use client";

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/components/AppProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
    id: number;
    role: 'user' | 'ai';
    content: string;
};

export default function AIGuidePage() {
    const { lang } = useAppContext();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // 언어 변경 시 초기 인사말 설정
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: Date.now(),
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
                            <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-4 text-sm md:text-base leading-relaxed ${msg.role === 'user'
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
                                                p: ({ node, ...props }) => <p className="m-0 leading-relaxed" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
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
        </div>
    );
}
