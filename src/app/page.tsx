import Link from 'next/link'
import { getLatestNews } from '@/lib/fetchNews' // <-- 여기 변경됨!
import { dummyCameras } from '@/data/cameras'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import NewsImage from '@/components/NewsImage'

// 메인 페이지를 async로 변경 (데이터를 기다려야 하니까요)
export default async function Home() {
  // 실시간 뉴스 가져오기 (최대 3개)
  const latestNews = await getLatestNews();
  const featuredNews = latestNews.slice(0, 3);

  // 인기 카메라 (기존 데이터 유지)
  const featuredCameras = dummyCameras.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-black opacity-40"></div>
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <Badge variant="secondary" className="mb-4">Next-Gen Camera Archive</Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            당신의 완벽한 <br />
            카메라를 찾으세요
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            최신 미러리스 바디부터 최상급 렌즈 성능까지, <br />
            전문가급 데이터베이스와 AI 가이드가 당신의 선택을 도와드립니다.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/ai-guide">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-lg px-8 py-6 rounded-full font-bold">
                AI 가이드에게 물어보기
              </Button>
            </Link>
            <Link href="/bodies">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-zinc-700 hover:bg-zinc-800 text-white">
                카메라 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section (RSS 연동) */}
      <section className="container mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2 font-medium">
              <span className="animate-pulse">⚡</span> LATEST UPDATES
            </div>
            <h2 className="text-4xl font-bold">최신 뉴스</h2>
          </div>
          <Link href="/news" className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
            전체보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredNews.map((news) => (
            <a
              key={news.title}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden h-full hover:border-zinc-600 transition-all duration-300 group-hover:transform group-hover:-translate-y-1 rounded-3xl">
                <div className="aspect-video relative overflow-hidden bg-zinc-800">
                  <NewsImage
                    src={news.thumbnail}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white border-none hover:bg-white/20">
                    {news.source || 'NEWS'}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm line-clamp-3">
                    {news.contentSnippet}
                  </p>
                </CardContent>
                <CardFooter className="text-zinc-500 text-xs mt-auto border-t border-zinc-800 pt-4">
                  {news.pubDate}
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Insight Focus Section */}
      <section className="bg-zinc-900 py-20 border-y border-zinc-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Market Insight</h2>
          <div className="max-w-4xl mx-auto bg-black border border-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl text-white select-none pointer-events-none">
              ISSUE
            </div>
            <div className="relative z-10">
              <Badge variant="outline" className="text-blue-400 border-blue-400 mb-4">Focus</Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                2026년 카메라 시장 트렌드
              </h3>
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                AI 기술이 탑재된 AF 시스템과 글로벌 셔터의 대중화가 시작되었습니다.
                이제 사진가는 '초점'보다 '순간'에 더 집중할 수 있는 시대가 열렸습니다.
              </p>
              <Link href="/news">
                <Button variant="secondary" size="lg" className="rounded-full">
                  리포트 자세히 보기 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
