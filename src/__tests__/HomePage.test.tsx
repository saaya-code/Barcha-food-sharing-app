import { render, screen } from '@testing-library/react'
import HomePage from '../app/page'

// Mock the components
jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>
  }
})

jest.mock('../components/SearchFilters', () => {
  return function MockSearchFilters() {
    return <div data-testid="search-filters">Search Filters</div>
  }
})

jest.mock('../components/FoodCard', () => {
  return function MockFoodCard({ item }: { item: any }) {
    return <div data-testid="food-card">{item.title}</div>
  }
})

jest.mock('../components/TopDonors', () => {
  return function MockTopDonors() {
    return <div data-testid="top-donors">Top Donors</div>
  }
})

describe('HomePage', () => {
  it('should render the main hero section', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/share surplus food/i)).toBeInTheDocument()
    expect(screen.getByText(/reduce waste/i)).toBeInTheDocument()
  })

  it('should render all main components', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('search-filters')).toBeInTheDocument()
    expect(screen.getByTestId('top-donors')).toBeInTheDocument()
  })

  it('should display food cards', () => {
    render(<HomePage />)
    
    const foodCards = screen.getAllByTestId('food-card')
    expect(foodCards.length).toBeGreaterThan(0)
  })

  it('should show the app mission', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/connect donors with people in need/i)).toBeInTheDocument()
  })

  it('should have proper page structure', () => {
    render(<HomePage />)
    
    // Check for main sections
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText(/available food items/i)).toBeInTheDocument()
  })

  it('should render call-to-action buttons', () => {
    render(<HomePage />)
    
    expect(screen.getByRole('link', { name: /browse all food/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add food item/i })).toBeInTheDocument()
  })

  it('should display statistics or highlights', () => {
    render(<HomePage />)
    
    // Look for any statistical information or highlights
    expect(screen.getByText(/community/i)).toBeInTheDocument()
  })
})
