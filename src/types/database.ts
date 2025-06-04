export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          whatsapp_number: string | null
          total_donations: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          whatsapp_number?: string | null
          total_donations?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          whatsapp_number?: string | null
          total_donations?: number
          created_at?: string
          updated_at?: string
        }
      }
      food_items: {
        Row: {
          id: string
          title: string
          description: string
          food_type: string
          quantity: string
          image_url: string | null
          location: string
          expiry_date: string
          pickup_instructions: string | null
          donor_id: string
          donor_name: string
          donor_contact: string
          created_at: string
          updated_at: string
          is_available: boolean
        }
        Insert: {
          id?: string
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
          created_at?: string
          updated_at?: string
          is_available?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          food_type?: string
          quantity?: string
          image_url?: string | null
          location?: string
          expiry_date?: string
          pickup_instructions?: string | null
          donor_id?: string
          donor_name?: string
          donor_contact?: string
          created_at?: string
          updated_at?: string
          is_available?: boolean
        }
      }
      food_requests: {
        Row: {
          id: string
          food_item_id: string
          requester_id: string
          requester_name: string
          requester_contact: string
          message: string | null
          status: 'pending' | 'approved' | 'declined' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          food_item_id: string
          requester_id: string
          requester_name: string
          requester_contact: string
          message?: string | null
          status?: 'pending' | 'approved' | 'declined' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          food_item_id?: string
          requester_id?: string
          requester_name?: string
          requester_contact?: string
          message?: string | null
          status?: 'pending' | 'approved' | 'declined' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Exported types for easier use
export type User = Database['public']['Tables']['users']['Row']
export type FoodItem = Database['public']['Tables']['food_items']['Row']
export type FoodRequest = Database['public']['Tables']['food_requests']['Row'] & {
  food_items?: FoodItem
}
