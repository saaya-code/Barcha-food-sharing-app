export interface FoodItem {
  id: string
  title: string
  description: string
  foodType: string
  quantity: string
  imageUrl?: string
  location: string
  expiryDate: Date
  pickupInstructions?: string
  donorName: string
  donorContact: string
  createdAt: Date
  isAvailable: boolean
}

export interface User {
  id: string
  email: string
  name: string
  whatsappNumber?: string
  totalDonations: number
  createdAt: Date
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
