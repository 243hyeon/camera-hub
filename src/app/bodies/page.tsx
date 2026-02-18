import Link from 'next/link'
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic';

export default async function BodiesPage() {
    // 1. Supabase의 'bodies' 테이블에서 모든 데이터(*)를 가져옵니다.
    const { data: realCameras, error } = await supabase.from('bodies').select('*');

    if (error) {
        console.error("데이터를 불러오지 못했습니다:", error);
    }

    // 브랜드 필터 기능은 서버 컴포넌트 환경에 맞춰 나중에 쿼리 스트링 등으로 구현할 수 있습니다.
    // 현재는 DB에서 가져온 모든 데이터를 출력합니다.

    return (
        <main className="container mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">카메라 바디</h1>
                    <p className="text-muted-foreground">시장을 선도하는 주요 브랜드의 미러리스 라인업 (실시간 데이터베이스 연동)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {realCameras?.map((camera) => (
                    <Card key={camera.id} className="overflow-hidden group hover:shadow-xl transition-all border-muted">
                        <div className="relative h-[240px] w-full bg-white flex items-center justify-center overflow-hidden border-b">
                            {camera.image_url || camera.imageUrl ? (
                                <img
                                    src={camera.image_url || camera.imageUrl}
                                    alt={camera.name || camera.model}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-muted-foreground italic text-sm">이미지가 등록되지 않았습니다</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge variant={camera.status === '신규' ? 'default' : 'secondary'} className="shadow-md">
                                    {camera.status || '상태 미정'}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-primary/60 tracking-widest uppercase">
                                    {camera.brand || camera.type || 'BRAND'}
                                </span>
                            </div>
                            <CardTitle className="text-2xl">{camera.name || camera.model}</CardTitle>
                            <CardDescription className="line-clamp-2 mt-2">
                                {camera.description || '제품 설명이 준비 중입니다.'}
                            </CardDescription>

                            {/* 핵심 스펙 태그 영역 */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {camera.sensor && (
                                    <span className="bg-gray-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-md border border-gray-700/50 font-bold uppercase tracking-tight flex items-center">
                                        {camera.sensor}
                                    </span>
                                )}
                                {camera.pixels && (
                                    <span className="bg-gray-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-md border border-gray-700/50 font-bold uppercase tracking-tight flex items-center">
                                        {camera.pixels} 화소
                                    </span>
                                )}
                                {camera.video && (
                                    <span className="bg-gray-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-md border border-gray-700/50 font-bold uppercase tracking-tight flex items-center">
                                        {camera.video}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-2xl font-black text-primary">
                                    {(camera.price || camera.specs?.price || 0).toLocaleString()}
                                </span>
                                <span className="text-sm font-bold text-muted-foreground font-sans">원</span>
                            </div>
                        </CardHeader>
                        <CardFooter className="bg-muted/20 border-t pt-4 gap-2">
                            <Button asChild className="flex-1 rounded-xl">
                                <Link href={`/bodies/${camera.id}`}>자세히 보기</Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl"
                            >
                                비교
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {realCameras?.length === 0 && (
                <div className="text-center py-24 bg-muted/10 rounded-3xl border border-dashed">
                    <p className="text-muted-foreground">데이터베이스에 등록된 카메라가 없습니다.</p>
                </div>
            )}
        </main>
    )
}
