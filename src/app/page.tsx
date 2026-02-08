import { dummyNews } from '@/data/news'

export default function Home() {
  const latestNews = dummyNews.slice(0, 3)

  const marketIssues = dummyNews.filter(n => n.category === '시장 이슈')

  return (
    <main className="container mx-auto py-12 px-4 space-y-16">
      {/* Hero / Latest News Secton */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">최신 뉴스</h2>
          <p className="text-sm text-muted-foreground underline cursor-pointer">더 보기</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <article key={news.id} className="group relative p-6 bg-card border rounded-2xl hover:border-primary/50 transition-all shadow-sm">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase px-2 py-0.5 border border-primary/20 rounded-full mb-3 inline-block">
                {news.category}
              </span>
              <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                {news.title}
              </h3>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span>{news.createdAt || '2024-02-08'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Market Issues Section with specialized card */}
      <section>
        <h2 className="text-3xl font-extrabold tracking-tight mb-8">시장 이슈 포커스</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {marketIssues.map((issue) => (
            <div key={issue.id} className="p-8 bg-secondary/30 border border-border rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">{issue.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{issue.summary}</p>
                <button className="mt-6 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  상세보기 <span className="text-lg">→</span>
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 text-9xl font-black text-foreground/5 italic pointer-events-none">
                ISSUE
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorized Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t">
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            신제품 뉴스
          </h2>
          <ul className="space-y-4">
            <li className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <p className="font-medium">캐논 EOS R5 Mark II 루머 소식</p>
              <span className="text-xs text-muted-foreground">어제</span>
            </li>
            <li className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <p className="font-medium">니콘 Z6 III 출시 예정일 공개</p>
              <span className="text-xs text-muted-foreground">2일 전</span>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            소프트웨어 이슈
          </h2>
          <ul className="space-y-4">
            <li className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <p className="font-medium">어도비 라이트룸 AI 노이즈 제거 기능 개선</p>
              <span className="text-xs text-muted-foreground">3일 전</span>
            </li>
            <li className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <p className="font-medium">카메라 센서 클리닝 서비스 할인 이벤트</p>
              <span className="text-xs text-muted-foreground">지난 주</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
