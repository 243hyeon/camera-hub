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

        // 🌟 [핵심 수정] 썸네일 이미지를 본문(content)을 뒤져서 강제로 찾아냅니다!
        items = items.map((item: any) => {
            let realThumbnail = item.thumbnail;

            // thumbnail이 비어있다면 enclosure 링크 확인
            if (!realThumbnail && item.enclosure?.link) {
                realThumbnail = item.enclosure.link;
            }
            // 그래도 없다면 본문(content)에 있는 첫 번째 <img src="..."> 태그를 정규식으로 추출!
            if (!realThumbnail && item.content) {
                const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) realThumbnail = imgMatch[1];
            }

            return {
                ...item,
                thumbnail: realThumbnail, // 👈 끈질기게 찾아낸 진짜 이미지를 덮어씌웁니다.
                cleanDesc: item.description ? item.description.replace(/<[^>]+>/g, '').slice(0, 150) : ''
            };
        });

        // 2. 한국어(KR) 모드일 때만 DeepL API로 번역 시도!
        if (lang === 'KR' && process.env.DEEPL_API_KEY) {
            const authKey = process.env.DEEPL_API_KEY;
            const isFreeAPI = authKey.endsWith(':fx');
            const deepLUrl = isFreeAPI ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

            const textsToTranslate = items.flatMap((item: any) => [
                item.title,
                item.cleanDesc // 태그가 제거된 깨끗한 텍스트
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

                items = items.map((item: any, index: number) => ({
                    ...item,
                    title: translations[index * 2].text,
                    description: translations[index * 2 + 1].text + '...',
                }));
            } else {
                items = items.map((item: any) => ({
                    ...item,
                    description: item.cleanDesc + '...'
                }));
            }
        } else {
            // 영어(EN) 모드일 때는 번역 없이 진행
            items = items.map((item: any) => ({
                ...item,
                description: item.cleanDesc + '...'
            }));
        }

        return NextResponse.json({ items });
    } catch (error) {
        console.error('뉴스 API 에러:', error);
        return NextResponse.json({ items: [] }, { status: 500 });
    }
}
