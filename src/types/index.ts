export interface FoodItem {
  id: string
  title: string
  description: string
  food_type: string
  quantity: string
  image_url?: string | null
  location: string
  expiry_date: string
  pickup_instructions?: string | null
  donor_id: string
  donor_name: string
  donor_contact: string
  contact_method?: string
  created_at: string
  updated_at?: string
  is_available: boolean
}

export interface User {
  id: string
  email: string
  name: string
  whatsapp_number?: string | null
  total_donations: number
  created_at: string
  updated_at?: string
}

export interface FoodRequest {
  id: string
  foodItemId: string
  requesterId: string
  requesterName: string
  requesterContact: string
  message?: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: Date
}

export type FoodCategory = 
  | 'bread'
  | 'fruits'
  | 'vegetables'
  | 'cooked-meals'
  | 'dairy'
  | 'desserts'
  | 'beverages'
  | 'other'
