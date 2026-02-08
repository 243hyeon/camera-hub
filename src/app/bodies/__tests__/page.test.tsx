import { render, screen, fireEvent } from '@testing-library/react'
import BodiesPage from '../page'

describe('Bodies Page', () => {
    it('카메라 브랜드(캐논, 니콘, 소니) 필터 버튼이 있어야 한다', () => {
        render(<BodiesPage />)

        expect(screen.getByRole('button', { name: /캐논/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /니콘/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /소니/i })).toBeInTheDocument()
    })

    it('페이지 제목으로 "카메라 바디"가 표시되어야 한다', () => {
        render(<BodiesPage />)
        expect(screen.getByText(/카메라 바디/i)).toBeInTheDocument()
    })

    it('브랜드 선택 시 해당 브랜드의 카메라 목록이 티어별로 표시되어야 한다', () => {
        render(<BodiesPage />)

        // 소니 버튼 클릭
        const sonyButton = screen.getByRole('button', { name: /소니/i })
        fireEvent.click(sonyButton)

        // 소니 카메라 모델 확인
        expect(screen.getByText(/α7 IV/i)).toBeInTheDocument()
        expect(screen.getByText(/α1/i)).toBeInTheDocument()

        // 티어 정보 확인
        expect(screen.getByText(/고급기/i)).toBeInTheDocument()
        expect(screen.getByText(/중급기/i)).toBeInTheDocument()
        expect(screen.getByText(/보급기/i)).toBeInTheDocument()
    })

    it('카메라 클릭 시 상세 페이지로 이동하는 링크가 있어야 한다', () => {
        render(<BodiesPage />)
        fireEvent.click(screen.getByRole('button', { name: /소니/i }))

        const cameraLink = screen.getByRole('link', { name: /α7 IV/i })
        expect(cameraLink).toHaveAttribute('href', expect.stringMatching(/\/bodies\/.+/))
    })
})
