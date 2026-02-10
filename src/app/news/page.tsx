import { getLatestNews } from '@/lib/fetchNews' // <-- 교체!
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import NewsImage from '@/components/NewsImage'

// 1시간마다 페이지 갱신 (ISR) - 옵션
export const revalidate = 3600;

export default async function NewsPage() {
    const newsList = await getLatestNews();

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">카메라 뉴스 업데이트</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        전 세계 카메라 관련 소식을 실시간으로 모아서 전달해 드립니다. <br />
                        신제품 발표부터 루머, 펌웨어 업데이트까지 놓치지 마세요.
                    </p>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsList.map((news, index) => (
                        <Card key={`${news.source}-${index}`} className="bg-zinc-900 border-zinc-800 flex flex-col hover:border-zinc-700 transition-colors group">
                            {/* Image Section */}
                            <div className="aspect-[16/9] bg-black relative overflow-hidden rounded-t-xl">
                                <NewsImage
                                    src={news.thumbnail}
                                    alt={news.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-zinc-700">
                                        {news.source || 'Global News'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 flex flex-col p-6">
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                                    <span>{news.pubDate}</span>
                                    <span>•</span>
                                    <span>{news.source}</span>
                                </div>

                                <CardTitle className="text-xl mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                                    {news.title}
                                </CardTitle>

                                <CardContent className="p-0 mb-6 flex-1">
                                    <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                                        {news.contentSnippet}
                                    </p>
                                </CardContent>

                                <CardFooter className="p-0 pt-6 border-t border-zinc-800">
                                    <Button asChild variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white group-hover:border-zinc-600">
                                        <a href={news.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                            원문 기사 읽기 <ExternalLink size={16} />
                                        </a>
                                    </Button>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
