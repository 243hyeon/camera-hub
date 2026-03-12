"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/components/AppProvider';
import { supabase } from '@/lib/supabase'; // 👈 Supabase 불러오기!
import dynamic from 'next/dynamic';
import { useRef, useMemo, useCallback } from 'react'; // 🌟 훅들 추가
import 'react-quill-new/dist/quill.snow.css'; // 🌟 에디터 디자인(CSS) 필수 포함!

// 👇 SSR을 끄고 브라우저에서만 에디터를 불러오도록 마법의 수입(Import) 방식을 사용합니다.
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-gray-800">에디터 로딩 중... ⏳</div>
});

export default function CommunityPage() {
    const { lang, openAuthModal, user } = useAppContext();

    // 👇 새 글 쓰기 팝업 상태와 폼 데이터 공간 추가!
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [postCategory, setPostCategory] = useState('자유');
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // 전송 중 로딩 상태
    const [showToast, setShowToast] = useState(false); // 성공 토스트 알림 상태

    // 👇 1. 에디터를 조종할 리모컨
    const quillRef = useRef<any>(null);

    // 👇 2. 🌟 핵심 마법: 에디터에서 이미지 버튼을 눌렀을 때 실행될 커스텀 함수
    const imageHandler = useCallback(() => {
        // 1. 몰래 파일 선택 창을 만듭니다.
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files ? input.files[0] : null;
            if (!file || !user) return;

            // 2. 선택된 사진을 곧바로 Supabase Storage에 업로드!
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('community_images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('이미지 업로드 실패:', uploadError);
                alert(lang === 'KR' ? '이미지 업로드에 실패했습니다.' : 'Image upload failed.');
                return;
            }

            // 3. 업로드된 사진의 공개 URL을 가져옵니다.
            const { data: { publicUrl } } = supabase.storage
                .from('community_images')
                .getPublicUrl(filePath);

            // 4. 에디터의 현재 커서 위치에 사진 URL을 쏙! 끼워 넣습니다.
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            editor.insertEmbed(range ? range.index : 0, 'image', publicUrl);
        };
    }, [user, lang]);

    // 👇 3. 에디터 툴바에 어떤 버튼들을 보여줄지 세팅 (useMemo로 묶어야 에러가 안 납니다)
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }], // 제목 크기
                ['bold', 'italic', 'underline', 'strike'], // 글씨 스타일
                [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 리스트
                ['link', 'image'], // 링크, 🌟 사진 버튼
                ['clean'] // 서식 지우기
            ],
            handlers: {
                image: imageHandler // 🌟 사진 버튼을 누르면 우리가 만든 가로채기 함수가 실행됨!
            }
        }
    }), [imageHandler]);

    // 🌟 1. DB에서 가져온 진짜 글들을 담을 빈 배열(그릇)을 만듭니다.
    const [posts, setPosts] = useState<any[]>([]);

    // 🌟 2. DB에서 글을 최신순으로 가져오는 함수
    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('community_posts')
            .select('*')
            .order('created_at', { ascending: false }); // 최신 글이 맨 위로 오게 정렬!

        if (!error && data) {
            setPosts(data);
        }
    };

    // 🌟 3. 페이지가 처음 열릴 때(또는 새로고침 시) 딱 한 번 글을 불러옵니다.
    useEffect(() => {
        fetchPosts();
    }, []);

    // 👇 DB로 글을 전송하는 진짜 마법 함수!
    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // (React Quill은 빈 내용일 때 '<p><br></p>'를 반환하므로 이것도 예외 처리!)
        if (!postTitle.trim() || !postContent.trim() || postContent === '<p><br></p>') {
            alert(lang === 'KR' ? '제목과 내용을 모두 입력해 주세요!' : 'Please enter both title and content!');
            return;
        }

        setIsSubmitting(true);

        // 🌟 똑똑한 썸네일 추출기: 본문 HTML에서 첫 번째 <img> 태그의 src 주소를 찾아냅니다.
        const extractFirstImage = (htmlContent: string) => {
            const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
            const img = doc.querySelector('img');
            return img ? img.src : null;
        };
        const thumbnailImageUrl = extractFirstImage(postContent);

        // DB에 글 저장 (본문은 HTML 그대로 저장!)
        const { error } = await supabase.from('community_posts').insert({
            user_id: user.id,
            author_name: user.user_metadata?.name || user.user_metadata?.full_name || '카메라 러버', // 구글 이름 가져오기
            author_avatar: user.user_metadata?.avatar_url || 'https://placehold.co/100x100?text=U', // 구글 프사 가져오기
            category: postCategory,
            title: postTitle,
            content: postContent, // 👈 HTML 태그와 사진 주소가 듬뿍 담긴 블로그 내용!
            image_url: thumbnailImageUrl // 👈 뽑아낸 첫 번째 사진 주소 (목록의 썸네일용)
        });

        setIsSubmitting(false);

        if (error) {
            console.error('글 작성 에러:', error);
            alert(lang === 'KR' ? '글 작성에 실패했습니다.' : 'Failed to post.');
        } else {
            // 성공 토스트 띄우기 (3초 뒤 자동 닫힘)
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            setIsWriteModalOpen(false); // 팝업 닫기
            setPostTitle(''); // 칸 비우기
            setPostContent('');
            fetchPosts(); // 👈 이 한 줄을 추가! (DB에서 새 목록을 다시 불러옵니다)
        }
    };

    const t = {
        title: lang === 'KR' ? '커뮤니티' : 'Community',
        desc: lang === 'KR' ? '카메라 유저들과 자유롭게 장비 정보와 사진을 나누세요.' : 'Share your gear info and photos freely with other camera users.',
        writeBtn: lang === 'KR' ? '✏️ 새 글 쓰기' : '✏️ Write Post',
        tabAll: lang === 'KR' ? '전체글' : 'All',
        tabReview: lang === 'KR' ? '장비리뷰' : 'Reviews',
        tabGallery: lang === 'KR' ? '사진갤러리' : 'Gallery',
        tabQnA: lang === 'KR' ? '질문/답변' : 'Q&A',
    };

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
                    onClick={() => {
                        if (!user) {
                            openAuthModal();
                        } else {
                            setIsWriteModalOpen(true); // 👈 로그인 되어있으면 글쓰기 팝업 열기!
                        }
                    }}
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

            {/* 🌟 게시글 목록 렌더링 영역 */}
            <div className="space-y-4">
                {
                    posts.length === 0 ? (
                        // 글이 하나도 없을 때 보여줄 예쁜 빈 화면
                        <div className="text-center py-20 bg-gray-50 dark:bg-[#1c1c1c] rounded-3xl border border-gray-100 dark:border-gray-800">
                            <span className="text-4xl mb-4 block">📭</span>
                            <p className="text-gray-500 dark:text-gray-400 font-bold">
                                {lang === 'KR' ? '아직 작성된 글이 없습니다. 첫 글의 주인공이 되어보세요!' : 'No posts yet. Be the first to write!'}
                            </p>
                        </div>
                    ) : (
                        // 진짜 글이 있을 때 반복해서 그려주기
                        posts.map((post) => (
                            <Link
                                href={`/community/${post.id}`}
                                key={post.id}
                                className="block bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer group"
                            >

                                {/* 상단: 카테고리와 제목 */}
                                <div className="flex items-start gap-4 mb-3">
                                    <span className="shrink-0 px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-xs font-extrabold tracking-wide">
                                        {post.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                        {post.title}
                                    </h3>
                                </div>

                                {/* 중단: 글 내용 미리보기 */}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed pl-[4.5rem]">
                                    {post.content}
                                </p>

                                {/* 👇 🌟 새로 추가: 사진이 있으면 썸네일로 보여주기 👇 */}
                                {post.image_url && (
                                    <div className="pl-[4.5rem] mb-4">
                                        <img
                                            src={post.image_url}
                                            alt="post image"
                                            className="h-32 w-auto object-cover rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
                                        />
                                    </div>
                                )}
                                {/* 👆 사진 썸네일 끝 👆 */}

                                {/* 하단: 작성자 정보와 날짜/조회수 */}
                                <div className="flex items-center justify-between pl-[4.5rem]">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={post.author_avatar || 'https://placehold.co/100x100?text=U'}
                                            alt="profile"
                                            className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                                        />
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {post.author_name}
                                        </span>
                                        <span className="text-gray-300 dark:text-gray-600 mx-1">•</span>
                                        <time suppressHydrationWarning className="text-xs font-medium text-gray-400">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </time>
                                    </div>

                                    {/* 좋아요, 조회수 등 (일단 시각적으로만 배치) */}
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                        <span className="flex items-center gap-1">👀 {post.views || 0}</span>
                                        <span className="flex items-center gap-1">❤️ {post.likes || 0}</span>
                                    </div>
                                </div>

                            </Link>
                        ))
                    )
                }
            </div>

            {/* 🌟 새 글 쓰기 팝업 (Modal) UI */}
            {
                isWriteModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in px-4"
                        onClick={() => !isSubmitting && setIsWriteModalOpen(false)}>
                        <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-800"
                            onClick={(e) => e.stopPropagation()}>

                            {/* 닫기 버튼 */}
                            <button onClick={() => setIsWriteModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                                {lang === 'KR' ? '새 글 작성하기 ✍️' : 'Write a New Post ✍️'}
                            </h2>

                            <form onSubmit={handlePostSubmit} className="space-y-4">
                                {/* 카테고리 선택 */}
                                <div className="flex gap-2">
                                    {['자유', '질문', '정보', '사진자랑'].map(cat => (
                                        <button key={cat} type="button" onClick={() => setPostCategory(cat)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${postCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* 제목 입력 */}
                                <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required
                                    placeholder={lang === 'KR' ? '제목을 입력하세요' : 'Title'}
                                    className="w-full bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-colors" />

                                {/* 👇 🌟 여기서부터 교체! 기존 textarea와 사진 버튼 영역을 싹 지우고 이걸 넣으세요 👇 */}
                                <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl text-gray-900 dark:text-white pb-12">
                                    <ReactQuill
                                        // @ts-expect-error Typescript complains about ref on dynamic component but it works at runtime
                                        ref={quillRef}
                                        theme="snow"
                                        value={postContent}
                                        onChange={setPostContent}
                                        modules={modules}
                                        placeholder={lang === 'KR' ? '자유롭게 글과 사진을 작성해 보세요...' : 'Write your post here...'}
                                        className="h-64" // 에디터 높이 확보 (툴바 때문에 하단 여백 필요)
                                    />
                                </div>
                                {/* 👆 에디터 영역 끝 👆 */}

                                {/* 등록 버튼 */}
                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={isSubmitting}
                                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-bold transition-colors shadow-md">
                                        {isSubmitting ? (lang === 'KR' ? '등록 중...' : 'Posting...') : (lang === 'KR' ? '등록하기' : 'Post')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* 🌟 완료 토스트 알림 (Toast) */}
            {
                showToast && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] bg-gray-900 text-white dark:bg-white dark:text-gray-900 border border-transparent dark:border-gray-200 px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-up">
                        <svg className="w-5 h-5 text-green-400 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="font-bold text-sm md:text-base whitespace-nowrap">
                            {lang === 'KR' ? '성공적으로 글이 등록되었습니다! 🎉' : 'Post successfully created! 🎉'}
                        </span>
                    </div>
                )
            }
        </div>
    );
}
