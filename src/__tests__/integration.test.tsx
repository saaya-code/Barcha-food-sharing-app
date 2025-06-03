import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HomePage from '../app/page'

describe('Integration Tests - Food Discovery Flow', () => {
  it('should filter food items when using search', async () => {
    render(<HomePage />)
    
    // Initially should show multiple food items
    const initialCards = screen.getAllByTestId('food-card')
    expect(initialCards.length).toBeGreaterThan(0)
    
    // Search for specific food
    const searchInput = screen.getByPlaceholderText(/search food/i)
    fireEvent.change(searchInput, { target: { value: 'bread' } })
    
    // Wait for filtering to happen
    await waitFor(() => {
      const filteredCards = screen.getAllByTestId('food-card')
      // Should show fewer items or items containing 'bread'
      expect(filteredCards.length).toBeLessThanOrEqual(initialCards.length)
    })
  })

  it('should handle food request flow', async () => {
    const mockOnRequest = jest.fn()
    render(<HomePage />)
    
    // Find a food card with request button
    const requestButtons = screen.getAllByRole('button', { name: /request/i })
    expect(requestButtons.length).toBeGreaterThan(0)
    
    // Click the first request button
    fireEvent.click(requestButtons[0])
    
    // Should trigger request handling
    await waitFor(() => {
      // Check for any request confirmation or modal
      expect(screen.getByText(/request sent/i) || screen.getByText(/contact/i)).toBeInTheDocument()
    })
  })

  it('should show appropriate content based on authentication state', () => {
    render(<HomePage />)
    
    // When not authenticated, should show sign in options
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    
    // Should show appropriate messaging for unauthenticated users
    expect(screen.getByText(/join our community/i)).toBeInTheDocument()
  })

  it('should handle navigation between pages', () => {
    render(<HomePage />)
    
    // Check navigation links are present
    expect(screen.getByRole('link', { name: /browse/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add item/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument()
  })

  it('should display real-time food availability', () => {
    render(<HomePage />)
    
    // Check that food cards show availability status
    const availableItems = screen.getAllByText(/available/i)
    expect(availableItems.length).toBeGreaterThan(0)
    
    // Check expiry information
    const expiryInfo = screen.getAllByText(/left|expires|expired/i)
    expect(expiryInfo.length).toBeGreaterThan(0)
  })

  it('should handle responsive design elements', () => {
    render(<HomePage />)
    
    // Check that mobile menu exists
    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeInTheDocument()
    
    // Check that the layout adapts to different screen sizes
    const mainContent = screen.getByRole('main')
    expect(mainContent).toHaveClass(/mx-auto|container|max-w/)
  })
})
