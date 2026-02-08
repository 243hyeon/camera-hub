'use client'

import { useState } from 'react'
import { dummyLenses, Lens } from '@/data/lenses'
import Link from 'next/link'

export default function AdminLensesPage() {
    const [lenses, setLenses] = useState<Lens[]>(dummyLenses)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState<Partial<Lens>>({
        brand: '소니',
        grade: 'Standard'
    })

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const nextId = Math.max(...lenses.map(l => l.id), 0) + 1
        const newItem: Lens = {
            id: nextId,
            brand: formData.brand as string,
            model: formData.model as string,
            grade: formData.grade as string,
            description: formData.description || '',
            specs: {
                focalLength: (formData as any).focalLength || '',
                aperture: (formData as any).aperture || '',
                mount: (formData as any).mount || '',
                weight: Number((formData as any).weight) || 0,
                price: Number((formData as any).price) || 0
            }
        }
        setLenses([newItem, ...lenses])
        setIsAdding(false)
    }

    const handleDelete = (id: number) => {
        if (confirm('삭제하시겠습니까?')) {
            setLenses(lenses.filter(l => l.id !== id))
        }
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin" className="text-blue-600 hover:underline text-sm mb-2 inline-block">← 대시보드</Link>
                    <h1 className="text-3xl font-bold">렌즈 관리</h1>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isAdding ? '취소' : '렌즈 추가'}
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
                            <label className="block text-sm font-medium mb-1">등급</label>
                            <input
                                type="text"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                required
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                                placeholder="예: G Master, L-series"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">무게 (g)</label>
                            <input
                                type="number"
                                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) } as any)}
                                required
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">가격 (원)</label>
                            <input
                                type="number"
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) } as any)}
                                required
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-800"
                            />
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
                            <th className="p-4">등급</th>
                            <th className="p-4 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {lenses.map((lens) => (
                            <tr key={lens.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <td className="p-4 font-bold">{lens.model}</td>
                                <td className="p-4">{lens.brand}</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                                        {lens.grade}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button className="text-sm text-blue-600 hover:underline">수정</button>
                                    <button onClick={() => handleDelete(lens.id)} className="text-sm text-red-600 hover:underline">삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
