'use client'

import { useState } from 'react'
import { dummyCameras, Camera } from '@/data/cameras'
import Link from 'next/link'

export default function AdminCamerasPage() {
    const [cameras, setCameras] = useState<Camera[]>(dummyCameras)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState<Partial<Camera>>({
        brand: '소니',
        tier: '중급기',
        status: '신규'
    })

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const nextId = Math.max(...cameras.map(c => c.id), 0) + 1
        const newItem: Camera = {
            id: nextId,
            brand: formData.brand as string,
            model: formData.model as string,
            tier: formData.tier as any,
            description: formData.description || '',
            specs: {
                sensor: (formData as any).sensor || '',
                resolution: (formData as any).resolution || '',
                mount: (formData as any).mount || ''
            },
            status: formData.status as any
        }
        setCameras([newItem, ...cameras])
        setIsAdding(false)
    }

    const handleDelete = (id: number) => {
        if (confirm('삭제하시겠습니까?')) {
            setCameras(cameras.filter(c => c.id !== id))
        }
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin" className="text-blue-600 hover:underline text-sm mb-2 inline-block">← 대시보드</Link>
                    <h1 className="text-3xl font-bold">카메라 관리</h1>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isAdding ? '취소' : '카메라 추가'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl mb-8 border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">브랜드</label>
                            <select
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                            >
                                <option>소니</option>
                                <option>캐논</option>
                                <option>니콘</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">모델명</label>
                            <input
                                type="text"
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                required
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">티어</label>
                            <select
                                value={formData.tier}
                                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                            >
                                <option>고급기</option>
                                <option>중급기</option>
                                <option>보급기</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">상태</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                            >
                                <option>신규</option>
                                <option>단종</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold">추가하기</button>
                </form>
            )}

            <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-sm">
                        <tr>
                            <th className="p-4">모델</th>
                            <th className="p-4">브랜드</th>
                            <th className="p-4">티어</th>
                            <th className="p-4">상태</th>
                            <th className="p-4 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {cameras.map((camera) => (
                            <tr key={camera.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <td className="p-4 font-bold">{camera.model}</td>
                                <td className="p-4">{camera.brand}</td>
                                <td className="p-4">{camera.tier}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs ${camera.status === '신규' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {camera.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button className="text-sm text-blue-600 hover:underline">수정</button>
                                    <button onClick={() => handleDelete(camera.id)} className="text-sm text-red-600 hover:underline">삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
