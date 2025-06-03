import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('Header', () => {
  it('should render the app logo and name', () => {
    render(<Header />)
    
    expect(screen.getByText('Barsha')).toBeInTheDocument()
    expect(screen.getByText('🌾')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add item/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument()
  })

  it('should show login button when not authenticated', () => {
    render(<Header />)
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should show user menu when authenticated', () => {
    render(<Header isAuthenticated={true} userName="John Doe" />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument()
  })

  it('should handle mobile menu toggle', () => {
    render(<Header />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeInTheDocument()
    
    // Initially mobile menu should be closed
    expect(screen.queryByRole('navigation')).toHaveClass('hidden')
    
    fireEvent.click(menuButton)
    
    // After clicking, mobile menu should be visible
    expect(screen.queryByRole('navigation')).not.toHaveClass('hidden')
  })

  it('should display correct navigation structure', () => {
    render(<Header />)
    
    const homeLink = screen.getByRole('link', { name: /home/i })
    const browseLink = screen.getByRole('link', { name: /browse/i })
    const addItemLink = screen.getByRole('link', { name: /add item/i })
    const faqLink = screen.getByRole('link', { name: /faq/i })
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(browseLink).toHaveAttribute('href', '/browse')
    expect(addItemLink).toHaveAttribute('href', '/add-item')
    expect(faqLink).toHaveAttribute('href', '/faq')
  })

  it('should show logout option in user menu when authenticated', () => {
    const mockOnLogout = jest.fn()
    render(<Header isAuthenticated={true} userName="John Doe" onLogout={mockOnLogout} />)
    
    const userMenuButton = screen.getByRole('button', { name: /john doe/i })
    fireEvent.click(userMenuButton)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()
    
    fireEvent.click(logoutButton)
    expect(mockOnLogout).toHaveBeenCalled()
  })
})
