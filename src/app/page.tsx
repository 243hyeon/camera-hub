import Link from 'next/link';

// 📡 PetaPixel(글로벌 1위 카메라 매체)의 실시간 뉴스를 가져오는 마법의 함수!
async function getGlobalCameraNews() {
  try {
    // rss2json이라는 무료 변환기를 통해 RSS(뉴스 피드)를 다루기 쉬운 데이터로 바꿔 가져옵니다.
    // { next: { revalidate: 3600 } } 코드는 1시간(3600초)마다 새로운 뉴스를 갱신하라는 뜻입니다.
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://petapixel.com/feed/', {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data.items.slice(0, 3); // 가장 최신 기사 딱 3개만 자릅니다.
  } catch (error) {
    console.error('뉴스 연동 실패:', error);
    return []; // 실패 시 빈 배열 반환
  }
}

export default async function HomePage() {
  // 컴포넌트가 렌더링될 때 실시간 뉴스를 가져옵니다.
  const newsItems = await getGlobalCameraNews();

  return (
    <div className="flex flex-col items-center relative overflow-hidden pb-32">

      {/* 🌟 상단: 히어로(메인 대문) 영역 */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center relative w-full pt-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="text-center z-10 px-4 mb-16 animate-fade-in-up">
          <h2 className="text-gray-400 font-bold tracking-[0.2em] text-xs md:text-sm mb-6 uppercase border border-gray-800 rounded-full px-4 py-1.5 inline-block bg-[#1c1c1c]">
            Next-Gen Camera Archive
          </h2>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            당신의 완벽한 <br className="hidden md:block" />
            카메라를 찾으세요
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium break-keep mb-10">
            최신 미러리스 바디부터 최상급 렌즈 성능까지, <br />
            전문가급 데이터베이스와 AI 가이드가 당신의 선택을 도와드립니다.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/bodies" className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
              카메라 둘러보기
            </Link>
            <Link href="/lenses" className="px-8 py-3.5 rounded-full bg-[#1c1c1c] text-white border border-gray-700 font-extrabold text-lg hover:bg-gray-800 transition-colors">
              렌즈 대백과 보기
            </Link>
          </div>
        </div>
      </div>

      {/* 📰 하단: 실시간 뉴스 자동화 영역 */}
      <div className="w-full max-w-7xl px-6 z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-end justify-between mb-8 border-b border-gray-800 pb-4">
          <div>
            <span className="text-yellow-500 font-bold text-xs tracking-wider uppercase mb-1 block flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Latest Updates
            </span>
            <h2 className="text-3xl font-extrabold text-white">글로벌 최신 뉴스</h2>
          </div>
          <a href="https://petapixel.com" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            PetaPixel 전체보기 <span className="text-lg">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.length > 0 ? (
            newsItems.map((news: any, index: number) => {
              // HTML 태그가 섞인 내용에서 순수 텍스트만 뽑아내기 위한 처리
              const cleanDescription = news.description.replace(/<[^>]+>/g, '').slice(0, 100) + '...';
              // 날짜 포맷팅 (YYYY. MM. DD.)
              const pubDate = new Date(news.pubDate).toLocaleDateString('ko-KR');

              return (
                <a key={index} href={news.link} target="_blank" rel="noreferrer" className="bg-[#1c1c1c] border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 shadow-lg">
                  {/* 뉴스 썸네일 */}
                  <div className="h-48 overflow-hidden relative bg-gray-900">
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded z-10">PetaPixel</span>
                    <img
                      src={news.thumbnail || 'https://placehold.co/600x400/1f2937/ffffff.png?text=Camera+News'}
                      alt="News Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* 뉴스 텍스트 */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-extrabold text-white leading-snug mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {cleanDescription}
                    </p>
                    <div className="text-xs text-gray-500 font-medium">
                      {pubDate}
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-20 text-gray-500 bg-[#1c1c1c] rounded-3xl border border-gray-800">
              현재 뉴스를 불러오고 있습니다... 📡
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
