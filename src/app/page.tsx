'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import FoodCard from '@/components/FoodCard'
import SearchFilters, { SearchFilters as SearchFiltersType } from '@/components/SearchFilters'
import TopDonors from '@/components/TopDonors'
import { FoodItem } from '@/types'
import { mockFoodItems, mockUsers } from '@/lib/mock-data'
import { MapPin, Users, Leaf } from 'lucide-react'

export default function Home() {
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Barsha
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Share surplus food, reduce waste, help your community
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>{mockUsers.length} active donors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf size={20} />
                <span>{mockFoodItems.length} items shared</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={20} />
                <span>Across Tunisia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-6">
              <SearchFilters
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                initialFilters={searchFilters}
              />
            </div>

            {/* Results Header */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Food Near You
              </h2>
              <span className="text-gray-600">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {/* Food Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    onRequestClick={handleRequestFood}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No food items found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters or check back later for new donations.
                </p>
                <button 
                  onClick={() => setSearchFilters({
                    query: '',
                    category: 'all',
                    location: '',
                    expiryHours: null
                  })}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TopDonors users={mockUsers} />
          </div>
        </div>
      </div>
    </div>
  )
}
