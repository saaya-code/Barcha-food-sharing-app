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
  const { user, signOut, loading: authLoading } = useAuth()
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

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return

    // Redirect if not authenticated
    if (!user) {
      router.push('/login')
      return
    }

    // Load user data
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        setError('')
        
        // Load user profile
        const { data: profileData, error: profileError } = await getUserProfile(user.id)
        if (profileError) {
          console.error('Profile error:', profileError)
          throw new Error(`Failed to load profile: ${profileError.message}`)
        }
        
        if (profileData) {
          setProfile(profileData)
          setEditForm({
            name: profileData.name,
            whatsapp_number: profileData.whatsapp_number || ''
          })
        } else {
          // If no profile data exists, create a default profile
          setProfile({
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            whatsapp_number: '',
            total_donations: 0
          })
          setEditForm({
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            whatsapp_number: ''
          })
        }

        // Load user's food items
        const { data: itemsData, error: itemsError } = await getUserFoodItems(user.id)
        if (itemsError) {
          console.error('Items error:', itemsError)
          // Don't throw error for items, just log it
          console.warn('Failed to load user items:', itemsError.message)
        }
        
        setUserItems(itemsData || [])
      } catch (error) {
        console.error('Error loading user data:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load profile data'
        setError(errorMessage)
        
        // Set fallback profile data from user metadata
        if (user) {
          setProfile({
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            whatsapp_number: '',
            total_donations: 0
          })
          setEditForm({
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            whatsapp_number: ''
          })
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [user, router, authLoading])

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

  if (authLoading || isLoading) {
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
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError('')}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
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
                  <p className="font-medium text-black">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium text-black">
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
