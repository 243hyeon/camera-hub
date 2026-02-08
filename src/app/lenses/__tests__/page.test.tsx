import { render, screen, fireEvent } from '@testing-library/react'
import LensesPage from '../page'

describe('Lenses Page', () => {
    it('렌즈 브랜드(캐논, 니콘, 소니) 필터 버튼이 있어야 한다', () => {
        render(<LensesPage />)

        expect(screen.getByRole('button', { name: /캐논/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /니콘/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /소니/i })).toBeInTheDocument()
    })

    it('브랜드 선택 시 해당 브랜드의 렌즈 목록이 등급별로 표시되어야 한다', () => {
        render(<LensesPage />)

        // 소니 버튼 클릭
        const sonyButton = screen.getByRole('button', { name: /소니/i })
        fireEvent.click(sonyButton)

        // 소니 렌즈 모델 확인 (예시 모델)
        expect(screen.getByText(/FE 24-70mm F2.8 GM II/i)).toBeInTheDocument()

        // 등급 정보 확인 (GM, G, standard 등)
        expect(screen.getByText(/G Master/i)).toBeInTheDocument()
    })
})
