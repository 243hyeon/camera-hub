"use client";

import { useAppContext } from '@/components/AppProvider';

export default function CommunityPage() {
    const { lang, openAuthModal } = useAppContext();

    const t = {
        title: lang === 'KR' ? '커뮤니티' : 'Community',
        desc: lang === 'KR' ? '카메라 유저들과 자유롭게 장비 정보와 사진을 나누세요.' : 'Share your gear info and photos freely with other camera users.',
        writeBtn: lang === 'KR' ? '✏️ 새 글 쓰기' : '✏️ Write Post',
        tabAll: lang === 'KR' ? '전체글' : 'All',
        tabReview: lang === 'KR' ? '장비리뷰' : 'Reviews',
        tabGallery: lang === 'KR' ? '사진갤러리' : 'Gallery',
        tabQnA: lang === 'KR' ? '질문/답변' : 'Q&A',
    };

    // 뼈대용 가짜 게시글 데이터 (나중에 Supabase DB로 교체될 예정입니다)
    const mockPosts = [
        { id: 1, category: t.tabReview, title: lang === 'KR' ? '소니 ZV-E10 한 달 사용기' : 'Sony ZV-E10 One Month Review', author: 'CameraLover', likes: 24, comments: 5, date: '2026. 02. 20' },
        { id: 2, category: t.tabQnA, title: lang === 'KR' ? '캐논 R50 렌즈 추천 좀 해주세요!' : 'Need Canon R50 Lens Recommendations!', author: '초보진사', likes: 3, comments: 12, date: '2026. 02. 19' },
        { id: 3, category: t.tabGallery, title: lang === 'KR' ? '주말에 다녀온 제주도 풍경 (a7C II)' : 'Jeju Island Landscapes (a7C II)', author: '빛사냥꾼', likes: 89, comments: 15, date: '2026. 02. 18' },
    ];

    return (
        <div className="container mx-auto p-6 max-w-5xl mt-10 relative pb-32 animate-fade-in-up transition-colors duration-300">

            {/* 타이틀 및 글쓰기 버튼 영역 */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">{t.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{t.desc}</p>
                </div>

                {/* 👇 핵심! 글쓰기를 누르면 로그인 팝업이 뜹니다 👇 */}
                <button
                    onClick={openAuthModal}
                    className="px-6 py-3.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full font-bold shadow-lg hover:scale-105 transition-transform whitespace-nowrap"
                >
                    {t.writeBtn}
                </button>
            </div>

            {/* 카테고리 탭 */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                {[t.tabAll, t.tabReview, t.tabGallery, t.tabQnA].map((tab, idx) => (
                    <button key={idx} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* 게시글 리스트 영역 */}
            <div className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                {mockPosts.map((post) => (
                    <div key={post.id} className="p-5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer group flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 block">{post.category}</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2">
                                {post.title}
                                <span className="ml-2 text-sm font-medium text-red-500">[{post.comments}]</span>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                <span>{post.author}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                            </div>
                        </div>
                        {/* 좋아요(추천) 배지 */}
                        <div className="hidden sm:flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 w-14 h-14 rounded-xl border border-gray-200 dark:border-gray-700">
                            <span className="text-gray-400 text-xs mt-1">▲</span>
                            <span className="font-bold text-gray-700 dark:text-gray-300">{post.likes}</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
