'use client'

import Image from 'next/image'
import { Clock, MapPin, User, MessageCircle } from 'lucide-react'
import { FoodItem } from '@/types'
import { formatExpiryTime, formatTimeAgo } from '@/lib/utils'

interface FoodCardProps {
  item: FoodItem
  onRequest?: (itemId: string) => void
}

export default function FoodCard({ item, onRequest }: FoodCardProps) {
  const getExpiryColor = () => {
    const now = new Date()
    const diffInHours = Math.floor((item.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 0) return 'text-red-600 bg-red-50'
    if (diffInHours < 6) return 'text-orange-600 bg-orange-50'
    if (diffInHours < 24) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getFoodTypeColor = () => {
    const colors: Record<string, string> = {
      'bread': 'bg-amber-100 text-amber-800',
      'fruits': 'bg-orange-100 text-orange-800',
      'vegetables': 'bg-green-100 text-green-800',
      'cooked-meals': 'bg-red-100 text-red-800',
      'dairy': 'bg-blue-100 text-blue-800',
      'desserts': 'bg-pink-100 text-pink-800',
      'beverages': 'bg-cyan-100 text-cyan-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[item.foodType] || colors['other']
  }

  const isExpired = item.expiryDate.getTime() < Date.now()

  return (
    <div 
      data-testid="food-card"
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 ${isExpired ? 'opacity-60' : ''}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">No image</span>
          </div>
        )}
        
        {/* Food type badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFoodTypeColor()}`}>
            {item.foodType.replace('-', ' ')}
          </span>
        </div>

        {/* Expiry badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpiryColor()}`}>
            {formatExpiryTime(item.expiryDate)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-2" />
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <User size={14} className="mr-2" />
            <span>{item.donorName}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-2" />
            <span>Posted {formatTimeAgo(item.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Quantity: </span>
            <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
          </div>
          
          {item.isAvailable && onRequest && (
            <button
              onClick={() => onRequest(item.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
            >
              <MessageCircle size={14} />
              <span>Request</span>
            </button>
          )}
        </div>

        {item.pickupInstructions && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <span className="font-medium">Pickup: </span>
            {item.pickupInstructions}
          </div>
        )}
      </div>
    </div>
  )
}
