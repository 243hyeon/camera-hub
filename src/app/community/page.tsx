'use client'

import { useState } from 'react'
import { dummyPosts, Post } from '@/data/posts'

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>(dummyPosts)
    const [isWriting, setIsWriting] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const nextId = Math.max(...posts.map(p => p.id), 0) + 1
        const newPost: Post = {
            id: nextId,
            title: newTitle,
            author: '방문자',
            content: newContent,
            createdAt: new Date().toISOString().split('T')[0],
            views: 0
        }
        setPosts([newPost, ...posts])
        setIsWriting(false)
        setNewTitle('')
        setNewContent('')
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">자유 게시판</h1>
                <button
                    onClick={() => setIsWriting(!isWriting)}
                    className="bg-black dark:bg-zinc-100 dark:text-black text-white px-6 py-2 rounded-full font-bold hover:opacity-80 transition-opacity"
                >
                    {isWriting ? '취소' : '글쓰기'}
                </button>
            </div>

            {isWriting && (
                <form onSubmit={handleSubmit} className="mb-12 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            required
                            className="w-full text-xl font-bold bg-transparent border-b py-2 focus:border-blue-600 outline-none"
                        />
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            required
                            className="w-full h-48 bg-transparent border rounded-xl p-4 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                            게시글 등록
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-sm border-b">
                        <tr>
                            <th className="p-4 pl-6">제목</th>
                            <th className="p-4">작성자</th>
                            <th className="p-4">날짜</th>
                            <th className="p-4 text-center">조회수</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer group">
                                <td className="p-4 pl-6">
                                    <div className="font-medium group-hover:text-blue-600 transition-colors">{post.title}</div>
                                </td>
                                <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{post.author}</td>
                                <td className="p-4 text-sm text-zinc-500">{post.createdAt}</td>
                                <td className="p-4 text-center text-sm text-zinc-500">{post.views}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
