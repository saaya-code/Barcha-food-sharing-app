'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { User, Mail, Phone, Edit2, Heart, Package } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, updateUserProfile, getUserFoodItems } from '@/lib/supabase'
import { FoodItem } from '@/types'
import FoodCard from '@/components/FoodCard'

export default function ProfilePage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userItems, setUserItems] = useState<FoodItem[]>([])
  const [error, setError] = useState('')
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    whatsapp_number: '',
    total_donations: 0
  })
  const [editForm, setEditForm] = useState({
    name: '',
    whatsapp_number: ''
  })

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      // Load user profile
      const { data: profileData, error: profileError } = await getUserProfile(user!.id)
      if (profileError) throw profileError
      
      if (profileData) {
        setProfile(profileData)
        setEditForm({
          name: profileData.name,
          whatsapp_number: profileData.whatsapp_number || ''
        })
      }

      // Load user's food items
      const { data: itemsData, error: itemsError } = await getUserFoodItems(user!.id)
      if (itemsError) throw itemsError
      
      setUserItems(itemsData || [])
    } catch (error) {
      console.error('Error loading user data:', error)
      setError('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    loadUserData()
  }, [user, router, loadUserData])

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      setError('')
      
      const { error } = await updateUserProfile(user!.id, editForm)
      if (error) throw error
      
      setProfile(prev => ({
        ...prev,
        name: editForm.name,
        whatsapp_number: editForm.whatsapp_number
      }))
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleFoodRequest = () => {
    // For profile page, we can either disable requests for own items
    // or redirect to the item detail page
    router.push(`/browse`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name || 'User'}
                </h1>
                <p className="text-gray-600">{profile.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <Heart size={16} />
                    <span className="text-sm font-medium">
                      {profile.total_donations} donations
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Edit2 size={16} />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={editForm.whatsapp_number}
                  onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium">
                    {profile.whatsapp_number || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User's Food Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Package size={24} />
              <span>My Food Items</span>
            </h2>
            <button
              onClick={() => router.push('/add-item')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New Item
            </button>
          </div>

          {userItems.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                No food items yet
              </h3>
              <p className="text-gray-400 mb-4">
                Start sharing food with your community
              </p>
              <button
                onClick={() => router.push('/add-item')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map((item) => (
                <FoodCard key={item.id} item={item} onRequest={handleFoodRequest} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
