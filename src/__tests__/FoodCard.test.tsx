import { render, screen, fireEvent } from '@testing-library/react'
import FoodCard from '../components/FoodCard'
import { mockFoodItems } from '../lib/mock-data'

describe('FoodCard', () => {
  const mockFoodItem = mockFoodItems[0]

  it('should render food item details', () => {
    render(<FoodCard item={mockFoodItem} />)
    
    expect(screen.getByText(mockFoodItem.title)).toBeInTheDocument()
    expect(screen.getByText(mockFoodItem.description)).toBeInTheDocument()
    expect(screen.getByText(mockFoodItem.location)).toBeInTheDocument()
    expect(screen.getByText(mockFoodItem.donorName)).toBeInTheDocument()
  })

  it('should display the correct category', () => {
    render(<FoodCard item={mockFoodItem} />)
    
    expect(screen.getByText('bread')).toBeInTheDocument()
  })

  it('should show expiry date', () => {
    render(<FoodCard item={mockFoodItem} />)
    
    expect(screen.getByText(/left/i)).toBeInTheDocument()
  })

  it('should handle request button click', () => {
    const mockOnRequest = jest.fn()
    render(<FoodCard item={mockFoodItem} onRequest={mockOnRequest} />)
    
    const requestButton = screen.getByRole('button', { name: /request/i })
    fireEvent.click(requestButton)
    
    expect(mockOnRequest).toHaveBeenCalledWith(mockFoodItem.id)
  })

  it('should show food image when provided', () => {
    const itemWithImage = { ...mockFoodItem, imageUrl: '/test-image.jpg' }
    render(<FoodCard item={itemWithImage} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src')
    expect(image).toHaveAttribute('alt', itemWithImage.title)
  })

  it('should show placeholder when no image provided', () => {
    const itemWithoutImage = { ...mockFoodItem, imageUrl: undefined }
    render(<FoodCard item={itemWithoutImage} />)
    
    expect(screen.getByText('No image')).toBeInTheDocument()
  })

  it('should display quantity when provided', () => {
    render(<FoodCard item={mockFoodItem} />)
    
    expect(screen.getByText(mockFoodItem.quantity)).toBeInTheDocument()
  })

  it('should show time posted', () => {
    render(<FoodCard item={mockFoodItem} />)
    
    expect(screen.getByText(/ago/)).toBeInTheDocument()
  })

  it('should apply correct styling for expired items', () => {
    const expiredItem = {
      ...mockFoodItem,
      expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    }
    render(<FoodCard item={expiredItem} />)
    
    const card = screen.getByTestId('food-card')
    expect(card).toHaveClass('opacity-60')
  })

  it('should show urgency indicator for items expiring soon', () => {
    const urgentItem = {
      ...mockFoodItem,
      expiryDate: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    }
    render(<FoodCard item={urgentItem} />)
    
    expect(screen.getByText(/soon/i)).toBeInTheDocument()
  })
})
