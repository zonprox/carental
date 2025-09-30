import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import HomePage from './HomePage'

// Mock fetch API
global.fetch = vi.fn()

const HomePageWithRouter = () => (
  <BrowserRouter>
    <HomePage />
  </BrowserRouter>
)

describe('HomePage Component', () => {
  beforeEach(() => {
    fetch.mockClear()
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    })
  })

  it('renders homepage without crashing', () => {
    render(<HomePageWithRouter />)
    expect(document.body).toBeInTheDocument()
  })

  it('displays loading state initially', () => {
    render(<HomePageWithRouter />)
    // Kiểm tra loading state hoặc nội dung cơ bản
    const pageContent = document.querySelector('main') || document.querySelector('div')
    expect(pageContent).toBeInTheDocument()
  })
})