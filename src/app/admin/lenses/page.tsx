'use client'

import { useState } from 'react'
import { dummyLenses, Lens } from '@/data/lenses'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Image as ImageIcon, Plus, Trash2, ArrowLeft, Disc } from 'lucide-react'

export default function AdminLensesPage() {
    const [lenses, setLenses] = useState<Lens[]>(dummyLenses)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        brand: '소니',
        model: '',
        grade: 'Standard',
        description: '',
        focalLength: '',
        aperture: '',
        mount: '',
        weight: 0,
        price: 0,
        imageName: '' // 이미지 파일명 (예: fe-2470gm2.jpg)
    })

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const nextId = Math.max(...lenses.map(l => l.id), 0) + 1
        const newItem: Lens = {
            id: nextId,
            brand: formData.brand,
            model: formData.model,
            grade: formData.grade,
            description: formData.description,
            specs: {
                focalLength: formData.focalLength,
                aperture: formData.aperture,
                mount: formData.mount,
                weight: formData.weight,
                price: formData.price
            },
            imageUrl: formData.imageName ? `/images/lenses/${formData.imageName}` : undefined
        }
        setLenses([newItem, ...lenses])
        setIsAdding(false)
        setFormData({
            brand: '소니',
            model: '',
            grade: 'Standard',
            description: '',
            focalLength: '',
            aperture: '',
            mount: '',
            weight: 0,
            price: 0,
            imageName: ''
        })
        alert(`${formData.model}이(가) 데이터베이스에 등록되었습니다!`)
    }

    const handleDelete = (id: number) => {
        if (confirm('정말로 이 렌즈 데이터를 삭제하시겠습니까?')) {
            setLenses(lenses.filter(l => l.id !== id))
        }
    }

    return (
        <main className="container mx-auto py-12 px-4 max-w-6xl">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-2">
                    <Link href="/admin" className="text-primary hover:underline text-sm font-bold flex items-center gap-2 mb-4">
                        <ArrowLeft size={16} /> 대시보드로 돌아가기
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        렌즈 라이브러리 관리 <Disc className="text-primary w-8 h-8" />
                    </h1>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    variant={isAdding ? "outline" : "default"}
                    className="rounded-2xl h-12 px-8 font-bold shadow-lg"
                >
                    {isAdding ? '작성 취소' : <><Plus className="mr-2" size={20} /> 새 렌즈 등록</>}
                </Button>
            </header>

            {isAdding && (
                <Card className="mb-12 border-primary/20 bg-muted/30 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                        <CardTitle className="text-2xl font-bold">광학 렌즈 데이터 추가</CardTitle>
                        <CardDescription>프로젝트의 public/images/lenses 폴더에 이미지를 추가하고 파일명을 입력하세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleAdd} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">제조 브랜드</label>
                                    <select
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full h-12 px-4 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option>소니</option>
                                        <option>캐논</option>
                                        <option>니콘</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">렌즈 모델명</label>
                                    <Input
                                        placeholder="예: FE 24-70mm F2.8 GM II"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        required
                                        className="rounded-2xl h-12 bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">렌즈 등급</label>
                                    <Input
                                        placeholder="예: G Master, L-series"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="rounded-2xl h-12 bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">무게 (g)</label>
                                    <Input type="number" value={formData.weight || ''} onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })} className="rounded-2xl h-12 bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">출시 가격 (원)</label>
                                    <Input type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="rounded-2xl h-12 bg-background" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">초점 거리</label>
                                    <Input value={formData.focalLength} onChange={(e) => setFormData({ ...formData, focalLength: e.target.value })} className="rounded-2xl h-12 bg-background" placeholder="예: 24-70mm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">최대 조리개</label>
                                    <Input value={formData.aperture} onChange={(e) => setFormData({ ...formData, aperture: e.target.value })} className="rounded-2xl h-12 bg-background" placeholder="예: F2.8" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">지원 마운트</label>
                                    <Input value={formData.mount} onChange={(e) => setFormData({ ...formData, mount: e.target.value })} className="rounded-2xl h-12 bg-background" placeholder="예: E-마운트" />
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="shrink-0">
                                        <div className="w-32 h-32 bg-background border-2 border-dashed rounded-3xl flex items-center justify-center overflow-hidden shadow-inner uppercase font-bold text-xs text-muted-foreground text-center p-2 relative">
                                            {formData.imageName ? (
                                                <img
                                                    src={`/images/lenses/${formData.imageName}`}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        (e.currentTarget.parentElement as HTMLElement).innerHTML = "No Image";
                                                    }}
                                                />
                                            ) : (
                                                <ImageIcon size={32} className="opacity-20" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="space-y-1">
                                            <h4 className="font-bold flex items-center gap-2">
                                                <ImageIcon size={16} /> 렌즈 사진 연결
                                            </h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                <code>public/images/lenses/</code> 경로에 이미지를 준비하고 파일명을 확장자와 함께 입력하세요.
                                            </p>
                                        </div>
                                        <Input
                                            placeholder="파일명 입력 (예: sony-2470gm2.jpg)"
                                            value={formData.imageName}
                                            onChange={(e) => setFormData({ ...formData, imageName: e.target.value })}
                                            className="rounded-2xl h-12 bg-background border-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                                신규 렌즈 정보 등록하기
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="border-muted/50 overflow-hidden shadow-2xl rounded-3xl">
                <Table>
                    <TableHeader className="bg-muted/50 h-16">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-8 font-bold text-xs uppercase tracking-widest">렌즈 정보</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest">브랜드</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest text-center">등급 구분</TableHead>
                            <TableHead className="pr-8 text-right font-bold text-xs uppercase tracking-widest">제어</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lenses.map((lens) => (
                            <TableRow key={lens.id} className="hover:bg-muted/30 transition-colors h-24">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                            {lens.imageUrl ? (
                                                <img src={lens.imageUrl} alt={lens.model} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={18} className="opacity-20" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg">{lens.model}</div>
                                            <div className="text-xs text-muted-foreground">{lens.specs.focalLength} | {lens.specs.aperture}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold">{lens.brand}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary" className="text-[10px] font-bold h-6 px-3 bg-zinc-100 dark:bg-zinc-800">
                                        {lens.grade}
                                    </Badge>
                                </TableCell>
                                <TableCell className="pr-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="rounded-xl h-9 hover:bg-blue-500/10 text-blue-600">수정</Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(lens.id)}
                                            className="rounded-xl h-9 hover:bg-destructive/10 text-destructive"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </main>
    )
}
