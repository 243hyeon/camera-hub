import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '3';
    const lang = searchParams.get('lang') || 'KR';

    try {
        // 1. PetaPixel에서 원본 영어 뉴스 가져오기
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://petapixel.com/feed/', {
            next: { revalidate: 3600 }
        });
        const data = await res.json();
        let items = data.items.slice(0, parseInt(limit, 10));

        // 2. 한국어(KR) 모드일 때만 DeepL API로 번역 시도!
        if (lang === 'KR' && process.env.DEEPL_API_KEY) {
            const authKey = process.env.DEEPL_API_KEY;
            const isFreeAPI = authKey.endsWith(':fx');
            const deepLUrl = isFreeAPI ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

            // 제목과 내용(HTML 태그 제거)을 번역기로 보낼 준비
            const textsToTranslate = items.flatMap((item: any) => [
                item.title,
                item.description.replace(/<[^>]+>/g, '').slice(0, 150)
            ]);

            const translateRes = await fetch(deepLUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `DeepL-Auth-Key ${authKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textsToTranslate,
                    target_lang: 'KO',
                }),
            });

            if (translateRes.ok) {
                const translatedData = await translateRes.json();
                const translations = translatedData.translations;

                // 번역된 텍스트를 다시 뉴스 기사에 예쁘게 덮어쓰기
                items = items.map((item: any, index: number) => ({
                    ...item,
                    title: translations[index * 2].text,
                    description: translations[index * 2 + 1].text + '...',
                }));
            }
        } else {
            // 영어(EN) 모드일 때는 번역 없이 HTML 태그만 깔끔하게 제거
            items = items.map((item: any) => ({
                ...item,
                description: item.description.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
            }));
        }

        return NextResponse.json({ items });
    } catch (error) {
        console.error('뉴스 API 에러:', error);
        return NextResponse.json({ items: [] }, { status: 500 });
    }
}
