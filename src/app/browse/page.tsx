'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import FoodCard from '@/components/FoodCard'
import SearchFilters, { SearchFilters as SearchFiltersType } from '@/components/SearchFilters'
import { FoodItem } from '@/types'
import { mockFoodItems } from '@/lib/mock-data'

export default function BrowsePage() {
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({
    query: '',
    category: 'all',
    location: '',
    expiryHours: null
  })

  // Filter food items based on search criteria
  const filteredItems = useMemo(() => {
    return mockFoodItems.filter((item) => {
      // Search query
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase()
        const matchesQuery = 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.foodType.toLowerCase().includes(query)
        if (!matchesQuery) return false
      }

      // Category filter
      if (searchFilters.category !== 'all' && item.foodType !== searchFilters.category) {
        return false
      }

      // Location filter
      if (searchFilters.location) {
        const locationQuery = searchFilters.location.toLowerCase()
        if (!item.location.toLowerCase().includes(locationQuery)) {
          return false
        }
      }

      // Expiry filter
      if (searchFilters.expiryHours !== null) {
        const now = new Date()
        const diffInHours = Math.floor((item.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60))
        if (diffInHours > searchFilters.expiryHours || diffInHours < 0) {
          return false
        }
      }

      return item.isAvailable
    })
  }, [searchFilters])

  const handleRequestFood = (item: FoodItem) => {
    // This will be implemented with actual request functionality later
    alert(`Request sent for: ${item.title}\nContact: ${item.donorContact}`)
  }

  const handleSearch = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }))
  }

  const handleFilterChange = (filters: SearchFiltersType) => {
    setSearchFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Available Food</h1>
          <p className="text-gray-600">
            Discover surplus food available for pickup in your area
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            initialFilters={searchFilters}
          />
        </div>

        {/* Results Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Items
          </h2>
          <span className="text-gray-600">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Food Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onRequestClick={handleRequestFood}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No food items found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search filters or check back later for new donations. 
              Be the first to share food in your area!
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => setSearchFilters({
                  query: '',
                  category: 'all',
                  location: '',
                  expiryHours: null
                })}
                className="text-green-600 hover:text-green-700 font-medium block mx-auto"
              >
                Clear all filters
              </button>
              <a 
                href="/add-item"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Share Food Instead
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
