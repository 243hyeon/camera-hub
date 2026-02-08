export interface Lens {
    id: number
    brand: string
    model: string
    grade: string // e.g., 'G Master', 'L-series', 'S-line', 'Standard'
    description: string
    specs: {
        focalLength: string
        aperture: string
        mount: string
    }
    imageUrl?: string
}

export const dummyLenses: Lens[] = [
    {
        id: 1, brand: '소니', model: 'FE 24-70mm F2.8 GM II', grade: 'G Master',
        description: '최고의 화질과 소형 경량화를 실현한 표준 줌 렌즈',
        specs: { focalLength: '24-70mm', aperture: 'F2.8', mount: 'E-마운트' }
    },
    {
        id: 2, brand: '소니', model: 'FE 70-200mm F2.8 GM OSS II', grade: 'G Master',
        description: '압도적인 해상력과 AF 성능의 망원 줌 렌즈',
        specs: { focalLength: '70-200mm', aperture: 'F2.8', mount: 'E-마운트' }
    },
    {
        id: 3, brand: '캐논', model: 'RF24-70mm F2.8 L IS USM', grade: 'L-series',
        description: '높은 묘사력과 기동성을 갖춘 L 줌 렌즈',
        specs: { focalLength: '24-70mm', aperture: 'F2.8', mount: 'RF-마운트' }
    },
    {
        id: 4, brand: '니콘', model: 'NIKKOR Z 24-70mm f/2.8 S', grade: 'S-line',
        description: '높은 해상도와 아름다운 배경 흐림을 구현하는 S-Line 렌즈',
        specs: { focalLength: '24-70mm', aperture: 'f/2.8', mount: 'Z-마운트' }
    }
]
