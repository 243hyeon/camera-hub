export interface News {
    id: number
    title: string
    category: '시장 이슈' | '신제품' | 'SW 이슈'
    summary?: string
    content?: string
    createdAt: string
}

export const dummyNews: News[] = [
    {
        id: 1,
        title: '소니, 새로운 풀프레임 미러리스 발표',
        category: '신제품',
        summary: '소니에서 차세대 풀프레임 미러리스 카메라 시스템을 발표했습니다.',
        createdAt: '2024-02-01'
    },
    {
        id: 2,
        title: '2024년 카메라 시장 전망 보고서',
        category: '시장 이슈',
        summary: '올해 카메라 시장은 전년 대비 5% 성장이 기대됩니다.',
        createdAt: '2024-02-03'
    },
    {
        id: 3,
        title: '렌즈 펌웨어 업데이트 안내',
        category: 'SW 이슈',
        summary: '주요 렌즈군에 대한 AF 성능 향상 펌웨어가 배포되었습니다.',
        createdAt: '2024-02-05'
    }
]
