import { render, screen } from '@testing-library/react'
import Page from '../page'

describe('Home Page Sanity Check', () => {
    it('renders fixed header text', () => {
        render(<Page />)
        const heading = screen.getByText(/To get started, edit the page.tsx file./i)
        expect(heading).toBeInTheDocument()
    })
})
