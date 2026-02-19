"use client";

import { useAppContext } from './AppProvider';

export default function AuthModal() {
    const { lang, isAuthModalOpen, closeAuthModal } = useAppContext();

    // 팝업이 닫혀있으면 아무것도 보여주지 않음
    if (!isAuthModalOpen) return null;

    // 번역 딕셔너리
    const t = {
        title: lang === 'KR' ? '로그인이 필요합니다' : 'Login Required',
        desc: lang === 'KR' ? 'Camera Hub의 프리미엄 기능을 사용하시려면 3초 만에 로그인해 주세요.' : 'Please log in to use Camera Hub premium features.',
        googleBtn: lang === 'KR' ? 'Google로 계속하기' : 'Continue with Google',
        or: lang === 'KR' ? '또는' : 'or',
        emailPlaceholder: lang === 'KR' ? '이메일 주소' : 'Email address',
        passwordPlaceholder: lang === 'KR' ? '비밀번호' : 'Password',
        loginBtn: lang === 'KR' ? '이메일로 시작하기' : 'Continue with Email',
        close: lang === 'KR' ? '닫기' : 'Close'
    };

    return (
        // 배경을 어둡게 덮는 레이어 (backdrop-blur로 뒤쪽을 흐리게 만듭니다)
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">

            {/* 팝업 컨테이너 */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#1c1c1c] p-8 md:p-10 rounded-3xl shadow-2xl mx-4 transform transition-all border border-gray-200 dark:border-gray-800">

                {/* 우측 상단 X(닫기) 버튼 */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {/* 텍스트 영역 */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">{t.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.desc}</p>
                </div>

                {/* 구글 소셜 로그인 버튼 (가장 강조) */}
                <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t.googleBtn}
                </button>

                {/* 구분선 */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="mx-4 text-xs font-medium text-gray-400">{t.or}</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                {/* 이메일 입력 폼 */}
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                    <input
                        type="password"
                        placeholder={t.passwordPlaceholder}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mt-2">
                        {t.loginBtn}
                    </button>
                </div>

            </div>
        </div>
    );
}
