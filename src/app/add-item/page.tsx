'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import { Calendar, MapPin, User, Phone, MessageSquare } from 'lucide-react'
import { FoodCategory } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { createFoodItem } from '@/lib/supabase'

const FOOD_CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: 'bread', label: 'Bread & Bakery' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'cooked-meals', label: 'Cooked Meals' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'other', label: 'Other' }
]

export default function AddItemPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: 'other' as FoodCategory,
    quantity: '',
    location: '',
    expiryDate: '',
    expiryTime: '',
    pickupInstructions: '',
    donorName: '',
    donorContact: '',
    contactMethod: 'phone' as 'phone' | 'whatsapp' | 'email'
  })

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
  }

  const handleImageRemoved = () => {
    setImageUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (!user) {
        setError('You must be logged in to add items')
        return
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.quantity || 
          !formData.location || !formData.expiryDate || !formData.expiryTime) {
        setError('Please fill in all required fields')
        return
      }

      // Combine date and time for expiry
      const expiryDateTime = new Date(`${formData.expiryDate}T${formData.expiryTime}`)
      
      // Check if expiry date is in the future
      if (expiryDateTime <= new Date()) {
        setError('Expiry date must be in the future')
        return
      }

      // Create food item
      const { error: createError } = await createFoodItem({
        title: formData.title,
        description: formData.description,
        food_type: formData.foodType,
        quantity: formData.quantity,
        location: formData.location,
        expiry_date: expiryDateTime.toISOString(),
        pickup_instructions: formData.pickupInstructions,
        image_url: imageUrl,
        donor_id: user.id,
        donor_name: formData.donorName,
        donor_contact: formData.donorContact,
        contact_method: formData.contactMethod,
        is_available: true
      })

      if (createError) {
        setError(createError.message)
        return
      }

      // Success
      alert('Food item added successfully!')
      router.push('/browse')
    } catch (error) {
      console.error('Error submitting food item:', error)
      setError('Error posting food item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🍽️</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Add Food Item</h1>
            <p className="text-gray-600">
              Share your surplus food with the community and help reduce waste.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Optional)
              </label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                currentImage={imageUrl}
              />
            </div>

            {/* Food Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fresh bread, Homemade pasta"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Type *
                </label>
                <select
                  required
                  value={formData.foodType}
                  onChange={(e) => handleInputChange('foodType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                >
                  {FOOD_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe the food, its condition, and any relevant details..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2 loaves, 1 kg, 4 servings"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Tunis Centre, Sfax"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                />
              </div>
            </div>

            {/* Expiry Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  max={getTomorrowDate()}
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best before time
                </label>
                <input
                  type="time"
                  value={formData.expiryTime}
                  onChange={(e) => handleInputChange('expiryTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Donor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.donorName}
                    onChange={(e) => handleInputChange('donorName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Method *
                  </label>
                  <select
                    required
                    value={formData.contactMethod}
                    onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                  >
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Contact *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formData.contactMethod === 'email' 
                      ? "your.email@example.com"
                      : "+216 XX XXX XXX"
                  }
                  value={formData.donorContact}
                  onChange={(e) => handleInputChange('donorContact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70"
                />
              </div>
            </div>

            {/* Pickup Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare size={16} className="inline mr-1" />
                Pickup Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Ring the side door bell, Available after 6 PM, Located near the market..."
                value={formData.pickupInstructions}
                onChange={(e) => handleInputChange('pickupInstructions', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white transform transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed scale-95'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 focus:ring-4 focus:ring-green-200'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Post Food Item</span>
                    <span>🌟</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
