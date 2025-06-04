'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserFoodItems, updateFoodItemAvailability } from '@/lib/supabase'
import { FoodItem } from '@/types'
import Header from '@/components/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Eye, EyeOff, Plus, Edit } from 'lucide-react'
import { formatExpiryTime } from '@/lib/utils'
import Link from 'next/link'

export default function MyItemsPage() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState<FoodItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadUserItems()
    }
  }, [user, loadUserItems])

  const loadUserItems = async () => {
    if (!user) return

    try {
      setLoadingItems(true)
      const { data, error } = await getUserFoodItems(user.id)
      
      if (error) {
        setError('Failed to load your items')
        console.error('Error loading user items:', error)
      } else {
        setItems(data || [])
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setLoadingItems(false)
    }
  }

  const toggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      setUpdatingId(itemId)
      const { error } = await updateFoodItemAvailability(itemId, !currentAvailability)
      
      if (error) {
        setError('Failed to update item availability')
        console.error('Error updating availability:', error)
      } else {
        // Update local state
        setItems(items.map(item => 
          item.id === itemId 
            ? { ...item, is_available: !currentAvailability }
            : item
        ))
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      'bread': '🍞',
      'fruits': '🍎',
      'vegetables': '🥕',
      'cooked-meals': '🍲',
      'dairy': '🥛',
      'desserts': '🍰',
      'beverages': '🥤',
      'other': '🍽️'
    }
    return emojiMap[category] || '🍽️'
  }

  const getExpiryBadgeVariant = (expiryStatus: string) => {
    if (expiryStatus.includes('Expired')) return 'destructive'
    if (expiryStatus.includes('soon')) return 'warning'
    if (expiryStatus.includes('h left')) return 'warning'
    return 'success'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">You need to sign in to view your items.</p>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Food Items</h1>
              <p className="text-gray-600">Manage your food donations and availability</p>
            </div>
            <Link href="/add-item">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
                <Plus size={20} className="mr-2" />
                Add New Item
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loadingItems ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your items...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-600 mb-6">Start sharing food with your community by adding your first item.</p>
              <Link href="/add-item">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Plus size={20} className="mr-2" />
                  Add Your First Item
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const expiryStatus = formatExpiryTime(new Date(item.expiry_date))
              const isExpired = new Date(item.expiry_date).getTime() < Date.now()
              
              return (
                <Card key={item.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-200 flex items-center justify-center">
                        <div className="text-6xl opacity-80">
                          {getCategoryEmoji(item.food_type)}
                        </div>
                      </div>
                    )}
                    
                    {/* Availability Toggle */}
                    <button
                      onClick={() => toggleAvailability(item.id, item.is_available)}
                      disabled={updatingId === item.id}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                        item.is_available 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-gray-500 text-white shadow-lg'
                      } ${updatingId === item.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    >
                      {updatingId === item.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : item.is_available ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                    
                    {/* Category Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 bg-white/90 text-gray-700 font-medium shadow-sm"
                    >
                      {item.food_type.charAt(0).toUpperCase() + item.food_type.slice(1).replace('-', ' ')}
                    </Badge>

                    {/* Status Indicator */}
                    <Badge 
                      className={`absolute bottom-3 left-3 ${
                        item.is_available ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      {item.is_available ? 'Available' : 'Hidden'}
                    </Badge>
                  </div>

                  <CardContent className="p-5">
                    {/* Title and Description */}
                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2 text-green-600" />
                        <span className="truncate font-medium">{item.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Clock size={16} className="mr-2 text-blue-600" />
                          <Badge variant={getExpiryBadgeVariant(expiryStatus)} className="text-xs font-medium">
                            {expiryStatus}
                          </Badge>
                        </div>
                        
                        <div className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                          {item.quantity}
                        </div>
                      </div>

                      {item.pickup_instructions && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-800">
                            <span className="font-semibold">Pickup: </span>
                            {item.pickup_instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <div className="p-5 pt-0 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Created {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="hover:bg-green-50 hover:border-green-300"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
