import { render, screen, fireEvent } from '@testing-library/react'
import SearchFilters from '../components/SearchFilters'

describe('SearchFilters', () => {
  const mockOnSearchChange = jest.fn()
  const mockOnCategoryChange = jest.fn()
  const mockOnLocationChange = jest.fn()
  const mockOnExpiryChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const defaultProps = {
    searchQuery: '',
    selectedCategory: '',
    selectedLocation: '',
    selectedExpiry: '',
    onSearchChange: mockOnSearchChange,
    onCategoryChange: mockOnCategoryChange,
    onLocationChange: mockOnLocationChange,
    onExpiryChange: mockOnExpiryChange,
  }

  it('should render all filter controls', () => {
    render(<SearchFilters {...defaultProps} />)
    
    expect(screen.getByPlaceholderText(/search food/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Locations')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Any Time')).toBeInTheDocument()
  })

  it('should handle search input changes', () => {
    render(<SearchFilters {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search food/i)
    fireEvent.change(searchInput, { target: { value: 'bread' } })
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('bread')
  })

  it('should handle category selection', () => {
    render(<SearchFilters {...defaultProps} />)
    
    const categorySelect = screen.getByDisplayValue('All Categories')
    fireEvent.change(categorySelect, { target: { value: 'bread' } })
    
    expect(mockOnCategoryChange).toHaveBeenCalledWith('bread')
  })

  it('should handle location selection', () => {
    render(<SearchFilters {...defaultProps} />)
    
    const locationSelect = screen.getByDisplayValue('All Locations')
    fireEvent.change(locationSelect, { target: { value: 'Tunis' } })
    
    expect(mockOnLocationChange).toHaveBeenCalledWith('Tunis')
  })

  it('should handle expiry filter selection', () => {
    render(<SearchFilters {...defaultProps} />)
    
    const expirySelect = screen.getByDisplayValue('Any Time')
    fireEvent.change(expirySelect, { target: { value: 'today' } })
    
    expect(mockOnExpiryChange).toHaveBeenCalledWith('today')
  })

  it('should display current filter values', () => {
    render(
      <SearchFilters 
        {...defaultProps}
        searchQuery="couscous"
        selectedCategory="cooked-meals"
        selectedLocation="Sfax"
        selectedExpiry="today"
      />
    )
    
    expect(screen.getByDisplayValue('couscous')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cooked Meals')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sfax')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Expiring Today')).toBeInTheDocument()
  })

  it('should render all food category options', () => {
    render(<SearchFilters {...defaultProps} />)
    
    const categorySelect = screen.getByDisplayValue('All Categories')
    
    // Check that options exist
    expect(categorySelect.children).toHaveLength(9) // All categories + "All Categories" option
  })

  it('should show clear filters option when filters are applied', () => {
    render(
      <SearchFilters 
        {...defaultProps}
        searchQuery="bread"
        selectedCategory="bread"
      />
    )
    
    const clearButton = screen.queryByRole('button', { name: /clear/i })
    expect(clearButton).toBeInTheDocument()
  })

  it('should handle clear filters action', () => {
    const mockOnClear = jest.fn()
    render(
      <SearchFilters 
        {...defaultProps}
        searchQuery="bread"
        onClear={mockOnClear}
      />
    )
    
    const clearButton = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearButton)
    
    expect(mockOnClear).toHaveBeenCalled()
  })
})
