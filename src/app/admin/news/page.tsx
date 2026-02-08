'use client'

import { useState } from 'react'
import { dummyNews, News } from '@/data/news'
import Link from 'next/link'

export default function AdminNewsPage() {
    const [newsList, setNewsList] = useState<News[]>(dummyNews)
    const [isAdding, setIsAdding] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newCategory, setNewCategory] = useState<News['category']>('신제품')
    const [newSummary, setNewSummary] = useState('')

    const handleAddNews = (e: React.FormEvent) => {
        e.preventDefault()
        const nextId = Math.max(...newsList.map(n => n.id), 0) + 1
        const newItem: News = {
            id: nextId,
            title: newTitle,
            category: newCategory,
            summary: newSummary,
            createdAt: new Date().toISOString().split('T')[0]
        }
        setNewsList([newItem, ...newsList])
        setIsAdding(false)
        setNewTitle('')
        setNewSummary('')
    }

    const handleDelete = (id: number) => {
        if (confirm('정말로 삭제하시겠습니까?')) {
            setNewsList(newsList.filter(n => n.id !== id))
        }
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin" className="text-blue-600 hover:underline text-sm mb-2 inline-block">← 대시보드</Link>
                    <h1 className="text-3xl font-bold">뉴스 관리</h1>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isAdding ? '취소' : '새 뉴스 작성'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddNews} className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl mb-8 border border-blue-200">
                    <h2 className="text-xl font-bold mb-4">새 뉴스 작성</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">카테고리</label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value as any)}
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                            >
                                <option value="신제품">신제품</option>
                                <option value="시장 이슈">시장 이슈</option>
                                <option value="SW 이슈">SW 이슈</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">제목</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                                placeholder="뉴스 제목을 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">요약</label>
                            <textarea
                                value={newSummary}
                                onChange={(e) => setNewSummary(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800 h-24"
                                placeholder="뉴스 요약 내용을 입력하세요"
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">저장하기</button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-sm">
                        <tr>
                            <th className="p-4">카테고리</th>
                            <th className="p-4">제목</th>
                            <th className="p-4">작성일</th>
                            <th className="p-4 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {newsList.map((news) => (
                            <tr key={news.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="p-4">
                                    <span className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded uppercase">
                                        {news.category}
                                    </span>
                                </td>
                                <td className="p-4 font-medium">{news.title}</td>
                                <td className="p-4 text-sm text-zinc-500">{news.createdAt}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button className="text-sm text-blue-600 hover:underline">수정</button>
                                    <button
                                        onClick={() => handleDelete(news.id)}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
