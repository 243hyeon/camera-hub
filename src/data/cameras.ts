export interface Camera {
    id: number
    brand: string
    model: string
    tier: '보급기' | '중급기' | '고급기'
    description: string
    specs: {
        sensor: string
        resolution: string
        mount: string
    }
    status: '신규' | '단종'
    imageUrl?: string
}

export const dummyCameras: Camera[] = [
    {
        id: 1, brand: '소니', model: 'α1', tier: '고급기',
        description: '플래그십 풀프레임 미러리스',
        specs: { sensor: '풀프레임', resolution: '5010만 화소', mount: 'E-마운트' },
        status: '신규'
    },
    {
        id: 2, brand: '소니', model: 'α7 IV', tier: '중급기',
        description: '올라운더 풀프레임 미러리스',
        specs: { sensor: '풀프레임', resolution: '3300만 화소', mount: 'E-마운트' },
        status: '신규'
    },
    {
        id: 3, brand: '소니', model: 'ZV-E10 II', tier: '보급기',
        description: '브이로그 최적화 미러리스',
        specs: { sensor: 'APS-C', resolution: '2600만 화소', mount: 'E-마운트' },
        status: '신규'
    },
    {
        id: 4, brand: '캐논', model: 'EOS R3', tier: '고급기',
        description: '고성능 스포츠 촬영용',
        specs: { sensor: '풀프레임', resolution: '2410만 화소', mount: 'RF-마운트' },
        status: '신규'
    },
    {
        id: 5, brand: '캐논', model: 'EOS R6 Mark II', tier: '중급기',
        description: '다목적 고성능 미러리스',
        specs: { sensor: '풀프레임', resolution: '2420만 화소', mount: 'RF-마운트' },
        status: '신규'
    },
    {
        id: 6, brand: '캐논', model: 'EOS R50', tier: '보급기',
        description: '입문용 가벼운 미러리스',
        specs: { sensor: 'APS-C', resolution: '2420만 화소', mount: 'RF-마운트' },
        status: '신규'
    },
    {
        id: 7, brand: '니콘', model: 'Z9', tier: '고급기',
        description: '플래그십 무소음 미러리스',
        specs: { sensor: '풀프레임', resolution: '4571만 화소', mount: 'Z-마운트' },
        status: '신규'
    },
    {
        id: 8, brand: '니콘', model: 'Z6 III', tier: '중급기',
        description: '중급형 고속 촬영 미러리스',
        specs: { sensor: '풀프레임', resolution: '2450만 화소', mount: 'Z-마운트' },
        status: '신규'
    },
    {
        id: 9, brand: '니콘', model: 'Z30', tier: '보급기',
        description: '입문용 브이로그 카메라',
        specs: { sensor: 'APS-C', resolution: '2088만 화소', mount: 'Z-마운트' },
        status: '신규'
    },
]
