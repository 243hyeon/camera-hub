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
        weight: number // grams
        price: number  // KRW (approximate)
    }
    status: '신규' | '단종'
    imageUrl?: string
}

export const dummyCameras: Camera[] = [
    // 소니 (Sony)
    {
        id: 1, brand: '소니', model: 'α1', tier: '고급기',
        description: '압도적인 5,010만 화소와 30fps 고속 연사력을 갖춘 플래그십 미러리스',
        specs: { sensor: '35mm 풀프레임 Exmor RS', resolution: '5010만 화소', mount: 'E-마운트', weight: 737, price: 8490000 },
        status: '신규',
        imageUrl: '/images/cameras/sony-a1.jpg'
    },
    {
        id: 2, brand: '소니', model: 'α9 III', tier: '고급기',
        description: '세계 최초 글로벌 셔터를 탑재하여 왜곡 없는 초고속 촬영이 가능한 스포츠 특화기',
        specs: { sensor: '35mm 풀프레임 글로벌 셔터', resolution: '2460만 화소', mount: 'E-마운트', weight: 702, price: 7980000 },
        status: '신규',
        imageUrl: '/images/cameras/sony-a9iii.jpg'
    },
    {
        id: 3, brand: '소니', model: 'α7R V', tier: '고급기',
        description: '6,100만 화소의 초고해상도와 AI 프로세싱 유닛을 통한 강력한 피사체 인식 AF',
        specs: { sensor: '35mm 풀프레임 Exmor R', resolution: '6100만 화소', mount: 'E-마운트', weight: 723, price: 5290000 },
        status: '신규',
        imageUrl: '/images/cameras/sony-a7rv.jpg'
    },
    {
        id: 4, brand: '소니', model: 'α7 IV', tier: '중급기',
        description: '사진과 영상 모두에서 최상의 퍼포먼스를 보여주는 스탠다드 풀프레임',
        specs: { sensor: '35mm 풀프레임 Exmor R', resolution: '3300만 화소', mount: 'E-마운트', weight: 658, price: 3090000 },
        status: '신규',
        imageUrl: '/images/cameras/sony-a7m4.jpg'
    },
    {
        id: 5, brand: '소니', model: 'α7C II', tier: '중급기',
        description: '컴팩트한 바디에 α7 IV의 성능을 담아낸 휴대성 극대화 풀프레임',
        specs: { sensor: '35mm 풀프레임 Exmor R', resolution: '3300만 화소', mount: 'E-마운트', weight: 514, price: 2690000 },
        status: '신규',
        imageUrl: '/images/cameras/sony-a7cii.jpg'
    },
    {
        id: 6, brand: '소니', model: 'ZV-E1', tier: '중급기',
        description: '영상 크리에이터를 위한 세계 최경량 풀프레임 브이로그 카메라',
        specs: { sensor: '35mm 풀프레임 Exmor R', resolution: '1210만 화소', mount: 'E-마운트', weight: 483, price: 2990000 },
        status: '신규',
        imageUrl: '/images/cameras/sony-zve1.jpg'
    },
    {
        id: 7, brand: '소니', model: 'ZV-E10 II', tier: '보급기',
        description: '더욱 업그레이드된 성능으로 찾아온 입문자용 브이로그 미러리스',
        specs: { sensor: 'APS-C Exmor R', resolution: '2600만 화소', mount: 'E-마운트', weight: 377, price: 1190000 },
        status: '신규',
        imageUrl: '/images/cameras/sony-zve10ii.jpg'
    },

    // 캐논 (Canon)
    {
        id: 10, brand: '캐논', model: 'EOS R1', tier: '고급기',
        description: '캐논 광학 기술의 정점, 상상을 초월하는 속도와 신뢰성의 플래그십',
        specs: { sensor: '35mm 풀프레임 적층형', resolution: '2420만 화소', mount: 'RF-마운트', weight: 1115, price: 9290000 },
        status: '신규',
        imageUrl: '/images/cameras/canon-eos-r1.jpg'
    },
    {
        id: 11, brand: '캐논', model: 'EOS R3', tier: '고급기',
        description: '시선 제어 AF 탑재, 전문가를 위한 고속 고감도 마스터피스',
        specs: { sensor: '35mm 풀프레임 적층형', resolution: '2410만 화소', mount: 'RF-마운트', weight: 1015, price: 7390000 },
        status: '신규',
        imageUrl: '/images/cameras/canon-eos-r3.jpg'
    },
    {
        id: 12, brand: '캐논', model: 'EOS R5 II', tier: '고급기',
        description: '4,500만 화소와 8K 영상, 한계를 뛰어넘는 고사양 올라운더',
        specs: { sensor: '35mm 풀프레임 적층형', resolution: '4500만 화소', mount: 'RF-마운트', weight: 746, price: 5490000 },
        status: '신규',
        imageUrl: '/images/cameras/canon-eos-r5ii.jpg'
    },
    {
        id: 13, brand: '캐논', model: 'EOS R6 Mark II', tier: '중급기',
        description: '진화한 AF와 연사 성능, 어떤 상황에서도 신뢰할 수 있는 하이엔드 바디',
        specs: { sensor: '35mm 풀프레임 CMOS', resolution: '2420만 화소', mount: 'RF-마운트', weight: 670, price: 3190000 },
        status: '신규',
        imageUrl: '/images/cameras/canon-eos-r6ii.jpg'
    },
    {
        id: 14, brand: '캐논', model: 'EOS R8', tier: '보급기',
        description: '풀프레임의 감동을 가볍게, 압도적인 가성비의 입문형 풀프레임',
        specs: { sensor: '35mm 풀프레임 CMOS', resolution: '2420만 화소', mount: 'RF-마운트', weight: 461, price: 1890000 },
        status: '신규',
        imageUrl: '/images/cameras/canon-eos-r8.jpg'
    },
    {
        id: 15, brand: '캐논', model: 'EOS R50', tier: '보급기',
        description: '작고 가벼운 바디에 담긴 캐논의 스마트한 촬영 성능',
        specs: { sensor: 'APS-C CMOS', resolution: '2420만 화소', mount: 'RF-마운트', weight: 375, price: 890000 },
        status: '신규',
        imageUrl: '/images/cameras/canon-eos-r50.jpg'
    },

    // 니콘 (Nikon)
    {
        id: 20, brand: '니콘', model: 'Z9', tier: '고급기',
        description: '기계식 셔터를 제거한 혁신, 압도적 신뢰성의 플래그십 미러리스',
        specs: { sensor: '35mm 풀프레임 적층형', resolution: '4571만 화소', mount: 'Z-마운트', weight: 1340, price: 7980000 },
        status: '신규',
        imageUrl: '/images/cameras/nikon-z9.jpg'
    },
    {
        id: 21, brand: '니콘', model: 'Z8', tier: '고급기',
        description: 'Z9의 성능을 그대로 소형화한 하이엔드 콤팩트 플래그십',
        specs: { sensor: '35mm 풀프레임 적층형', resolution: '4571만 화소', mount: 'Z-마운트', weight: 910, price: 5280000 },
        status: '신규',
        imageUrl: '/images/cameras/nikon-z8.jpg'
    },
    {
        id: 22, brand: '니콘', model: 'Zf', tier: '중급기',
        description: '클래식한 디자인 속에 담긴 최신 풀프레임 테크놀로지',
        specs: { sensor: '35mm 풀프레임 CMOS', resolution: '2450만 화소', mount: 'Z-마운트', weight: 710, price: 2880000 },
        status: '신규',
        imageUrl: '/images/cameras/nikon-zf.jpg'
    },
    {
        id: 23, brand: '니콘', model: 'Z6 III', tier: '중급기',
        description: '세계 최초 부분 적층형 센서 탑재, 독보적인 영상 성능과 기동성',
        specs: { sensor: '35mm 풀프레임 부분적층형', resolution: '2450만 화소', mount: 'Z-마운트', weight: 760, price: 3480000 },
        status: '신규',
        imageUrl: '/images/cameras/nikon-z6iii.jpg'
    },
    {
        id: 24, brand: '니콘', model: 'Z7 II', tier: '고급기',
        description: '초고해상도 풍경과 디테일 촬영에 최적화된 고화소 바디',
        specs: { sensor: '35mm 풀프레임 CMOS', resolution: '4575만 화소', mount: 'Z-마운트', weight: 705, price: 3680000 },
        status: '신규',
        imageUrl: '/images/cameras/nikon-z7ii.jpg'
    },
    {
        id: 25, brand: '니콘', model: 'Zfc', tier: '보급기',
        description: '감성적인 헤리티지 디자인의 입문자용 APS-C 미러리스',
        specs: { sensor: 'APS-C CMOS', resolution: '2088만 화소', mount: 'Z-마운트', weight: 445, price: 1180000 },
        status: '신규',
        imageUrl: '/images/cameras/nikon-zfc.jpg'
    },
]
