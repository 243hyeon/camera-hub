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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState('KR');
    const [theme, setTheme] = useState('dark');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    // 👇 스크랩 목록을 중앙에서 관리합니다.
    const [savedNewsLinks, setSavedNewsLinks] = useState<string[]>([]);

    useEffect(() => {
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
        const fetchSavedNews = async () => {
            if (!user) {
                setSavedNewsLinks([]);
                return;
            }
            const { data } = await supabase.from('saved_news').select('link').eq('user_id', user.id);
            if (data) {
                setSavedNewsLinks(data.map((item) => item.link));
            }
        };
        fetchSavedNews();
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

    const toggleLang = () => setLang((prev) => (prev === 'KR' ? 'EN' : 'KR'));
    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        // 하위 컴포넌트들이 savedNewsLinks와 toggleScrap을 쓸 수 있게 내려줍니다!
        <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme, isAuthModalOpen, openAuthModal, closeAuthModal, user, savedNewsLinks, toggleScrap }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext는 AppProvider 안에서만 써야 합니다.');
    return context;
};
