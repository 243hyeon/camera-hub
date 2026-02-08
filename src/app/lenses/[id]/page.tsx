import { use } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { dummyLenses } from '@/data/lenses'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ChevronLeft, Info } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const lens = dummyLenses.find(l => l.id === parseInt(id))

    if (!lens) return { title: 'Lens Not Found' }

    return {
        title: `${lens.brand} ${lens.model} 사양 및 마운트 정보 | Camera Hub`,
        description: `${lens.model} (${lens.grade}) 렌즈의 스펙, 초점 거리, 조리개 값을 확인하세요.`,
        openGraph: {
            title: `${lens.brand} ${lens.model} 상세 정보`,
            description: lens.description,
            type: 'website',
        }
    }
}

export default function LensDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const lens = dummyLenses.find(l => l.id === parseInt(id))

    if (!lens) {
        notFound()
    }

    return (
        <main className="container mx-auto py-12 px-4 max-w-5xl">
            <Button variant="ghost" asChild className="mb-8 -ml-4">
                <Link href="/lenses" className="flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    목록으로 돌아가기
                </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* 이미지 영역 */}
                <div className="aspect-[4/3] bg-muted rounded-3xl overflow-hidden shadow-2xl border border-muted ring-1 ring-border/50">
                    {lens.imageUrl ? (
                        <img src={lens.imageUrl} alt={lens.model} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <span className="text-4xl">🔍</span>
                            <p className="font-medium">이미지 준비 중</p>
                        </div>
                    )}
                </div>

                {/* 정보 영역 */}
                <div className="space-y-8">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-[10px] font-bold tracking-tighter uppercase px-2 italic bg-primary/5">
                                {lens.brand}
                            </Badge>
                            <Badge className="text-[10px] font-bold uppercase px-2 shadow-none">
                                {lens.grade}
                            </Badge>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">{lens.model}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {lens.description}
                        </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Info className="w-4 h-4" />
                            <h2 className="text-sm font-bold tracking-widest uppercase">Specifications</h2>
                        </div>
                        <div className="rounded-xl border overflow-hidden shadow-sm">
                            <Table>
                                <TableBody>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground w-1/3 bg-muted/20">초점 거리</TableCell>
                                        <TableCell className="font-medium">{lens.specs.focalLength}</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground bg-muted/20">최대 조리개</TableCell>
                                        <TableCell className="font-medium text-primary">{lens.specs.aperture}</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground bg-muted/20">마운트</TableCell>
                                        <TableCell className="font-medium">{lens.specs.mount}</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground bg-muted/20">무게</TableCell>
                                        <TableCell className="font-medium">{lens.specs.weight}g</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground bg-muted/20">출시 가격</TableCell>
                                        <TableCell className="font-black text-primary">
                                            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(lens.specs.price)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button size="lg" className="w-full rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20 group">
                            상담 및 구매 예약
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
