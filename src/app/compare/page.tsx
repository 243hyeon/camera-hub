"use client"

import { useEffect, useState } from 'react'
import { dummyCameras, Camera } from '@/data/cameras'
import { dummyLenses, Lens } from '@/data/lenses'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Trophy, ArrowLeftRight } from 'lucide-react'

export default function ComparePage() {
    const [compareType, setCompareType] = useState<'bodies' | 'lenses'>('bodies')
    const [selectedItems, setSelectedItems] = useState<(Camera | Lens)[]>([])

    useEffect(() => {
        loadItems()
    }, [compareType])

    const loadItems = () => {
        const key = compareType === 'bodies' ? 'compare-bodies' : 'compare-lenses'
        const ids = JSON.parse(localStorage.getItem(key) || '[]') as number[]
        const data = compareType === 'bodies' ? dummyCameras : dummyLenses
        const filtered = data.filter(item => ids.includes(item.id))
        setSelectedItems(filtered)
    }

    const removeItem = (id: number) => {
        const key = compareType === 'bodies' ? 'compare-bodies' : 'compare-lenses'
        const ids = JSON.parse(localStorage.getItem(key) || '[]') as number[]
        const newList = ids.filter(i => i !== id)
        localStorage.setItem(key, JSON.stringify(newList))
        loadItems()
    }

    const clearAll = () => {
        const key = compareType === 'bodies' ? 'compare-bodies' : 'compare-lenses'
        localStorage.setItem(key, '[]')
        setSelectedItems([])
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
    }

    // Spec extraction helpers
    const getBestWeight = () => Math.min(...selectedItems.map(item => item.specs.weight))
    const getBestPrice = () => Math.min(...selectedItems.map(item => item.specs.price))
    const getBestRes = () => {
        if (compareType !== 'bodies') return 0
        const resValues = selectedItems.map(item => parseInt((item as Camera).specs.resolution.replace(/[^0-9]/g, '')) || 0)
        return Math.max(...resValues)
    }

    const isBestRes = (resStr: string) => {
        const val = parseInt(resStr.replace(/[^0-9]/g, '')) || 0
        return val > 0 && val === getBestRes()
    }

    return (
        <main className="container mx-auto py-12 px-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                        제품 비교하기 <ArrowLeftRight className="text-primary w-8 h-8" />
                    </h1>
                    <p className="text-muted-foreground text-lg">선택하신 제품들의 상세 스펙을 한눈에 비교해보세요.</p>
                </div>
                <div className="flex gap-2 p-1 bg-muted rounded-2xl">
                    <Button
                        variant={compareType === 'bodies' ? 'default' : 'ghost'}
                        onClick={() => setCompareType('bodies')}
                        className="rounded-xl px-6"
                    >
                        카메라 바디
                    </Button>
                    <Button
                        variant={compareType === 'lenses' ? 'default' : 'ghost'}
                        onClick={() => setCompareType('lenses')}
                        className="rounded-xl px-6"
                    >
                        렌즈 DB
                    </Button>
                </div>
            </header>

            {selectedItems.length === 0 ? (
                <div className="bg-muted/30 border-2 border-dashed rounded-3xl p-20 text-center">
                    <div className="text-6xl mb-6 opacity-20">⚖️</div>
                    <h3 className="text-2xl font-bold mb-2">비교함이 비어있습니다.</h3>
                    <p className="text-muted-foreground mb-8">제품 목록 페이지에서 '비교' 버튼을 눌러 제품을 담아주세요.</p>
                    <Button asChild className="rounded-xl px-8 h-12">
                        <a href={compareType === 'bodies' ? '/bodies' : '/lenses'}>제품 보러가기</a>
                    </Button>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex justify-end">
                        <Button variant="ghost" onClick={clearAll} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            리스트 초기화
                        </Button>
                    </div>

                    <Card className="border-muted/50 overflow-hidden shadow-2xl rounded-3xl">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[150px] font-bold">항목</TableHead>
                                    {selectedItems.map(item => (
                                        <TableHead key={item.id} className="min-w-[200px] py-6">
                                            <div className="flex flex-col gap-2 relative">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="absolute -top-4 -right-2 p-1 text-muted-foreground hover:text-destructive bg-background border rounded-full shadow-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-primary/60">{item.brand}</span>
                                                <div className="font-black text-lg leading-tight">{item.model}</div>
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Sensor / Focal Length */}
                                <TableRow>
                                    <TableCell className="font-bold bg-muted/20">{compareType === 'bodies' ? '센서' : '초점거리'}</TableCell>
                                    {selectedItems.map(item => (
                                        <TableCell key={item.id}>
                                            {compareType === 'bodies' ? (item as Camera).specs.sensor : (item as Lens).specs.focalLength}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {/* Resolution / Aperture */}
                                <TableRow>
                                    <TableCell className="font-bold bg-muted/20">{compareType === 'bodies' ? '화소' : '조리개'}</TableCell>
                                    {selectedItems.map(item => {
                                        const res = compareType === 'bodies' ? (item as Camera).specs.resolution : (item as Lens).specs.aperture
                                        const isBest = compareType === 'bodies' && isBestRes(res)
                                        return (
                                            <TableCell key={item.id} className={isBest ? "text-primary font-black bg-primary/5" : ""}>
                                                <div className="flex items-center gap-2">
                                                    {res}
                                                    {isBest && <Trophy size={14} className="text-yellow-500 fill-yellow-500" />}
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>

                                {/* Weight */}
                                <TableRow>
                                    <TableCell className="font-bold bg-muted/20">무게 (바디)</TableCell>
                                    {selectedItems.map(item => {
                                        const isBest = item.specs.weight === getBestWeight()
                                        return (
                                            <TableCell key={item.id} className={isBest ? "text-primary font-black bg-primary/5" : ""}>
                                                <div className="flex items-center gap-2">
                                                    {item.specs.weight}g
                                                    {isBest && <Badge variant="secondary" className="bg-primary/20 text-primary border-none">가장 가벼움</Badge>}
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>

                                {/* Price */}
                                <TableRow>
                                    <TableCell className="font-bold bg-muted/20">정가 (출시가)</TableCell>
                                    {selectedItems.map(item => {
                                        const isBest = item.specs.price === getBestPrice()
                                        return (
                                            <TableCell key={item.id} className={isBest ? "text-green-600 font-black bg-green-500/5" : ""}>
                                                <div className="flex items-center gap-2">
                                                    {formatPrice(item.specs.price)}
                                                    {isBest && <Trophy size={14} className="text-green-500 fill-green-500" />}
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>

                                {/* Image / CTA */}
                                <TableRow>
                                    <TableCell className="font-bold bg-muted/20"></TableCell>
                                    {selectedItems.map(item => (
                                        <TableCell key={item.id} className="py-8">
                                            <Button size="sm" asChild variant="outline" className="w-full rounded-xl">
                                                <a href={`/${compareType}/${item.id}`}>자료실 이동</a>
                                            </Button>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>

                    <div className="bg-primary/5 border rounded-3xl p-8 flex items-start gap-4">
                        <Trophy className="text-primary shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-lg mb-2">Camera Hub Insight</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                스펙 강조 데이터는 비교군 내에서 가중치가 높은 항목을 자동으로 계산한 결과입니다.
                                단순 수치 외에도 브랜드별 색감, 렌즈 마운트 인프라 등을 종합적으로 고려하시기 바랍니다.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
