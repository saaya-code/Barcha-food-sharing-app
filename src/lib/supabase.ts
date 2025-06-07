import { createClient } from '@supabase/supabase-js'
import { FoodItem, FoodRequest } from '@/types'

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
    console.error('Database error:', error)
    return { data: null, error }
  }
}

export const createFoodRequest = async (request: Omit<FoodRequest, 'id' | 'createdAt'>) => {
  // Transform camelCase to snake_case for database
  const dbRequest = {
    food_item_id: request.foodItemId,
    requester_id: request.requesterId,
    requester_name: request.requesterName,
    requester_contact: request.requesterContact,
    message: request.message,
    status: request.status
  }
  
  const { data, error } = await supabase
    .from(FOOD_REQUESTS_TABLE)
    .insert([dbRequest])
    .select()
    .single()
  
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  } catch (error) {
    console.error('Database error:', error)
    return { data: null, error }
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
  try {
    const { data, error } = await supabase
      .from(FOOD_ITEMS_TABLE)
      .select('*')
      .eq('donor_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  } catch (error) {
    console.error('Database error:', error)
    return { data: null, error }
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

// Food item management operations
export const updateFoodItemAvailability = async (foodItemId: string, isAvailable: boolean) => {
  const { data, error } = await supabase
    .from(FOOD_ITEMS_TABLE)
    .update({ 
      is_available: isAvailable,
      updated_at: new Date().toISOString()
    })
    .eq('id', foodItemId)
    .select()
    .single()
  
  return { data, error }
}

export const deleteFoodItem = async (foodItemId: string) => {
  const { data, error } = await supabase
    .from(FOOD_ITEMS_TABLE)
    .delete()
    .eq('id', foodItemId)
    .select()
    .single()
  
  return { data, error }
}

// Favorites operations
export const addToFavorites = async (userId: string, foodItemId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: userId,
      food_item_id: foodItemId
    }])
    .select()
    .single()
  
  return { data, error }
}

export const removeFromFavorites = async (userId: string, foodItemId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('food_item_id', foodItemId)
    .select()
    .single()
  
  return { data, error }
}

export const getUserFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`²
      *,
      food_items (
        id,
        title,
        description,
        food_type,
        quantity,
        image_url,
        location,
        expiry_date,
        pickup_instructions,
        donor_id,
        donor_name,
        donor_contact,
        contact_method,
        is_available,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const checkIfFavorited = async (userId: string, foodItemId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('food_item_id', foodItemId)
    .single()
  
  return { data: !!data, error }
}

// Notifications operations
export const createNotification = async (notification: {
  user_id: string
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  related_id?: string
  related_type?: string
}) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
    .single()
  
  return { data, error }
}

export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single()
  
  return { data, error }
}

export const markAllNotificationsAsRead = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
    .select()
  
  return { data, error }
}

export const getUnreadNotificationCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  
  return { count: count || 0, error }
}
