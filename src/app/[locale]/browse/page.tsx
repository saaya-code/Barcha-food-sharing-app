'use client'

import { useState, useMemo, useEffect } from 'react'
import FoodCard from '@/components/FoodCard'
import SearchFilters from '@/components/SearchFilters'
import RequestModal from '@/components/RequestModal'
import { FoodItem } from '@/types'
import { getFoodItems, createFoodRequest } from '@/lib/supabase'
import { useTranslations, useLocale } from 'next-intl'

export default function BrowsePage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null)
  const [filterValues, setFilterValues] = useState({
    searchQuery: '',
    selectedCategory: '',
    selectedLocation: '',
    selectedExpiry: ''
  })
  const t = useTranslations()
  const locale = useLocale()

  // Fetch food items from Supabase
  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await getFoodItems()
      
      if (error) {
        setError(String(error) || 'Failed to load food items')
        return
      }

      setFoodItems(data || [])
    } catch (err) {
      setError('Failed to load food items')
      console.error('Error fetching food items:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter food items based on search criteria
  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      // Search query
      if (filterValues.searchQuery) {
        const query = filterValues.searchQuery.toLowerCase()
        const matchesQuery = 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        if (!matchesQuery) return false
      }

      // Category filter
      if (filterValues.selectedCategory && item.food_type !== filterValues.selectedCategory) {
        return false
      }

      // Location filter
      if (filterValues.selectedLocation) {
        const locationQuery = filterValues.selectedLocation.toLowerCase()
        if (!item.location.toLowerCase().includes(locationQuery)) {
          return false
        }
      }

      // Expiry filter
      if (filterValues.selectedExpiry) {
        const now = new Date()
        const expiryDate = new Date(item.expiry_date)
        const diffInHours = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60))
        
        switch (filterValues.selectedExpiry) {
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

      return item.is_available
    })
  }, [filterValues, foodItems])

  const handleRequestFood = (item: FoodItem) => {
    setSelectedFoodItem(item)
    setRequestModalOpen(true)
  }

  const handleSubmitRequest = async (requestData: {
    foodItemId: string
    requesterId: string
    requesterName: string
    requesterContact: string
    message: string
  }) => {
    try {
      const { error } = await createFoodRequest({
        foodItemId: requestData.foodItemId,
        requesterId: requestData.requesterId,
        requesterName: requestData.requesterName,
        requesterContact: requestData.requesterContact,
        message: requestData.message,
        status: 'pending'
      })

      if (error) {
        throw error
      }

      // Show success message briefly
      setError('')
      // You could add a success toast here
      console.log('Request submitted successfully!')
      
    } catch (err) {
      console.error('Error submitting request:', err)
      throw err // Re-throw to let the modal handle the error display
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <section className="bg-white/80 backdrop-blur-sm border-b border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t('browse.title')}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('browse.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            searchQuery={filterValues.searchQuery}
            selectedCategory={filterValues.selectedCategory}
            selectedLocation={filterValues.selectedLocation}
            selectedExpiry={filterValues.selectedExpiry}
            onSearchChange={(query) => setFilterValues(prev => ({ ...prev, searchQuery: query }))}
            onCategoryChange={(category) => setFilterValues(prev => ({ ...prev, selectedCategory: category }))}
            onLocationChange={(location) => setFilterValues(prev => ({ ...prev, selectedLocation: location }))}
            onExpiryChange={(expiry) => setFilterValues(prev => ({ ...prev, selectedExpiry: expiry }))}
            onClear={() => setFilterValues({
              searchQuery: '',
              selectedCategory: '',
              selectedLocation: '',
              selectedExpiry: ''
            })}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('browse.availableItems')}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  {filteredItems.length} {t('browse.itemsFound', { count: filteredItems.length })}
                </span>
              </div>
            </div>

        {/* Food Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard 
                key={item.id}
                item={item}
                onRequest={() => handleRequestFood(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('browse.noItemsTitle')}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {t('browse.noItemsDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setFilterValues({
                  searchQuery: '',
                  selectedCategory: '',
                  selectedLocation: '',
                  selectedExpiry: ''
                })}
                className="px-6 py-3 text-green-600 hover:text-green-700 font-semibold border-2 border-green-200 hover:border-green-300 rounded-xl transition-all duration-200 hover:scale-105"
              >
                {t('browse.clearFilters')}
              </button>
              <a 
                href={`/${locale}/add-item`}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('browse.shareFood')}
              </a>
            </div>
          </div>
        )}
          </>
        )}
      </div>
      
      {/* Request Modal */}
      {requestModalOpen && selectedFoodItem && (
        <RequestModal
          foodItem={selectedFoodItem}
          isOpen={requestModalOpen}
          onClose={() => {
            setRequestModalOpen(false)
            setSelectedFoodItem(null)
          }}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  )
}
