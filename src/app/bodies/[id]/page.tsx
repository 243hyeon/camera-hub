import { use } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { dummyCameras } from '@/data/cameras'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ChevronLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const camera = dummyCameras.find(c => c.id === parseInt(id))

    if (!camera) return { title: 'Camera Not Found' }

    return {
        title: `${camera.brand} ${camera.model} 스펙 및 리뷰 | Camera Hub`,
        description: `${camera.model}의 상세 사양, 센서 정보, 입고 상태를 확인하세요. ${camera.description.substring(0, 100)}...`,
        openGraph: {
            title: `${camera.brand} ${camera.model} 상세 정보`,
            description: camera.description,
            type: 'website',
        }
    }
}

export default function BodyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const camera = dummyCameras.find(c => c.id === parseInt(id))

    if (!camera) {
        notFound()
    }

    return (
        <main className="container mx-auto py-12 px-4 max-w-5xl">
            <Button variant="ghost" asChild className="mb-8 -ml-4">
                <Link href="/bodies" className="flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    목록으로 돌아가기
                </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* 이미지 영역 */}
                <div className="aspect-[4/3] bg-muted rounded-3xl overflow-hidden shadow-2xl border border-muted ring-1 ring-border/50">
                    {camera.imageUrl ? (
                        <img src={camera.imageUrl} alt={camera.model} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <span className="text-4xl">📸</span>
                            <p className="font-medium">이미지 준비 중</p>
                        </div>
                    )}
                </div>

                {/* 정보 영역 */}
                <div className="space-y-8">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-[10px] font-bold tracking-tighter uppercase px-2">
                                {camera.brand}
                            </Badge>
                            <Badge variant={camera.status === '신규' ? 'default' : 'secondary'} className="text-[10px] font-bold uppercase px-2">
                                {camera.status}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase px-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-transparent">
                                {camera.tier}
                            </Badge>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">{camera.model}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {camera.description}
                        </p>
                    </div>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Technical Specifications</h2>
                        <div className="rounded-xl border overflow-hidden">
                            <Table>
                                <TableBody>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground w-1/3 bg-muted/30">센서 크기</TableCell>
                                        <TableCell className="font-medium">{camera.specs.sensor}</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground bg-muted/30">유효 화소</TableCell>
                                        <TableCell className="font-medium">{camera.specs.resolution}</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-muted-foreground bg-muted/30">마운트</TableCell>
                                        <TableCell className="font-medium">{camera.specs.mount}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button size="lg" className="flex-1 rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20">
                            구매 문의
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1 rounded-2xl h-14 text-lg font-bold">
                            비교하기
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
