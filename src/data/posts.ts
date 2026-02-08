export interface Post {
    id: number
    title: string
    author: string
    content: string
    createdAt: string
    views: number
}

export const dummyPosts: Post[] = [
    {
        id: 1,
        title: '오늘 찍은 노을 사진 공유합니다',
        author: '포토그래퍼',
        content: '날씨가 너무 좋아서 한 컷 찍어봤습니다. 소니 a7m4 + 2470GM2 조합입니다.',
        createdAt: '2024-02-08',
        views: 124
    },
    {
        id: 2,
        title: '입문용 풀프레임 바디 추천 부탁드려요',
        author: '뉴비',
        content: '캐논 R8이랑 소니 a7c2 중에 고민 중인데 어떤 게 나을까요?',
        createdAt: '2024-02-07',
        views: 89
    },
    {
        id: 3,
        title: '렌즈 핀 교정은 어디서 하나요?',
        author: '니콘유저',
        content: '서울 근처에 잘 하는 곳 아시는 분 계신가요?',
        createdAt: '2024-02-06',
        views: 45
    }
]
