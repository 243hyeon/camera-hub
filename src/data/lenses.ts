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
        weight: number // grams
        price: number  // KRW
    }
    imageUrl?: string
}

export const dummyLenses: Lens[] = [
    // 소니 (Sony) - G Master
    {
        id: 1, brand: '소니', model: 'FE 24-70mm F2.8 GM II', grade: 'G Master',
        description: '압도적인 해상력과 더 가벼워진 무게로 돌아온 베스트셀러 표준 줌',
        specs: { focalLength: '24-70mm', aperture: 'F2.8', mount: 'E-마운트', weight: 695, price: 2890000 }
    },
    {
        id: 2, brand: '소니', model: 'FE 70-200mm F2.8 GM OSS II', grade: 'G Master',
        description: '동급 최경량 설계와 초고속 AF 성능을 갖춘 플래그십 망원 줌',
        specs: { focalLength: '70-200mm', aperture: 'F2.8', mount: 'E-마운트', weight: 1045, price: 3390000 }
    },
    {
        id: 3, brand: '소니', model: 'FE 50mm F1.2 GM', grade: 'G Master',
        description: 'F1.2의 밝은 조리개와 타의 추종을 불허하는 아름다운 배경 흐림',
        specs: { focalLength: '50mm', aperture: 'F1.2', mount: 'E-마운트', weight: 778, price: 2690000 }
    },
    {
        id: 4, brand: '소니', model: 'FE 16-35mm F2.8 GM II', grade: 'G Master',
        description: '풍경과 건축 촬영에 최적화된 고성능 초광각 줌 렌즈',
        specs: { focalLength: '16-35mm', aperture: 'F2.8', mount: 'E-마운트', weight: 547, price: 2990000 }
    },
    {
        id: 5, brand: '소니', model: 'FE 85mm F1.4 GM II', grade: 'G Master',
        description: '최상의 해상도와 부드러운 보케로 인물 사진의 정점을 찍는 렌즈',
        specs: { focalLength: '85mm', aperture: 'F1.4', mount: 'E-마운트', weight: 642, price: 2690000 }
    },

    // 캐논 (Canon) - L-series
    {
        id: 10, brand: '캐논', model: 'RF24-70mm F2.8 L IS USM', grade: 'L-series',
        description: '높은 묘사력과 강력한 손떨림 보정 기능을 갖춘 RF 굴지의 표준 줌',
        specs: { focalLength: '24-70mm', aperture: 'F2.8', mount: 'RF-마운트', weight: 900, price: 3290000 }
    },
    {
        id: 11, brand: '캐논', model: 'RF70-200mm F2.8 L IS USM', grade: 'L-series',
        description: '혁신적인 수납 기구로 기동성을 극대화한 컴팩트 망원 줌 렌즈',
        specs: { focalLength: '70-200mm', aperture: 'F2.8', mount: 'RF-마운트', weight: 1070, price: 3890000 }
    },
    {
        id: 12, brand: '캐논', model: 'RF50mm F1.2 L USM', grade: 'L-series',
        description: '압도적인 대구경 RF 마운트의 성능을 보여주는 단렌즈의 절대 강자',
        specs: { focalLength: '50mm', aperture: 'F1.2', mount: 'RF-마운트', weight: 950, price: 3090000 }
    },
    {
        id: 13, brand: '캐논', model: 'RF15-35mm F2.8 L IS USM', grade: 'L-series',
        description: '광각 15mm에서의 광활한 연출이 가능한 고성능 초광각 줌',
        specs: { focalLength: '15-35mm', aperture: 'F2.8', mount: 'RF-마운트', weight: 840, price: 3090000 }
    },
    {
        id: 14, brand: '캐논', model: 'RF85mm F1.2 L USM', grade: 'L-series',
        description: '인물 사진가를 위한 최고의 선택, 극적인 배경 흐림과 선명도',
        specs: { focalLength: '85mm', aperture: 'F1.2', mount: 'RF-마운트', weight: 1195, price: 3490000 }
    },
    {
        id: 15, brand: '캐논', model: 'RF24-105mm F4 L IS USM', grade: 'L-series',
        description: '다양한 환경에서 활용 가능한 최상의 전천후 줌 렌즈',
        specs: { focalLength: '24-105mm', aperture: 'F4', mount: 'RF-마운트', weight: 700, price: 1690000 }
    },

    // 니콘 (Nikkor) - S-line
    {
        id: 20, brand: '니콘', model: 'NIKKOR Z 24-70mm f/2.8 S', grade: 'S-line',
        description: 'Z 마운트의 대구경을 활용한 극강의 화질을 자랑하는 표준 줌',
        specs: { focalLength: '24-70mm', aperture: 'f/2.8', mount: 'Z-마운트', weight: 805, price: 2980000 }
    },
    {
        id: 21, brand: '니콘', model: 'NIKKOR Z 70-200mm f/2.8 VR S', grade: 'S-line',
        description: '탁월한 역광 내성과 동급 최상의 광학 성능을 갖춘 망원 줌',
        specs: { focalLength: '70-200mm', aperture: 'f/2.8', mount: 'Z-마운트', weight: 1360, price: 3480000 }
    },
    {
        id: 22, brand: '니콘', model: 'NIKKOR Z 50mm f/1.2 S', grade: 'S-line',
        description: '차원이 다른 심도 표현과 정교한 기구 설계의 하이엔드 단렌즈',
        specs: { focalLength: '50mm', aperture: 'f/1.2', mount: 'Z-마운트', weight: 1090, price: 2780000 }
    },
    {
        id: 23, brand: '니콘', model: 'NIKKOR Z 14-24mm f/2.8 S', grade: 'S-line',
        description: '필터 장착이 가능한 최경량 설계를 실현한 초광각 대구경 줌',
        specs: { focalLength: '14-24mm', aperture: 'f/2.8', mount: 'Z-마운트', weight: 650, price: 3080000 }
    },
    {
        id: 24, brand: '니콘', model: 'NIKKOR Z 85mm f/1.2 S', grade: 'S-line',
        description: '궁극의 아름다운 보케를 위한 니콘 광학 기술의 집약체',
        specs: { focalLength: '85mm', aperture: 'f/1.2', mount: 'Z-마운트', weight: 1160, price: 3480000 }
    },
    {
        id: 25, brand: '니콘', model: 'NIKKOR Z 24-120mm f/4 S', grade: 'S-line',
        description: '광활한 줌 배율과 편의성을 모두 잡은 여행용 최강 렌즈',
        specs: { focalLength: '24-120mm', aperture: 'f/4', mount: 'Z-마운트', weight: 630, price: 1480000 }
    },
]
