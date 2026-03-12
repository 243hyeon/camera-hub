"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type AppContextType = {
    lang: string;
    toggleLang: () => void;
    theme: string;
    toggleTheme: () => void;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    user: any;
    // 👇 스크랩 기능을 전역으로 추가!
    savedNewsLinks: string[];
    toggleScrap: (news: any, e: React.MouseEvent) => void;
    // 👇 AI 답변 스크랩 기능 추가!
    savedAiChats: string[];
    toggleAiScrap: (content: string, e: React.MouseEvent) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState('KR');
    const [theme, setTheme] = useState('dark');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    // 👇 스크랩 목록을 중앙에서 관리합니다.
    const [savedNewsLinks, setSavedNewsLinks] = useState<string[]>([]);
    const [savedAiChats, setSavedAiChats] = useState<string[]>([]); // AI 답변 스크랩 목록

    useEffect(() => {
        setIsMounted(true);
        const root = window.document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
    }, [theme]);

    // 유저 로그인 상태 추적
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) setIsAuthModalOpen(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 🌟 유저가 바뀌면 창고에서 스크랩 목록을 '중앙'으로 가져옵니다!
    useEffect(() => {
        const fetchSavedData = async () => {
            if (!user) {
                setSavedNewsLinks([]);
                setSavedAiChats([]);
                return;
            }
            // 뉴스 스크랩 가져오기
            const { data: newsData } = await supabase.from('saved_news').select('link').eq('user_id', user.id);
            if (newsData) {
                setSavedNewsLinks(newsData.map((item) => item.link));
            }

            // AI 답변 스크랩 가져오기
            const { data: aiData } = await supabase.from('saved_ai_chats').select('content').eq('user_id', user.id);
            if (aiData) {
                setSavedAiChats(aiData.map((item) => item.content));
            }
        };
        fetchSavedData();
    }, [user]);

    // 🌟 스크랩 함수도 중앙 통제실에서 쏴줍니다!
    const toggleScrap = async (news: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        const isSaved = savedNewsLinks.includes(news.link);

        if (isSaved) {
            const { error } = await supabase.from('saved_news').delete().eq('user_id', user.id).eq('link', news.link);
            if (!error) setSavedNewsLinks((prev) => prev.filter((link) => link !== news.link));
        } else {
            const { error } = await supabase.from('saved_news').insert({
                user_id: user.id,
                title: news.title,
                link: news.link,
                thumbnail: news.thumbnail,
                description: news.description
            });
            if (!error) setSavedNewsLinks((prev) => [...prev, news.link]);
        }
    };

    // 🌟 AI 답변 스크랩 함수
    const toggleAiScrap = async (content: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        const isSaved = savedAiChats.includes(content);

        if (isSaved) {
            const { error } = await supabase.from('saved_ai_chats').delete().eq('user_id', user.id).eq('content', content);
            if (!error) setSavedAiChats((prev) => prev.filter((c) => c !== content));
        } else {
            const { error } = await supabase.from('saved_ai_chats').insert({
                user_id: user.id,
                content: content
            });
            if (!error) setSavedAiChats((prev) => [...prev, content]);
        }
    };

    const toggleLang = () => setLang((prev) => (prev === 'KR' ? 'EN' : 'KR'));
    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        // 하위 컴포넌트들이 savedNewsLinks와 toggleScrap을 쓸 수 있게 내려줍니다!
        <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme, isAuthModalOpen, openAuthModal, closeAuthModal, user, savedNewsLinks, toggleScrap, savedAiChats, toggleAiScrap }}>
            {isMounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext는 AppProvider 안에서만 써야 합니다.');
    return context;
};
