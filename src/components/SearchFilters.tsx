'use client'

import { Search, Filter, X } from 'lucide-react'
import { FoodCategory } from '@/types'

interface SearchFiltersProps {
  searchQuery: string
  selectedCategory: string
  selectedLocation: string
  selectedExpiry: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onLocationChange: (location: string) => void
  onExpiryChange: (expiry: string) => void
  onClear?: () => void
}

const FOOD_CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'bread', label: 'Bread' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'cooked-meals', label: 'Cooked Meals' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'other', label: 'Other' }
]

const LOCATIONS = [
  { value: '', label: 'All Locations' },
  { value: 'Tunis', label: 'Tunis' },
  { value: 'Sfax', label: 'Sfax' },
  { value: 'Sousse', label: 'Sousse' },
  { value: 'Kairouan', label: 'Kairouan' },
  { value: 'Bizerte', label: 'Bizerte' }
]

const EXPIRY_OPTIONS = [
  { value: '', label: 'Any Time' },
  { value: 'today', label: 'Expiring Today' },
  { value: 'tomorrow', label: 'Expiring Tomorrow' },
  { value: '3days', label: 'Within 3 Days' },
  { value: 'week', label: 'Within a Week' }
]

export default function SearchFilters({
  searchQuery,
  selectedCategory,
  selectedLocation,
  selectedExpiry,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onExpiryChange,
  onClear
}: SearchFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation || selectedExpiry

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            {FOOD_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            {LOCATIONS.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>

          <select
            value={selectedExpiry}
            onChange={(e) => onExpiryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            {EXPIRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && onClear && (
            <button
              onClick={onClear}
              className="px-3 py-2 text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
    onFilterChange(updated)
    if (newFilters.query !== undefined) {
      onSearch(newFilters.query)
    }
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: 'all',
      location: '',
      expiryHours: null
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
    onSearch('')
  }

  const hasActiveFilters = filters.category !== 'all' || filters.location !== '' || filters.expiryHours !== null

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for food items..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            hasActiveFilters || showFilters
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value as FoodCategory | 'all' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {FOOD_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City or area..."
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Expiry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires
              </label>
              <select
                value={filters.expiryHours || ''}
                onChange={(e) => updateFilters({ expiryHours: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {EXPIRY_OPTIONS.map((option) => (
                  <option key={option.value || 'all'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <X size={14} />
                <span>Clear all filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
