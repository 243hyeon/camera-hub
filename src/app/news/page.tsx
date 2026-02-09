import { getLatestNews } from '@/lib/fetchNews'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, ExternalLink, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const revalidate = 3600; // Revalidate every hour

export default async function NewsPage() {
    const newsItems = await getLatestNews();

    return (
        <main className="container mx-auto py-24 px-4 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b pb-12">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter mb-6">GLOBAL LIVE NEWS</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                        DPReview, PetaPixel 등 전 세계 주요 카메라 매체에서 수집된 실시간 뉴스피드입니다.
                        가장 권위 있는 소식들을 한눈에 확인하세요.
                    </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-primary/80 uppercase tracking-[0.2em] bg-primary/5 px-6 py-3 rounded-full border border-primary/20 shadow-inner">
                    <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                    Live Engine Working
                </div>
            </header>

            {newsItems.length === 0 ? (
                <div className="py-32 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted flex flex-col items-center gap-4">
                    <div className="text-4xl">📡</div>
                    <p className="text-muted-foreground font-bold italic">현재 최신 뉴스를 패치하는 중입니다. 잠시만 기다려주세요...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {newsItems.map((news) => (
                        <Card key={news.id} className="group overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 border-muted/50 bg-background/50 backdrop-blur-sm rounded-[2rem] group">
                            <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                                <img
                                    src={news.imageUrl}
                                    alt={news.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-primary/90 text-primary-foreground border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest shadow-xl">
                                        {news.source}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="flex-1 p-8">
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-4 font-black uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                    {news.pubDate}
                                </div>
                                <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-4">
                                    {news.title}
                                </CardTitle>
                                <CardDescription className="text-sm leading-relaxed line-clamp-3 text-muted-foreground/80 font-medium italic italic">
                                    "{news.contentSnippet}"
                                </CardDescription>
                            </CardHeader>

                            <CardFooter className="p-8 pt-0">
                                <Button asChild className="w-full h-14 rounded-2xl font-black text-sm gap-2 shadow-xl shadow-primary/10 group-hover:shadow-primary/30 transition-all active:scale-95">
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">
                                        기사 원문 읽기 <ExternalLink size={18} />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    )
}
