'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserFavorites, createFoodRequest } from '@/lib/supabase'
import { FoodItem } from '@/types'
import Header from '@/components/Header'
import FoodCard from '@/components/FoodCard'
import RequestModal from '@/components/RequestModal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'

interface FavoriteItem {
  id: string
  user_id: string
  food_item_id: string
  created_at: string
  food_items: FoodItem
}

export default function FavoritesPage() {
  const { user, loading } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null)

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user, loadFavorites])

  const loadFavorites = async () => {
    if (!user) return

    try {
      setLoadingFavorites(true)
      const { data, error } = await getUserFavorites(user.id)
      
      if (error) {
        setError('Failed to load your favorites')
        console.error('Error loading favorites:', error)
      } else {
        setFavorites(data || [])
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setLoadingFavorites(false)
    }
  }

  const handleRequestFood = (item: FoodItem) => {
    setSelectedFoodItem(item)
    setRequestModalOpen(true)
  }

  const handleSubmitRequest = async (requestData: {
    requesterName: string
    requesterContact: string
    message: string
  }) => {
    if (!selectedFoodItem || !user) return

    try {
      const { error } = await createFoodRequest({
        foodItemId: selectedFoodItem.id,
        requesterId: user.id,
        requesterName: requestData.requesterName,
        requesterContact: requestData.requesterContact,
        message: requestData.message,
        status: 'pending'
      })

      if (error) {
        throw error
      }

      setRequestModalOpen(false)
      setSelectedFoodItem(null)
      // You could show a success message here
    } catch (error) {
      console.error('Error submitting request:', error)
      // Handle error (show toast, etc.)
    }
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
              <p className="text-gray-600 mb-6">You need to sign in to view your favorites.</p>
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
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">Food items you've saved for later</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loadingFavorites ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">Start browsing food items and save your favorites by clicking the heart icon.</p>
              <Link href="/browse">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Browse Food Items
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <FoodCard
                key={favorite.id}
                item={favorite.food_items}
                onRequest={handleRequestFood}
              />
            ))}
          </div>
        )}
      </main>

      {/* Request Modal */}
      <RequestModal
        isOpen={requestModalOpen}
        onClose={() => {
          setRequestModalOpen(false)
          setSelectedFoodItem(null)
        }}
        onSubmit={handleSubmitRequest}
        foodItem={selectedFoodItem}
      />
    </div>
  )
}
