import { dummyNews } from '@/data/news'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Tag } from 'lucide-react'

export default function NewsPage() {
    return (
        <main className="container mx-auto py-12 px-4">
            <header className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">카메라 뉴스 업데이트</h1>
                <p className="text-muted-foreground text-lg">최신 업계 동향과 신제품 출시 소식을 매거진 스타일로 만나보세요.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dummyNews.map((news) => (
                    <Card key={news.id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-all border-muted shadow-sm">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                            {/* Placeholder for actual image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-800 dark:to-zinc-900" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform">
                                <Tag className="w-20 h-20" />
                            </div>
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-primary shadow-lg">{news.category}</Badge>
                            </div>
                        </div>

                        <CardHeader className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                                <Calendar className="w-3 h-3" />
                                {news.createdAt || '2024-02-08'}
                            </div>
                            <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                {news.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <CardDescription className="text-sm leading-relaxed line-clamp-3">
                                {news.summary}
                            </CardDescription>
                        </CardContent>

                        <CardFooter className="pt-0 pb-6 border-t mx-6 mt-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary/60">
                            <span>Read More</span>
                            <div className="w-8 h-px bg-primary/30" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    )
}
