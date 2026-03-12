"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/components/AppProvider';

export default function PostDetailPage() {
    const { id } = useParams(); // 🌟 주소창에서 게시글 ID를 쏙 빼옵니다!
    const router = useRouter();
    const { lang, user, openAuthModal } = useAppContext();

    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 👇 댓글용 상태 변수들
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // 👇 좋아요 관리를 위한 새로운 상태 2개 추가!
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    // 🌟 커스텀 삭제 모달 상태
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'post' | 'comment', id?: string } | null>(null);

    // 🌟 커스텀 경고 모달 상태 (비속어 경고, 에러 메시지 등)
    const [alertConfig, setAlertConfig] = useState<{ message: string, onClose?: () => void } | null>(null);

    // 🌟 ID를 가지고 DB에서 글 내용 가져오기
    useEffect(() => {
        const fetchPostDetail = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('community_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('게시글 로드 에러:', error);
                setAlertConfig({
                    message: lang === 'KR' ? '게시글을 찾을 수 없습니다.' : 'Post not found.',
                    onClose: () => router.push('/community') // 확인 누르면 목록으로 쫓아내기!
                });
            } else {
                setPost(data);

                // 👇 이 부분을 추가해 주세요! (초기 좋아요 수와 내 클릭 여부 확인)
                setLikesCount(data.likes || 0);
                const likedObj = JSON.parse(localStorage.getItem('camera_hub_likes') || '{}');
                if (id && typeof id === 'string' && likedObj[id]) {
                    setIsLiked(true);
                }

                // (보너스) 조회수 1 올리기!
                if (data) {
                    await supabase.from('community_posts').update({ views: (data.views || 0) + 1 }).eq('id', id);
                }
            }
            setIsLoading(false);
        };

        fetchPostDetail().then(() => fetchComments());
    }, [id, lang, router]);

    // 👇 2. 이 게시글에 달린 댓글만 싹 가져오는 함수
    const fetchComments = async () => {
        if (!id) return;
        const { data } = await supabase
            .from('community_comments')
            .select('*')
            .eq('post_id', id)
            .order('created_at', { ascending: true }); // 댓글은 작성순(오래된 것이 위로) 정렬!

        if (data) setComments(data);
    };

    // 👇 4. 대망의 댓글 등록 및 🔥 욕설 필터링 함수!
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            openAuthModal(); // 로그인 안 했으면 로그인 창 띄우기
            return;
        }
        if (!newComment.trim()) return;

        // 🚨 금지어 사전 (필요한 비방 단어를 쉼표로 계속 추가해 주시면 됩니다)
        const badWords = ['바보', '멍청이', 'ㅅㅂ', '시발', '미친', '새끼', '존나'];

        // 사용자가 입력한 댓글에 금지어가 포함되어 있는지 검사
        const hasBadWord = badWords.some(word => newComment.includes(word));

        if (hasBadWord) {
            setAlertConfig({
                message: lang === 'KR' ? '⚠️ 고운 말을 사용해 주세요! (비방/욕설 금지)' : '⚠️ Please do not use profanity!'
            });
            return; // 👈 금지어가 발견되면 여기서 함수를 강제 종료! (DB 전송 완벽 차단)
        }

        setIsSubmittingComment(true);

        // 필터를 통과한 깨끗한 댓글만 DB로 전송!
        const { error } = await supabase.from('community_comments').insert({
            post_id: id,
            user_id: user.id,
            author_name: user.user_metadata?.name || user.user_metadata?.full_name || '카메라 러버',
            author_avatar: user.user_metadata?.avatar_url || 'https://placehold.co/100x100?text=U',
            content: newComment
        });

        setIsSubmittingComment(false);

        if (!error) {
            setNewComment(''); // 성공 시 입력창 깔끔하게 비우기
            fetchComments(); // 방금 쓴 댓글이 보이도록 목록 새로고침!
        } else {
            setAlertConfig({
                message: lang === 'KR' ? '댓글 작성에 실패했습니다.' : 'Failed to post comment.'
            });
        }
    };

    // 🌟 1. 내 게시글 삭제 함수
    const handleDeletePost = async () => {
        // Supabase에 삭제 명령 내리기
        const { error } = await supabase.from('community_posts').delete().eq('id', id);

        if (!error) {
            setAlertConfig({
                message: lang === 'KR' ? '게시글이 삭제되었습니다.' : 'Post deleted successfully.',
                onClose: () => router.push('/community') // 👈 삭제 성공 후 확인 누르면 커뮤니티 목록으로 자동 이동!
            });
        } else {
            setAlertConfig({
                message: lang === 'KR' ? '게시글 삭제에 실패했습니다.' : 'Failed to delete post.'
            });
        }
        setDeleteTarget(null);
    };

    // 🌟 2. 내 댓글 삭제 함수
    const handleDeleteComment = async (commentId: string) => {
        const { error } = await supabase.from('community_comments').delete().eq('id', commentId);

        if (!error) {
            fetchComments(); // 👈 삭제 성공 시 댓글 목록만 새로고침! (게시글은 그대로 둠)
        } else {
            setAlertConfig({
                message: lang === 'KR' ? '댓글 삭제에 실패했습니다.' : 'Failed to delete comment.'
            });
        }
        setDeleteTarget(null);
    };

    // 🌟 좋아요 버튼을 눌렀을 때 작동하는 함수
    const handleToggleLike = async () => {
        if (!user) {
            openAuthModal(); // 비회원이면 로그인 창 띄우기
            return;
        }

        // 1. 낙관적 업데이트 (DB보다 화면을 먼저 즉시 바꿔서 엄청 빠르게 느끼게 함!)
        const newIsLiked = !isLiked;
        const newCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

        setIsLiked(newIsLiked);
        setLikesCount(newCount);

        // 2. 브라우저 수첩에 내가 눌렀다고 메모하기 (새로고침해도 유지됨)
        const likedObj = JSON.parse(localStorage.getItem('camera_hub_likes') || '{}');
        if (newIsLiked) {
            likedObj[id as string] = true;
        } else {
            delete likedObj[id as string];
        }
        localStorage.setItem('camera_hub_likes', JSON.stringify(likedObj));

        // 3. 백그라운드에서 조용히 DB에 진짜 숫자 업데이트
        await supabase.from('community_posts').update({ likes: newCount }).eq('id', id);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold dark:text-white">로딩 중... ⏳</div>;
    if (!post) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            {/* 🌟 뒤로가기 버튼 */}
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                {lang === 'KR' ? '목록으로 돌아가기' : 'Back to list'}
            </button>

            {/* 🌟 게시글 본문 캔버스 */}
            <article className="bg-white dark:bg-[#1c1c1c] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800">

                {/* 헤더: 카테고리, 제목, 작성자 정보 */}
                <div className="mb-10 border-b border-gray-100 dark:border-gray-800 pb-8">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-extrabold tracking-wide mb-4">
                        {post.category}
                    </span>

                    {/* 👇 🌟 1. 제목과 휴지통 버튼을 한 줄(Flex)로 묶어줍니다! 🌟 👇 */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            {post.title}
                        </h1>

                        {/* 이곳으로 이사 온 삭제 버튼! (shrink-0 추가로 찌그러짐 방지) */}
                        {user?.id === post?.user_id && (
                            <button
                                onClick={() => setDeleteTarget({ type: 'post' })}
                                className="shrink-0 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all mt-1"
                                title={lang === 'KR' ? '게시글 삭제' : 'Delete Post'}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* 👇 2. 하단 정보 영역 (작성자 프로필 & 카운트만 깔끔하게 남음) 👇 */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <img src={post.author_avatar || 'https://placehold.co/100x100?text=U'} alt="profile" className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700" />
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white text-lg">{post.author_name}</div>
                                <time className="text-sm text-gray-500" suppressHydrationWarning>
                                    {new Date(post.created_at).toLocaleDateString()}
                                </time>
                            </div>
                        </div>

                        {/* 조회수와 🌟 살아 숨쉬는 좋아요 버튼 🌟 */}
                        <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                            {/* 조회수는 기존 그대로 */}
                            <span className="flex items-center gap-1">👀 {post.views || 0}</span>

                            {/* 👇 가짜 텍스트를 지우고 이 진짜 버튼으로 통째로 교체하세요! 👇 */}
                            <button
                                onClick={handleToggleLike}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${isLiked
                                    ? 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400 scale-105' // 눌렀을 때 (빨간색 & 살짝 커짐)
                                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-400' // 안 눌렀을 때
                                    }`}
                                title={lang === 'KR' ? '좋아요' : 'Like'}
                            >
                                {/* 하트 아이콘 (누르면 꽉 찬 하트, 안 누르면 빈 하트) */}
                                {isLiked ? (
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                )}
                                <span className={isLiked ? "font-extrabold" : "font-medium"}>{likesCount}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 바디: 실제 글 내용 (HTML 렌더링) */}
                <div 
                    className="prose dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 text-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

            </article>

            {/* 🌟 댓글 섹션 시작 */}
            <div className="mt-12 bg-white dark:bg-[#1c1c1c] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {lang === 'KR' ? '댓글' : 'Comments'} <span className="text-blue-500">{comments.length}</span>
                </h3>

                {/* 📝 댓글 입력창 */}
                <form onSubmit={handleCommentSubmit} className="mb-10 flex gap-4">
                    <img src={user?.user_metadata?.avatar_url || 'https://placehold.co/100x100?text=U'} alt="my profile" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 hidden sm:block" />
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={lang === 'KR' ? '댓글을 남겨보세요... (욕설 및 비방 금지!)' : 'Leave a comment...'}
                            className="flex-1 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isSubmittingComment || !newComment.trim()}
                            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl disabled:opacity-50 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap"
                        >
                            {lang === 'KR' ? '등록' : 'Post'}
                        </button>
                    </div>
                </form>

                {/* 💬 댓글 목록 렌더링 */}
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <img src={comment.author_avatar || 'https://placehold.co/100x100?text=U'} alt="profile" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 shrink-0 mt-1" />
                            <div className="flex-1 bg-gray-50 dark:bg-[#252525] p-4 rounded-2xl rounded-tl-none group"> {/* 👈 hover 시 나타나게 group 추가 */}
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.author_name}</span>
                                    <time className="text-xs text-gray-500" suppressHydrationWarning>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </time>

                                    {/* 👇 🌟 내 댓글일 때만 나타나는 삭제 버튼 (오른쪽 끝으로 밀어넣기) 👇 */}
                                    {user?.id === comment.user_id && (
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget({ type: 'comment', id: comment.id })}
                                            className="ml-auto text-xs font-bold text-gray-400 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100" // 👈 PC에서는 마우스 올릴 때만 보이게!
                                            title={lang === 'KR' ? '댓글 삭제' : 'Delete comment'}
                                        >
                                            {lang === 'KR' ? '삭제' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                                {/* whitespace-pre-wrap으로 줄바꿈 유지 */}
                                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* 댓글이 하나도 없을 때 보여줄 안내 문구 */}
                    {comments.length === 0 && (
                        <p className="text-center text-gray-500 py-6 text-sm">
                            {lang === 'KR' ? '가장 먼저 댓글을 남겨보세요!' : 'Be the first to comment!'}
                        </p>
                    )}
                </div>
            </div>
            {/* 🌟 커스텀 삭제 확인 모달 🌟 */}
            {deleteTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    {/* 반투명 배경 (클릭 시 모달 닫힘) */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setDeleteTarget(null)}
                    />
                    {/* 모달 내용 */}
                    <div className="relative bg-white dark:bg-[#1c1c1c] rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-slide-up-fade">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {deleteTarget.type === 'post'
                                ? (lang === 'KR' ? '게시글 삭제' : 'Delete Post')
                                : (lang === 'KR' ? '댓글 삭제' : 'Delete Comment')}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                            {deleteTarget.type === 'post'
                                ? (lang === 'KR' ? '정말로 이 글을 삭제하시겠습니까? (이 작업은 복구할 수 없습니다)' : 'Are you sure you want to delete this post? (Cannot be undone)')
                                : (lang === 'KR' ? '이 댓글을 삭제하시겠습니까?' : 'Are you sure you want to delete this comment?')}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                {lang === 'KR' ? '취소' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteTarget.type === 'post') {
                                        handleDeletePost();
                                    } else if (deleteTarget.type === 'comment' && deleteTarget.id) {
                                        handleDeleteComment(deleteTarget.id);
                                    }
                                }}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-500/20"
                            >
                                {lang === 'KR' ? '삭제' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🌟 커스텀 경고 모달 🌟 */}
            {alertConfig && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => {
                            const onClose = alertConfig.onClose;
                            setAlertConfig(null);
                            if (onClose) onClose();
                        }}
                    />
                    <div className="relative bg-white dark:bg-[#1c1c1c] rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-slide-up-fade text-center">
                        <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {lang === 'KR' ? '알림' : 'Notice'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                            {alertConfig.message}
                        </p>
                        <button
                            onClick={() => {
                                const onClose = alertConfig.onClose;
                                setAlertConfig(null);
                                if (onClose) onClose();
                            }}
                            className="w-full px-5 py-3 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                        >
                            {lang === 'KR' ? '확인' : 'OK'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
