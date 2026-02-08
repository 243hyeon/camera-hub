import { render, screen } from '@testing-library/react'
import Page from '../page'

describe('Home Page', () => {
    it('최신 뉴스 섹션과 3개의 뉴스 아이템이 렌더링되어야 한다', () => {
        render(<Page />)

        // 섹션 제목 확인
        const sectionHeading = screen.getByText(/최신 뉴스/i)
        expect(sectionHeading).toBeInTheDocument()

        // 뉴스 아이템 개수 확인 (현재는 단순 텍스트나 아티클 태그로 가정)
        const newsItems = screen.getAllByRole('article')
        expect(newsItems).toHaveLength(3)

        // 시장 이슈 섹션 확인
        expect(screen.getByText(/카메라\/사진 시장 이슈/i)).toBeInTheDocument()

        // 카테고리 구분 확인
        expect(screen.getByText(/신제품 뉴스/i)).toBeInTheDocument()
        expect(screen.getByText(/하드웨어\/소프트웨어 이슈/i)).toBeInTheDocument()
    })
})
