import Link from 'next/link';

// PetaPixel에서 더 많은(12개) 뉴스를 가져옵니다!
async function getFullGlobalNews() {
    try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://petapixel.com/feed/', {
            next: { revalidate: 3600 }
        });
        const data = await res.json();
        return data.items.slice(0, 12); // 최신 기사 12개를 가져옵니다.
    } catch (error) {
        console.error('뉴스 연동 실패:', error);
        return [];
    }
}

export default async function NewsPage() {
    const newsItems = await getFullGlobalNews();

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-10 relative pb-32 animate-fade-in-up">

            {/* 타이틀 영역 */}
            <div className="mb-12 border-b border-gray-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-blue-500 font-black tracking-[0.2em] uppercase text-sm mb-2 block">Global Camera Insight</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">글로벌 최신 뉴스</h1>
                    <p className="text-gray-400 mt-4 text-lg">PetaPixel 등 세계 최고의 카메라 매체에서 방금 올라온 소식들을 확인하세요.</p>
                </div>

                {/* 추후 번역 API 연동 시 사용할 '자동 번역' UI 디자인 */}
                <div className="flex items-center gap-3 bg-[#1c1c1c] border border-gray-800 px-5 py-3 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-300">한국어 AI 번역 준비 중</span>
                </div>
            </div>

            {/* 뉴스 그리드 (4단으로 시원하게 배치) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newsItems.length > 0 ? (
                    newsItems.map((news: any, index: number) => {
                        const cleanDescription = news.description.replace(/<[^>]+>/g, '').slice(0, 90) + '...';
                        const pubDate = new Date(news.pubDate).toLocaleDateString('ko-KR');

                        return (
                            <a key={index} href={news.link} target="_blank" rel="noreferrer" className="bg-[#1c1c1c] border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full hover:-translate-y-2 shadow-xl">
                                {/* 썸네일 */}
                                <div className="h-40 overflow-hidden relative bg-gray-900">
                                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded z-10 border border-gray-700">PetaPixel</span>
                                    <img
                                        src={news.thumbnail || 'https://placehold.co/600x400/1f2937/ffffff.png?text=News'}
                                        alt="News Thumbnail"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                {/* 텍스트 내용 */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-base font-extrabold text-white leading-snug mb-3 line-clamp-3 group-hover:text-blue-400 transition-colors">
                                        {news.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                                        {cleanDescription}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800/50">
                                        <span className="text-xs text-gray-500 font-medium">{pubDate}</span>
                                        <span className="text-xs text-blue-500 font-bold group-hover:translate-x-1 transition-transform">원문 보기 →</span>
                                    </div>
                                </div>
                            </a>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-32 text-gray-500 bg-[#1c1c1c] rounded-3xl border border-gray-800 text-lg">
                        해외 뉴스를 수신하고 있습니다... 📡
                    </div>
                )}
            </div>

        </div>
    );
}
