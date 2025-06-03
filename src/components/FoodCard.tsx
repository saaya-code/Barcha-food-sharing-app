'use client'

import { FoodItem } from '@/types'
import { formatExpiryTime } from '@/lib/utils'
import { MapPin, Clock, User, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import Image from 'next/image'

interface FoodCardProps {
  item: FoodItem
  onRequest: (item: FoodItem) => void
}

export default function FoodCard({ item, onRequest }: FoodCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const expiryStatus = formatExpiryTime(new Date(item.expiry_date))
  
  const getExpiryBadgeVariant = () => {
    if (expiryStatus.includes('Expired')) return 'destructive'
    if (expiryStatus.includes('soon')) return 'warning'
    if (expiryStatus.includes('h left')) return 'warning'
    return 'success'
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

  const isExpired = new Date(item.expiry_date).getTime() < Date.now()

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md bg-gradient-to-br from-white to-gray-50 hover:scale-105">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-200 flex items-center justify-center">
            <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
              {getCategoryEmoji(item.food_type)}
            </div>
          </div>
        )}
        
        <button
          onClick={(e) => {
        e.stopPropagation()
        setIsLiked(!isLiked)
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
        isLiked 
          ? 'bg-red-500 text-white shadow-lg scale-110' 
          : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-105'
          }`}
        >
          <Heart size={16} fill={isLiked ? "white" : "none"} />
        </button>
        
        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-white/90 text-gray-700 font-medium shadow-sm"
        >
          {item.food_type.charAt(0).toUpperCase() + item.food_type.slice(1).replace('-', ' ')}
        </Badge>

        {/* Availability indicator */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <Badge variant="destructive" className="text-white bg-red-600">
          No longer available
        </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-green-700 transition-colors">
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
              <Badge variant={getExpiryBadgeVariant()} className="text-xs font-medium">
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

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <User size={16} className="mr-2 text-purple-600" />
          <span className="truncate max-w-[120px] font-medium">{item.donor_name}</span>
        </div>
        
        <Button 
          onClick={() => onRequest(item)}
          size="sm"
          disabled={!item.is_available || isExpired}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {!item.is_available ? 'Unavailable' : isExpired ? 'Expired' : 'Request'}
        </Button>
      </CardFooter>
    </Card>
  )
}

