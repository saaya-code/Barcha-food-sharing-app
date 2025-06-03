import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table schemas
export const FOOD_ITEMS_TABLE = 'food_items'
export const USERS_TABLE = 'users'
export const FOOD_REQUESTS_TABLE = 'food_requests'
