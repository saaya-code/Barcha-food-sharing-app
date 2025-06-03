import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddItemPage from '../app/add-item/page'

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}))

describe('AddItemPage', () => {
  it('should render the form title', () => {
    render(<AddItemPage />)
    
    expect(screen.getByText(/add food item/i)).toBeInTheDocument()
    expect(screen.getByText(/share your surplus food/i)).toBeInTheDocument()
  })

  it('should render all required form fields', () => {
    render(<AddItemPage />)
    
    expect(screen.getByLabelText(/food title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/food type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/donor name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contact/i)).toBeInTheDocument()
  })

  it('should have food category options', () => {
    render(<AddItemPage />)
    
    const categorySelect = screen.getByLabelText(/food type/i)
    expect(categorySelect).toBeInTheDocument()
    
    // Check that it has multiple options
    const options = categorySelect.querySelectorAll('option')
    expect(options.length).toBeGreaterThan(1)
  })

  it('should handle form input changes', () => {
    render(<AddItemPage />)
    
    const titleInput = screen.getByLabelText(/food title/i)
    fireEvent.change(titleInput, { target: { value: 'Fresh Bread' } })
    
    expect(titleInput).toHaveValue('Fresh Bread')
  })

  it('should handle form submission', async () => {
    render(<AddItemPage />)
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/food title/i), { 
      target: { value: 'Test Food' } 
    })
    fireEvent.change(screen.getByLabelText(/description/i), { 
      target: { value: 'Test description' } 
    })
    fireEvent.change(screen.getByLabelText(/quantity/i), { 
      target: { value: '5 portions' } 
    })
    fireEvent.change(screen.getByLabelText(/location/i), { 
      target: { value: 'Tunis' } 
    })
    fireEvent.change(screen.getByLabelText(/donor name/i), { 
      target: { value: 'John Doe' } 
    })
    fireEvent.change(screen.getByLabelText(/contact/i), { 
      target: { value: '+216 20 123 456' } 
    })

    const submitButton = screen.getByRole('button', { name: /add food item/i })
    fireEvent.click(submitButton)

    // Form should be processing
    await waitFor(() => {
      expect(screen.getByText(/adding/i)).toBeInTheDocument()
    })
  })

  it('should validate required fields', async () => {
    render(<AddItemPage />)
    
    const submitButton = screen.getByRole('button', { name: /add food item/i })
    fireEvent.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument()
    })
  })

  it('should have image upload functionality', () => {
    render(<AddItemPage />)
    
    const imageInput = screen.getByLabelText(/photo/i)
    expect(imageInput).toBeInTheDocument()
    expect(imageInput).toHaveAttribute('type', 'file')
  })

  it('should show pickup instructions field', () => {
    render(<AddItemPage />)
    
    expect(screen.getByLabelText(/pickup instructions/i)).toBeInTheDocument()
  })

  it('should have proper form structure and accessibility', () => {
    render(<AddItemPage />)
    
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
    
    // Check for proper labeling
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName()
    })
  })

  it('should display form guidance text', () => {
    render(<AddItemPage />)
    
    expect(screen.getByText(/help reduce food waste/i)).toBeInTheDocument()
  })
})
