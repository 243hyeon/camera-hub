"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// 중앙 통제실에서 관리할 데이터 타입 정의
type AppContextType = {
    lang: string;
    toggleLang: () => void;
    theme: string;
    toggleTheme: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    // 기본값: 한국어, 다크모드
    const [lang, setLang] = useState('KR');
    const [theme, setTheme] = useState('dark');

    // 테마가 바뀔 때마다 HTML 태그에 'dark' 클래스를 넣었다 뺐다 합니다.
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

    return (
        <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
}

// 다른 파일에서 통제실 데이터를 쉽게 꺼내 쓰는 마법의 훅
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext는 AppProvider 안에서만 써야 합니다.');
    return context;
};
