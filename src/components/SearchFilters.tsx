'use client'

import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export type SearchFiltersProps = {
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
  const t = useTranslations()
  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation || selectedExpiry

  const FOOD_CATEGORIES: { value: string; label: string }[] = [
    { value: '', label: t('categories.all') },
    { value: 'bread', label: t('categories.bread') },
    { value: 'fruits', label: t('categories.fruits') },
    { value: 'vegetables', label: t('categories.vegetables') },
    { value: 'cooked-meals', label: t('categories.cookedMeals') },
    { value: 'dairy', label: t('categories.dairy') },
    { value: 'desserts', label: t('categories.desserts') },
    { value: 'beverages', label: t('categories.beverages') },
    { value: 'other', label: t('categories.other') }
  ]

  const LOCATIONS = [
    { value: '', label: t('browse.allLocations') },
    { value: 'Tunis', label: 'Tunis' },
    { value: 'Sfax', label: 'Sfax' },
    { value: 'Sousse', label: 'Sousse' },
    { value: 'Kairouan', label: 'Kairouan' },
    { value: 'Bizerte', label: 'Bizerte' }
  ]

  const EXPIRY_OPTIONS = [
    { value: '', label: t('browse.anyTime') },
    { value: 'today', label: t('browse.expiringToday') },
    { value: 'tomorrow', label: t('browse.expiringTomorrow') },
    { value: '3days', label: t('browse.within3Days') },
    { value: 'week', label: t('browse.withinWeek') }
  ]

  return (
    <Card className="p-6 bg-gradient-to-r from-white to-gray-50 border-0 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder={t('browse.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md text-gray-800 placeholder-gray-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md min-w-[160px] text-gray-800 font-medium"
          >
            {FOOD_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value} className="text-gray-800 font-medium">
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md min-w-[160px] text-gray-800 font-medium"
          >
            {LOCATIONS.map((location) => (
              <option key={location.value} value={location.value} className="text-gray-800 font-medium">
                {location.label}
              </option>
            ))}
          </select>

          <select
            value={selectedExpiry}
            onChange={(e) => onExpiryChange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md min-w-[160px] text-gray-800 font-medium"
          >
            {EXPIRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-800 font-medium">
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && onClear && (
            <Button
              onClick={onClear}
              variant="outline"
              className="px-4 py-3 text-gray-700 hover:text-red-600 border-gray-200 rounded-xl hover:border-red-300 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
            >
              <X size={16} />
              {t('common.clear')}
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-800 mr-2 font-medium">{t('browse.activeFilters')}:</span>
            {searchQuery && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
                {t('browse.search')}: &quot;{searchQuery}&quot;
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                {t('browse.category')}: {FOOD_CATEGORIES.find(c => c.value === selectedCategory)?.label}
              </Badge>
            )}
            {selectedLocation && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-medium">
                {t('browse.location')}: {selectedLocation}
              </Badge>
            )}
            {selectedExpiry && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-medium">
                {t('browse.expiry')}: {EXPIRY_OPTIONS.find(e => e.value === selectedExpiry)?.label}
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

