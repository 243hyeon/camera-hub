import { MetadataRoute } from 'next'
import { dummyCameras } from '@/data/cameras'
import { dummyLenses } from '@/data/lenses'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://camera-hub.vercel.app' // 예시 도메인

    // 기본 정적 페이지
    const staticPages = [
        '',
        '/news',
        '/bodies',
        '/lenses',
        '/lectures',
        '/community',
        '/ai-guide',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }))

    // 카메라 상세 페이지
    const cameraPages = dummyCameras.map((camera) => ({
        url: `${baseUrl}/bodies/${camera.id}`,
        lastModified: new Date(),
    }))

    // 렌즈 상세 페이지
    const lensPages = dummyLenses.map((lens) => ({
        url: `${baseUrl}/lenses/${lens.id}`,
        lastModified: new Date(),
    }))

    return [...staticPages, ...cameraPages, ...lensPages]
}
