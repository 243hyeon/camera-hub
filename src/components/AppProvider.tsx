"use client";

import { createContext, useContext, useState, useEffect } from 'react';

type AppContextType = {
    lang: string;
    toggleLang: () => void;
    theme: string;
    toggleTheme: () => void;
    // 👇 로그인 팝업을 위한 새로운 스위치들 추가!
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState('KR');
    const [theme, setTheme] = useState('dark');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // 팝업 상태

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleLang = () => setLang((prev) => (prev === 'KR' ? 'EN' : 'KR'));
    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    // 팝업 열고 닫기 함수
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme, isAuthModalOpen, openAuthModal, closeAuthModal }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext는 AppProvider 안에서만 써야 합니다.');
    return context;
};
