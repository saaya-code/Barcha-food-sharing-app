import { createClient } from '@supabase/supabase-js'
import { FoodItem, FoodRequest } from '@/types'
import { hasValidSupabaseConfig, mockProfile, mockFoodItems } from './dev-config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table schemas
export const FOOD_ITEMS_TABLE = 'food_items'
export const USERS_TABLE = 'users'
export const FOOD_REQUESTS_TABLE = 'food_requests'

// Auth helpers
export const signUp = async (email: string, password: string, userData: { name: string; whatsapp_number?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Food items operations
export const createFoodItem = async (foodItem: Omit<FoodItem, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from(FOOD_ITEMS_TABLE)
    .insert([foodItem])
    .select()
    .single()
  
  return { data, error }
}

export const getFoodItems = async (filters?: {
  category?: string
  location?: string
  search?: string
  expiry?: string
}) => {
  // In development mode without valid Supabase config, return mock data
  if (!hasValidSupabaseConfig()) {
    console.log('Using mock food items data (Supabase not configured)')
    let filteredItems = [...mockFoodItems]
    
    if (filters?.category) {
      filteredItems = filteredItems.filter(item => item.food_type === filters.category)
    }
    
    if (filters?.location) {
      filteredItems = filteredItems.filter(item => 
        item.location.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      )
    }
    
    return { data: filteredItems, error: null }
  }

  try {
    let query = supabase
      .from(FOOD_ITEMS_TABLE)
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('food_type', filters.category)
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.expiry) {
      const now = new Date()
      let expiryDate: Date

      switch (filters.expiry) {
        case 'today':
          expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          break
        case 'tomorrow':
          expiryDate = new Date(now.getTime() + 48 * 60 * 60 * 1000)
          break
        case '3days':
          expiryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
          break
        case 'week':
          expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          break
        default:
          expiryDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      }

      query = query.lte('expiry_date', expiryDate.toISOString())
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error('Database error, falling back to mock data:', error)
    return { data: mockFoodItems, error: null }
  }
}

export const createFoodRequest = async (request: Omit<FoodRequest, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from(FOOD_REQUESTS_TABLE)
    .insert([request])
    .select()
    .single()
  
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  // In development mode without valid Supabase config, return mock data
  if (!hasValidSupabaseConfig()) {
    console.log('Using mock profile data (Supabase not configured)')
    return { data: mockProfile, error: null }
  }

  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  } catch (error) {
    console.error('Database error, falling back to mock data:', error)
    return { data: mockProfile, error: null }
  }
}

// User operations
export const updateUserProfile = async (userId: string, updates: { name?: string; whatsapp_number?: string }) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const getUserFoodItems = async (userId: string) => {
  // In development mode without valid Supabase config, return mock data
  if (!hasValidSupabaseConfig()) {
    console.log('Using mock food items data (Supabase not configured)')
    return { data: mockFoodItems, error: null }
  }

  try {
    const { data, error } = await supabase
      .from(FOOD_ITEMS_TABLE)
      .select('*')
      .eq('donor_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  } catch (error) {
    console.error('Database error, falling back to mock data:', error)
    return { data: mockFoodItems, error: null }
  }
}

export const getUserRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from(FOOD_REQUESTS_TABLE)
    .select(`
      *,
      food_items (
        title,
        description,
        image_url,
        quantity,
        location,
        donor_name,
        donor_contact
      )
    `)
    .eq('requester_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const updateRequestStatus = async (requestId: string, status: 'pending' | 'approved' | 'declined' | 'completed') => {
  const { data, error } = await supabase
    .from(FOOD_REQUESTS_TABLE)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .select()
    .single()
  
  return { data, error }
}

export const createUserProfile = async (userId: string, userData: { name: string; email: string; whatsapp_number?: string }) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .insert([{
      id: userId,
      name: userData.name,
      email: userData.email,
      whatsapp_number: userData.whatsapp_number,
      total_donations: 0
    }])
    .select()
    .single()
  
  return { data, error }
}
