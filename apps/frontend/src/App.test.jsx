import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
)

// Mock component để tránh lỗi routing trong test
const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<AppWithRouter />)
    // Kiểm tra xem app có render được không
    expect(document.body).toBeInTheDocument()
  })

  it('contains main application structure', () => {
    const { container } = render(<AppWithRouter />)
    // Kiểm tra cấu trúc cơ bản của app
    expect(container.firstChild).toBeInTheDocument()
  })
})