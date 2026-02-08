import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

describe('Navbar', () => {
    it('상단 네비게이션 바에 필수 링크들이 포함되어 있어야 한다', () => {
        render(<Navbar />)

        const links = [
            { name: '뉴스', href: '/news' },
            { name: '바디', href: '/bodies' },
            { name: '렌즈', href: '/lenses' },
            { name: '사진 강의', href: '/lectures' },
            { name: '커뮤니티', href: '/community' },
        ]

        links.forEach((link) => {
            const element = screen.getByRole('link', { name: link.name })
            expect(element).toBeInTheDocument()
            expect(element).toHaveAttribute('href', link.href)
        })
    })
})
