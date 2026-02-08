"use client";

import { useState } from 'react'
import Link from 'next/link'
import { dummyCameras } from '@/data/cameras'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function BodiesPage() {
    const brands = ['캐논', '니콘', '소니']
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

    const filteredCameras = selectedBrand
        ? dummyCameras.filter(c => c.brand === selectedBrand)
        : dummyCameras

    const tierOrder = { '고급기': 1, '중급기': 2, '보급기': 3 }
    const sortedCameras = [...filteredCameras].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])

    return (
        <main className="container mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">카메라 바디</h1>
                    <p className="text-muted-foreground">시장을 선도하는 주요 브랜드의 미러리스 라인업</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={selectedBrand === null ? "default" : "outline"}
                        onClick={() => setSelectedBrand(null)}
                        className="rounded-full px-6"
                    >
                        전체
                    </Button>
                    {brands.map((brand) => (
                        <Button
                            key={brand}
                            variant={selectedBrand === brand ? "default" : "outline"}
                            onClick={() => setSelectedBrand(brand)}
                            className="rounded-full px-6"
                        >
                            {brand}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-16">
                {['고급기', '중급기', '보급기'].map((tier) => {
                    const camerasInTier = sortedCameras.filter(c => c.tier === tier)
                    if (camerasInTier.length === 0) return null

                    return (
                        <section key={tier}>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-bold">{tier}</h2>
                                <div className="h-px flex-1 bg-border" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {camerasInTier.map((camera) => (
                                    <Card key={camera.id} className="overflow-hidden group hover:shadow-xl transition-all border-muted">
                                        <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                                            {camera.imageUrl ? (
                                                <img src={camera.imageUrl} alt={camera.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <span className="text-muted-foreground italic">No Image Available</span>
                                            )}
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <Badge variant={camera.status === '신규' ? 'default' : 'secondary'} className="shadow-sm">
                                                    {camera.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-primary/60 tracking-widest uppercase">{camera.brand}</span>
                                            </div>
                                            <CardTitle className="text-2xl">{camera.model}</CardTitle>
                                            <CardDescription className="line-clamp-2 mt-2">{camera.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="bg-muted/20 border-t pt-4 gap-2">
                                            <Button asChild className="flex-1 rounded-xl">
                                                <Link href={`/bodies/${camera.id}`}>자세히 보기</Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="rounded-xl"
                                                onClick={() => {
                                                    const compareList = JSON.parse(localStorage.getItem('compare-bodies') || '[]')
                                                    if (compareList.includes(camera.id)) {
                                                        alert('이미 비교함에 들어있습니다.')
                                                        return
                                                    }
                                                    if (compareList.length >= 3) {
                                                        alert('최대 3개까지만 비교 가능합니다.')
                                                        return
                                                    }
                                                    const newList = [...compareList, camera.id]
                                                    localStorage.setItem('compare-bodies', JSON.stringify(newList))
                                                    alert(`${camera.model}이(가) 비교함에 담겼습니다.`)
                                                }}
                                            >
                                                비교
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )
                })}
            </div>
        </main>
    )
}
