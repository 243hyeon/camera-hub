import Link from 'next/link'
import { dummyNews } from '@/data/news'
import { dummyCameras } from '@/data/cameras'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'

export default function Home() {
  const latestNews = dummyNews.slice(0, 3)
  const featuredCameras = dummyCameras.slice(0, 3)

  return (
    <main className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-zinc-950" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="container relative z-10 px-4 text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1 text-zinc-400 border-zinc-800 rounded-full animate-fade-in">
            <Sparkles className="w-3 h-3 mr-2 text-primary" />
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

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Featured Section: News */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Latest Updates</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">최신 뉴스</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/news" className="flex items-center gap-1 font-bold">
              전체보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map((news) => (
            <Card key={news.id} className="group overflow-hidden border-muted/50 hover:shadow-2xl transition-all h-full flex flex-col">
              <div className="h-48 bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground shadow-lg">
                  {news.category}
                </Badge>
              </div>
              <CardHeader className="flex-1">
                <CardTitle className="text-xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {news.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {news.summary}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 pb-6 opacity-60 text-xs font-medium">
                {news.createdAt || '2024-02-08'} • 5 min read
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Section: Popular Cameras */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Hottest Items</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">인기 카메라</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/bodies" className="flex items-center gap-1 font-bold">
              더 많은 기종 확인 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCameras.map((camera) => (
            <Card key={camera.id} className="group overflow-hidden border-muted/50 hover:shadow-2xl transition-all shadow-sm">
              <div className="aspect-[4/3] bg-muted flex items-center justify-center p-8 overflow-hidden relative">
                {camera.imageUrl ? (
                  <img src={camera.imageUrl} alt={camera.model} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <span className="text-4xl grayscale opacity-20">📸</span>
                )}
                <div className="absolute top-4 right-4 capitalize">
                  <Badge variant="secondary" className="backdrop-blur-md bg-white/10 border-white/20 text-xs">
                    {camera.tier}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{camera.brand}</span>
                  <Badge variant="outline" className="text-[9px] h-5 px-1.5">{camera.status}</Badge>
                </div>
                <CardTitle className="text-2xl font-black">{camera.model}</CardTitle>
              </CardHeader>
              <CardFooter className="pt-0 pb-6">
                <Button asChild variant="secondary" className="w-full rounded-xl h-12 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Link href={`/bodies/${camera.id}`}>상세 스펙 확인</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Market Issues Insight (Full Width) */}
      <section className="bg-muted/30 py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Insight Focus</Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">시장의 흐름을 <br />가장 먼저 읽으세요</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-xl">
                급변하는 하이엔드 카메라 시장의 가격 변동, 수급 이슈,
                그리고 차세대 모델에 대한 루머까지 한곳에서 확인하세요.
              </p>
              <div className="space-y-4">
                {dummyNews.filter(n => n.category === '시장 이슈').slice(0, 2).map(issue => (
                  <div key={issue.id} className="p-5 bg-background rounded-2xl border shadow-sm group hover:border-primary/50 transition-colors cursor-pointer">
                    <h4 className="font-bold mb-1 truncate">{issue.title}</h4>
                    <p className="text-xs text-muted-foreground">{issue.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-video rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border-8 border-background">
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-32 h-32 text-primary opacity-20" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-sm font-bold text-primary mb-2 tracking-[0.2em] uppercase">Market Pulse</p>
                <h3 className="text-2xl font-bold">2024년 미러리스 시장 성장률 전망치 발표</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
