// Development configuration and mock data
import { FoodItem } from '@/types'

// Check if we have valid Supabase configuration
export const hasValidSupabaseConfig = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(url && key && url !== 'your-supabase-url' && key !== 'your-supabase-anon-key')
}

// Mock user profile data for development
export const mockProfile = {
  id: 'mock-user-id',
  name: 'Demo User',
  email: 'demo@example.com',
  whatsapp_number: '+1234567890',
  total_donations: 5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Mock food items for development
export const mockFoodItems: FoodItem[] = [
  {
    id: 'mock-1',
    title: 'Fresh Vegetables',
    description: 'Assorted fresh vegetables including carrots, broccoli, and spinach',
    food_type: 'vegetables',
    quantity: '5 kg',
    expiry_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    location: 'Downtown Community Center',
    donor_id: 'mock-user-id',
    donor_name: 'Demo User',
    donor_contact: '+1234567890',
    contact_method: 'whatsapp',
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-2',
    title: 'Homemade Bread',
    description: 'Freshly baked whole wheat bread, perfect for sandwiches',
    food_type: 'bakery',
    quantity: '2 loaves',
    expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    location: 'City Park Entrance',
    donor_id: 'mock-user-id-2',
    donor_name: 'Baker Jane',
    donor_contact: '+1234567891',
    contact_method: 'whatsapp',
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-3',
    title: 'Cooked Rice and Curry',
    description: 'Freshly prepared vegetarian meal with basmati rice and mixed vegetable curry',
    food_type: 'cooked',
    quantity: '10 servings',
    expiry_date: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    location: 'University Campus',
    donor_id: 'mock-user-id-3',
    donor_name: 'Student Kitchen',
    donor_contact: '+1234567892',
    contact_method: 'whatsapp',
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
    created_at: new Date().toISOString()
  }
]

// Mock food requests for development
export const mockFoodRequests = [
  {
    id: 'mock-req-1',
    food_item_id: 'mock-1',
    requester_id: 'mock-requester-1',
    requester_name: 'Community Helper',
    requester_whatsapp: '+1234567893',
    message: 'This would be perfect for our weekend community meal preparation!',
    status: 'pending',
    created_at: new Date().toISOString()
  }
]