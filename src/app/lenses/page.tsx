import { useState } from 'react'
import Link from 'next/link'
import { dummyLenses } from '@/data/lenses'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function LensesPage() {
    const brands = ['캐논', '니콘', '소니']
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

    const filteredLenses = selectedBrand
        ? dummyLenses.filter(l => l.brand === selectedBrand)
        : []

    // 등급 목록 추출 및 정렬 (프리미엄 라인 우선)
    const gradePriority: { [key: string]: number } = {
        'G Master': 1,
        'L-series': 1,
        'S-line': 1,
        'G': 2,
        'Standard': 3
    }
    const grades = Array.from(new Set(filteredLenses.map(l => l.grade)))
        .sort((a, b) => (gradePriority[a] || 99) - (gradePriority[b] || 99))

    return (
        <main className="container mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">렌즈 데이터베이스</h1>
                    <p className="text-muted-foreground">광학 기술의 정수, 브랜드별 최상급 렌즈 라인업</p>
                </div>
                <div className="flex flex-wrap gap-2">
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
                    {selectedBrand && (
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedBrand(null)}
                            className="text-muted-foreground"
                        >
                            초기화
                        </Button>
                    )}
                </div>
            </div>

            {!selectedBrand ? (
                <div className="bg-muted/30 border-2 border-dashed rounded-3xl p-20 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-muted-foreground text-lg">브랜드를 선택하여 렌즈 목록을 확인하세요.</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {grades.map((grade) => {
                        const lensesInGrade = filteredLenses.filter(l => l.grade === grade)
                        return (
                            <section key={grade}>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-bold">{grade}</h2>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {lensesInGrade.map((lens) => (
                                        <Card key={lens.id} className="overflow-hidden group hover:shadow-xl transition-all border-muted flex flex-col">
                                            <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                                                {lens.imageUrl ? (
                                                    <img src={lens.imageUrl} alt={lens.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                ) : (
                                                    <span className="text-muted-foreground italic">No Image Available</span>
                                                )}
                                                <div className="absolute top-3 right-3">
                                                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                                                        {lens.specs.mount}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardHeader className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-primary/60 tracking-widest uppercase">{lens.brand}</span>
                                                </div>
                                                <CardTitle className="text-2xl">{lens.model}</CardTitle>
                                                <CardDescription className="line-clamp-2 mt-2">{lens.description}</CardDescription>
                                            </CardHeader>
                                            <CardFooter className="bg-muted/20 border-t pt-4">
                                                <Button asChild variant="secondary" className="w-full rounded-xl">
                                                    <Link href={`/lenses/${lens.id}`}>자세히 보기</Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            )}
        </main>
    )
}
