import Link from 'next/link'
import { getLatestNews } from '@/lib/fetchNews'
import { dummyCameras } from '@/data/cameras'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const revalidate = 3600;

export default async function Home() {
  const latestNews = await getLatestNews();
  const featuredNews = latestNews.slice(0, 3);
  const featuredCameras = dummyCameras.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black overflow-hidden px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-black" />
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Badge variant="outline" className="mb-6 px-4 py-1 text-zinc-400 border-zinc-800 rounded-full">
            Next-Gen Camera Archive
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            당신의 완벽한 <br />
            <span className="text-primary italic">카메라</span>를 찾으세요
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            최신 미러리스 바디부터 최상급 렌즈 성능까지, <br className="hidden md:block" />
            전문가급 데이터베이스와 AI 가이드가 당신의 선택을 도와드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
              <Link href="/ai-guide">AI 가이드에게 물어보기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-2xl text-lg font-bold text-white border-zinc-800 hover:bg-zinc-900 bg-transparent">
              <Link href="/bodies">카메라 둘러보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News Section (RSS 연동) */}
      <section className="container mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2 font-bold tracking-widest uppercase text-xs">
              <span className="animate-pulse">●</span> LATEST LIVE UPDATES
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">최신 글로벌 뉴스</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/news" className="flex items-center gap-1 font-bold">
              전체보기 →
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredNews.map((news) => (
            <a
              key={news.id}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden h-full hover:border-primary/50 transition-all duration-300 rounded-3xl group">
                <div className="aspect-[16/10] relative overflow-hidden bg-zinc-800">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border-none hover:bg-primary font-bold">
                    {news.source || 'WORLD NEWS'}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-white group-hover:text-primary transition-colors font-bold leading-tight">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm line-clamp-3 italic">
                    "{news.contentSnippet}"
                  </p>
                </CardContent>
                <CardFooter className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-auto border-t border-zinc-800/50 pt-4">
                  {news.pubDate}
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Section: Popular Cameras */}
      <section className="container mx-auto px-4 mt-12">
        <h2 className="text-4xl font-extrabold tracking-tight mb-10">인기 카메라</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCameras.map((camera) => (
            <Card key={camera.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden hover:shadow-2xl transition-all shadow-sm rounded-3xl">
              <div className="aspect-[4/3] bg-zinc-800/50 flex items-center justify-center p-8 overflow-hidden relative">
                {camera.imageUrl ? (
                  <img src={camera.imageUrl} alt={camera.model} className="w-full h-full object-contain hover:scale-110 transition-transform duration-500" />
                ) : (
                  <span className="text-4xl grayscale opacity-20">📸</span>
                )}
                <div className="absolute top-4 right-4 capitalize">
                  <Badge variant="secondary" className="backdrop-blur-md bg-white/10 border-white/20 text-xs text-white">
                    {camera.tier}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{camera.brand}</span>
                  <Badge variant="outline" className="text-[9px] h-5 px-1.5 font-bold uppercase border-zinc-700 text-zinc-400">{camera.status}</Badge>
                </div>
                <CardTitle className="text-2xl font-black text-white">{camera.model}</CardTitle>
              </CardHeader>
              <CardFooter className="pt-0 pb-6">
                <Button asChild variant="secondary" className="w-full rounded-2xl h-12 font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                  <Link href={`/bodies/${camera.id}`}>상세 스펙 확인</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Insight Focus Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto bg-primary/5 border border-primary/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 font-black text-[12rem] text-primary select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            CORE
          </div>
          <div className="relative z-10">
            <Badge variant="outline" className="text-primary border-primary/30 mb-6 uppercase tracking-widest font-bold font-mono">Archive Insight</Badge>
            <h3 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
              광학 기술의 미래, <br />
              우리가 기록합니다
            </h3>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl">
              AI 기술이 탑재된 AF 시스템과 글로벌 셔터의 대중화가 시작되었습니다.
              이제 사진가는 '초점'보다 '순간'에 더 집중할 수 있는 시대가 열렸습니다.
            </p>
            <Button asChild className="rounded-2xl h-14 px-10 text-lg font-black shadow-xl shadow-primary/20">
              <Link href="/news">최신 리포트 읽기 →</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
