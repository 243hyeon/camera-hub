import { getLatestNews } from '@/lib/fetchNews'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Radio, RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminNewsPage() {
    const newsList = await getLatestNews();

    return (
        <main className="container mx-auto py-12 px-4 max-w-5xl min-h-screen">
            <header className="mb-12">
                <Link href="/admin" className="text-primary hover:underline text-sm font-bold flex items-center gap-2 mb-4">
                    <ArrowLeft size={16} /> 대시보드로 돌아가기
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        뉴스 엔진 상태 <RefreshCw className="text-primary w-8 h-8" />
                    </h1>
                    <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/5 px-4 py-2 font-bold animate-pulse">
                        ● LIVE AGGREGATION ACTIVE
                    </Badge>
                </div>
            </header>

            <div className="grid gap-12">
                <Card className="border-primary/20 bg-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-primary/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                                <Radio className="text-primary w-8 h-8" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-black">자동 수집 엔진 가동 중</CardTitle>
                                <CardDescription className="text-zinc-500 text-base font-medium">전 세계 카메라 미디어의 RSS 피드를 1시간 간격으로 동기화합니다.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-background/80 p-8 rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-3">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Source Alpha</span>
                                <h4 className="font-bold text-xl flex items-center justify-between">
                                    SonyAlphaRumors
                                    <Badge className="bg-green-500/20 text-green-600 border-none text-[10px]">CONNECTED</Badge>
                                </h4>
                            </div>
                            <div className="bg-background/80 p-8 rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-3">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Source Beta</span>
                                <h4 className="font-bold text-xl flex items-center justify-between">
                                    PetaPixel
                                    <Badge className="bg-green-500/20 text-green-600 border-none text-[10px]">CONNECTED</Badge>
                                </h4>
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-900 rounded-[2rem] border border-zinc-800 text-sm font-medium leading-relaxed text-zinc-400">
                            <h5 className="text-white font-bold mb-2">💡 시스템 안내</h5>
                            현재 시스템은 `src/lib/fetchNews.ts`를 통해 자동화되어 있습니다. 수동 작성 기능은 엔진의 무결성을 위해 비활성화되었으며, 글로벌 벤더들의 소식이 입수되는 대로 즉시 사이트에 반영됩니다.
                        </div>

                        <Button asChild className="w-full h-16 rounded-[1.5rem] font-black text-xl gap-3 shadow-2xl shadow-primary/20">
                            <Link href="/news">
                                실시간 뉴스 피드 모니터링 <ExternalLink size={24} />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black px-2">최근 수집된 기사 샘플</h2>
                    <div className="grid gap-4">
                        {newsList.slice(0, 5).map((news, index) => (
                            <div key={index} className="p-6 bg-muted/30 border rounded-3xl flex justify-between items-center group hover:bg-muted/50 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[9px] font-bold px-2 h-5 border-zinc-700">{news.source}</Badge>
                                        <span className="text-[10px] font-medium text-muted-foreground">{news.pubDate}</span>
                                    </div>
                                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{news.title}</h4>
                                </div>
                                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                                    <a href={news.link} target="_blank"><ExternalLink size={18} /></a>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
