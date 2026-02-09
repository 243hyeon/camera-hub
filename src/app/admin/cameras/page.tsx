'use client'

import { useState } from 'react'
import { dummyCameras, Camera } from '@/data/cameras'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Image as ImageIcon, Plus, Trash2, ArrowLeft, Camera as CameraIcon } from 'lucide-react'

export default function AdminCamerasPage() {
    const [cameras, setCameras] = useState<Camera[]>(dummyCameras)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        brand: '소니',
        model: '',
        tier: '중급기' as Camera['tier'],
        description: '',
        sensor: '',
        resolution: '',
        mount: '',
        weight: 0,
        price: 0,
        status: '신규' as Camera['status'],
        imageName: '' // 이미지 파일명 (예: sony-a7m4.jpg)
    })

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const nextId = Math.max(...cameras.map(c => c.id), 0) + 1
        const newItem: Camera = {
            id: nextId,
            brand: formData.brand,
            model: formData.model,
            tier: formData.tier,
            description: formData.description,
            specs: {
                sensor: formData.sensor,
                resolution: formData.resolution,
                mount: formData.mount,
                weight: formData.weight,
                price: formData.price
            },
            status: formData.status,
            imageUrl: formData.imageName ? `/images/cameras/${formData.imageName}` : undefined
        }
        setCameras([newItem, ...cameras])
        setIsAdding(false)
        setFormData({
            brand: '소니',
            model: '',
            tier: '중급기',
            description: '',
            sensor: '',
            resolution: '',
            mount: '',
            weight: 0,
            price: 0,
            status: '신규',
            imageName: ''
        })
        alert(`${formData.model}이(가) 리스트에 추가되었습니다!`)
    }

    const handleDelete = (id: number) => {
        if (confirm('정말로 이 카메라를 삭제하시겠습니까?')) {
            setCameras(cameras.filter(c => c.id !== id))
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
                        카메라 데이터베이스 관리 <CameraIcon className="text-primary w-8 h-8" />
                    </h1>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    variant={isAdding ? "outline" : "default"}
                    className="rounded-2xl h-12 px-8 font-bold shadow-lg"
                >
                    {isAdding ? '작성 취소' : <><Plus className="mr-2" size={20} /> 새 카메라 등록</>}
                </Button>
            </header>

            {isAdding && (
                <Card className="mb-12 border-primary/20 bg-muted/30 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                        <CardTitle className="text-2xl font-bold">새 카메라 하드웨어 등록</CardTitle>
                        <CardDescription>프로젝트의 public/images/cameras 폴더와 연동하여 데이터를 추가합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleAdd} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">브랜드</label>
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
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">모델 제품명</label>
                                    <Input
                                        placeholder="예: α7 IV, EOS R5"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        required
                                        className="rounded-2xl h-12 bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">제품 티어</label>
                                    <select
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                                        className="w-full h-12 px-4 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option>고급기</option>
                                        <option>중급기</option>
                                        <option>보급기</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">현황 상태</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full h-12 px-4 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    >
                                        <option>신규</option>
                                        <option>단종</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">가격 (출시가/원)</label>
                                    <Input
                                        type="number"
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="rounded-2xl h-12 bg-background"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">센서 규격</label>
                                    <Input value={formData.sensor} onChange={(e) => setFormData({ ...formData, sensor: e.target.value })} className="rounded-2xl h-12 bg-background" placeholder="예: 35mm 풀프레임" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">유효 화소</label>
                                    <Input value={formData.resolution} onChange={(e) => setFormData({ ...formData, resolution: e.target.value })} className="rounded-2xl h-12 bg-background" placeholder="예: 3300만 화소" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">마운트</label>
                                    <Input value={formData.mount} onChange={(e) => setFormData({ ...formData, mount: e.target.value })} className="rounded-2xl h-12 bg-background" placeholder="예: E-마운트" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">무게 (g)</label>
                                    <Input type="number" value={formData.weight || ''} onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })} className="rounded-2xl h-12 bg-background" />
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="shrink-0">
                                        <div className="w-32 h-32 bg-background border-2 border-dashed rounded-3xl flex items-center justify-center overflow-hidden shadow-inner uppercase font-bold text-xs text-muted-foreground text-center p-2 relative">
                                            {formData.imageName ? (
                                                <img
                                                    src={`/images/cameras/${formData.imageName}`}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        (e.currentTarget.parentElement as HTMLElement).innerHTML = "File Not Found";
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
                                                <ImageIcon size={16} /> 이미지 연결
                                            </h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                <code>public/images/cameras/</code> 폴더에 사진 파일을 넣고, 파일명과 확장자까지 입력하세요.<br />
                                                입력 즉시 왼쪽 상자에서 미리보기를 확인할 수 있습니다.
                                            </p>
                                        </div>
                                        <Input
                                            placeholder="파일명 입력 (예: sony-a7m4.jpg)"
                                            value={formData.imageName}
                                            onChange={(e) => setFormData({ ...formData, imageName: e.target.value })}
                                            className="rounded-2xl h-12 bg-background border-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                                데이터베이스에 최종 추가하기
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="border-muted/50 overflow-hidden shadow-2xl rounded-3xl">
                <Table>
                    <TableHeader className="bg-muted/50 h-16">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-8 font-bold text-xs uppercase tracking-widest">모델 정보</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest">브랜드</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-widest text-center">등급/상태</TableHead>
                            <TableHead className="pr-8 text-right font-bold text-xs uppercase tracking-widest">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cameras.map((camera) => (
                            <TableRow key={camera.id} className="hover:bg-muted/30 transition-colors h-24">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                            {camera.imageUrl ? (
                                                <img src={camera.imageUrl} alt={camera.model} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={18} className="opacity-20" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg">{camera.model}</div>
                                            <div className="text-xs text-muted-foreground">{camera.specs.resolution} | {camera.specs.sensor}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold">{camera.brand}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col gap-1 items-center">
                                        <Badge variant="outline" className="text-[10px] font-bold h-5 px-2 bg-blue-500/5 text-blue-600 border-blue-200">
                                            {camera.tier}
                                        </Badge>
                                        <Badge className={`text-[10px] h-5 px-2 ${camera.status === '신규' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                                            {camera.status}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="pr-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="rounded-xl h-9 hover:bg-blue-500/10 text-blue-600">수정</Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(camera.id)}
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

const Separator = () => <div className="h-px bg-muted w-full my-4" />
