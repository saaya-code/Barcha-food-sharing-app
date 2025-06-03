import { render, screen } from '@testing-library/react'
import FAQPage from '../app/faq/page'

describe('FAQPage', () => {
  it('should render the page title', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument()
    expect(screen.getByText(/faq/i)).toBeInTheDocument()
  })

  it('should display food safety information', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/food safety/i)).toBeInTheDocument()
    expect(screen.getByText(/safety guidelines/i)).toBeInTheDocument()
  })

  it('should show how to use the platform', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/how.*work/i)).toBeInTheDocument()
    expect(screen.getByText(/donate.*food/i)).toBeInTheDocument()
    expect(screen.getByText(/request.*food/i)).toBeInTheDocument()
  })

  it('should provide contact information', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/contact/i)).toBeInTheDocument()
    expect(screen.getByText(/support/i)).toBeInTheDocument()
  })

  it('should explain the platform mission', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/mission/i)).toBeInTheDocument()
    expect(screen.getByText(/food waste/i)).toBeInTheDocument()
    expect(screen.getByText(/community/i)).toBeInTheDocument()
  })

  it('should have proper accessibility structure', () => {
    render(<FAQPage />)
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(1)
    
    // Should have main content area
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should display terms and guidelines', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/terms/i)).toBeInTheDocument()
    expect(screen.getByText(/guidelines/i)).toBeInTheDocument()
    expect(screen.getByText(/responsible/i)).toBeInTheDocument()
  })

  it('should explain food categories and types', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/types.*food/i)).toBeInTheDocument()
    expect(screen.getByText(/categories/i)).toBeInTheDocument()
  })

  it('should provide troubleshooting information', () => {
    render(<FAQPage />)
    
    expect(screen.getByText(/problem|issue|trouble/i)).toBeInTheDocument()
    expect(screen.getByText(/help/i)).toBeInTheDocument()
  })

  it('should have proper navigation back to other pages', () => {
    render(<FAQPage />)
    
    // Should have links back to main sections
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse/i })).toBeInTheDocument()
  })
})
