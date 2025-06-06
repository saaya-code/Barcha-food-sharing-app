'use client'

import { FoodItem } from '@/types'
import { formatExpiryTime } from '@/lib/utils'
import { MapPin, Clock, User, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { addToFavorites, removeFromFavorites, checkIfFavorited } from '@/lib/supabase'
import { useTranslations } from 'next-intl'

interface FoodCardProps {
  item: FoodItem
  onRequest: (item: FoodItem) => void
}

export default function FoodCard({ item, onRequest }: FoodCardProps) {
  const { user } = useAuth()
  const t = useTranslations()  
  const [isLiked, setIsLiked] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const expiryStatus = formatExpiryTime(new Date(item.expiry_date))

  // Check if item is favorited when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const { data } = await checkIfFavorited(user.id, item.id)
          setIsLiked(data)
        } catch (error) {
          console.error('Error checking favorite status:', error)
        }
      }
    }

    checkFavoriteStatus()
  }, [user, item.id])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!user) {
      // Could show a toast or redirect to login
      return
    }

    try {
      setIsTogglingFavorite(true)
      
      if (isLiked) {
        await removeFromFavorites(user.id, item.id)
        setIsLiked(false)
      } else {
        await addToFavorites(user.id, item.id)
        setIsLiked(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Revert the state if there was an error
      setIsLiked(!isLiked)
    } finally {
      setIsTogglingFavorite(false)
    }
  }
  
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
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
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg scale-110' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-105'
          } ${isTogglingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isTogglingFavorite ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <Heart size={16} fill={isLiked ? "white" : "none"} />
          )}
        </button>
        
        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-white/90 text-gray-700 font-medium shadow-sm"
        >
          {t(`categories.${item.food_type}`, {defaultValue: item.food_type.charAt(0).toUpperCase() + item.food_type.slice(1).replace('-', ' ')})}
        </Badge>

        {/* Availability indicator */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <Badge variant="destructive" className="text-white bg-red-600">
          {t('foodCard.noLongerAvailable')}
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
                <span className="font-semibold">{t('foodCard.pickup')}: </span>
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
          {!item.is_available ? t('foodCard.unavailable') : isExpired ? t('foodCard.expired') : t('foodCard.request')}
        </Button>
      </CardFooter>
    </Card>
  )
}

