'use client'

import { useState, useMemo } from 'react'
import FoodCard from '@/components/FoodCard'
import SearchFilters from '@/components/SearchFilters'
import TopDonors from '@/components/TopDonors'
import { Button } from '@/components/ui/button'
import { FoodItem } from '@/types'
import { mockFoodItems, mockUsers } from '@/lib/mock-data'
import { MapPin, Users, Leaf, ArrowRight, Heart, Star } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const t = useTranslations()
  const locale = useLocale()

  // Filter food items based on search criteria
  const filteredItems = useMemo(() => {
    return mockFoodItems.filter((item) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesQuery = 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.foodType.toLowerCase().includes(query)
        if (!matchesQuery) return false
      }

      // Category filter
      if (selectedCategory && item.foodType !== selectedCategory) {
        return false
      }

      // Location filter
      if (selectedLocation) {
        const locationQuery = selectedLocation.toLowerCase()
        if (!item.location.toLowerCase().includes(locationQuery)) {
          return false
        }
      }

      // Expiry filter
      if (selectedExpiry) {
        const now = new Date()
        const diffInHours = Math.floor((item.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60))
        
        switch (selectedExpiry) {
          case 'today':
            if (diffInHours > 24 || diffInHours < 0) return false
            break
          case 'tomorrow':
            if (diffInHours > 48 || diffInHours < 24) return false
            break
          case '3days':
            if (diffInHours > 72 || diffInHours < 0) return false
            break
          case 'week':
            if (diffInHours > 168 || diffInHours < 0) return false
            break
        }
      }

      return item.isAvailable
    })
  }, [searchQuery, selectedCategory, selectedLocation, selectedExpiry])

  const handleRequestFood = (item: FoodItem) => {
    alert(`Request sent for: ${item.title}\nContact: ${item.donor_contact}`)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLocation('')
    setSelectedExpiry('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 via-blue-600/90 to-purple-600/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Heart className="w-5 h-5 text-red-300" />
              <span className="text-sm font-medium">{t('home.joinCommunity')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
              {t('home.title')}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
              >
                <Link href={`/${locale}/browse`} className="flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('home.browseFood')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
              >
                <Link href={`/${locale}/add-item`} className="flex items-center justify-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  {t('home.shareYourFood')}
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Users className="w-8 h-8 text-blue-200" />
                <span className="text-2xl font-bold">{mockUsers.length}+</span>
                <span className="text-sm opacity-90">{t('home.activeDonors')}</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Leaf className="w-8 h-8 text-green-200" />
                <span className="text-2xl font-bold">{mockFoodItems.length}+</span>
                <span className="text-sm opacity-90">{t('home.itemsShared')}</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Star className="w-8 h-8 text-yellow-200" />
                <span className="text-2xl font-bold">4.9</span>
                <span className="text-sm opacity-90">{t('home.communityRating')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Discover Available Food
              </h2>
              <SearchFilters
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                selectedExpiry={selectedExpiry}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onLocationChange={setSelectedLocation}
                onExpiryChange={setSelectedExpiry}
                onClear={handleClearFilters}
              />
            </div>

            {/* Results Header */}
            <div className="mb-8 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Available Food Near You
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {/* Food Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.slice(0, 6).map((item) => (
                  <FoodCard
                    key={item.id}
                    item={{
                      id: item.id,
                      title: item.title,
                      description: item.description,
                      food_type: item.foodType,
                      quantity: item.quantity,
                      image_url: item.imageUrl,
                      location: item.location,
                      expiry_date: item.expiryDate.toISOString(),
                      pickup_instructions: item.pickupInstructions,
                      donor_id: item.id, // Assuming donor_id might be same as item.id
                      donor_name: item.donorName,
                      donor_contact: item.donorContact,
                      created_at: item.createdAt.toISOString(),
                      is_available: item.isAvailable
                    }}
                    onRequest={handleRequestFood}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No food items found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search filters or check back later for new donations.
                </p>
                <Button 
                  onClick={handleClearFilters}
                  variant="outline"
                  className="rounded-xl"
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Show more button */}
            {filteredItems.length > 6 && (
              <div className="text-center mt-8">
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl px-8"
                >
                  <Link href="/browse">
                    View All {filteredItems.length} Items
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TopDonors users={mockUsers.map(user => ({
              ...user,
              total_donations: user.totalDonations,
              created_at: user.createdAt.toISOString()
            }))} />
          </div>
        </div>
      </main>
    </div>
  )
}
