"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 👈 Supabase 엔진 가져오기!

type AppContextType = {
    lang: string;
    toggleLang: () => void;
    theme: string;
    toggleTheme: () => void;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    user: any; // 👈 현재 로그인한 유저 정보를 담을 공간
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState('KR');
    const [theme, setTheme] = useState('dark');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null); // 👈 기본값은 '로그인 안 됨(null)'

    // 1. 테마 설정
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
    }, [theme]);

    // 2. 🌟 Supabase 엔진에 접속해서 유저 상태 확인하기!
    useEffect(() => {
        // 처음에 접속했을 때 로그인 상태 확인
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // 로그인/로그아웃 상태가 변할 때마다 실시간으로 업데이트
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                setIsAuthModalOpen(false); // 로그인 성공하면 팝업창 자동으로 닫기!
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const toggleLang = () => setLang((prev) => (prev === 'KR' ? 'EN' : 'KR'));
    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        // 하위 컴포넌트들에게 user 정보도 같이 내려줍니다!
        <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme, isAuthModalOpen, openAuthModal, closeAuthModal, user }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext는 AppProvider 안에서만 써야 합니다.');
    return context;
};
