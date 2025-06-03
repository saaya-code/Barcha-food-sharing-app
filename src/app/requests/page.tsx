'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Clock, CheckCircle, XCircle, MessageSquare, Phone, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserRequests, updateRequestStatus } from '@/lib/supabase'
import { FoodRequest } from '@/types/database'

const statusConfig: Record<string, {
  color: string
  icon: React.ComponentType<{ size: number; className?: string }>
  label: string
}> = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    label: 'Pending'
  },
  approved: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    label: 'Approved'
  },
  declined: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    label: 'Declined'
  },
  completed: {
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    label: 'Completed'
  }
}

export default function RequestsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [requests, setRequests] = useState<FoodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'completed'>('all')

  const loadRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await getUserRequests(user!.id)
      
      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
      setError('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    loadRequests()
  }, [user, router, loadRequests])

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'declined' | 'completed') => {
    try {
      const { error } = await updateRequestStatus(requestId, newStatus)
      if (error) throw error
      
      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus, updated_at: new Date().toISOString() }
            : req
        )
      )
    } catch (error) {
      console.error('Error updating request status:', error)
      setError('Failed to update request status')
    }
  }

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true
    return request.status === activeTab
  })

  if (loading) {
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Food Requests</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {(['all', 'pending', 'approved', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && (
                  <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {requests.filter(r => r.status === tab).length}
                  </span>
                )}
                {tab === 'all' && (
                  <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {requests.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {activeTab === 'all' ? 'No requests yet' : `No ${activeTab} requests`}
              </h3>
              <p className="text-gray-400 mb-4">
                {activeTab === 'all' 
                  ? 'Start browsing food items to make your first request'
                  : `You don't have any ${activeTab} requests at the moment`
                }
              </p>
              <button
                onClick={() => router.push('/browse')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Food Items
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon
                
                return (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.food_items?.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[request.status].color}`}>
                            <StatusIcon size={12} className="mr-1" />
                            {statusConfig[request.status].label}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{request.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Requested on {new Date(request.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Quantity: {request.food_items?.quantity}</span>
                          <span>•</span>
                          <span>Location: {request.food_items?.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Food Item Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-4">
                        {request.food_items?.image_url && (
                          <img
                            src={request.food_items.image_url}
                            alt={request.food_items.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {request.food_items?.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {request.food_items?.description}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <User size={14} />
                            <span>Donor: {request.food_items?.donor_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {request.status === 'approved' && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'completed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark as Completed
                        </button>
                        {request.food_items?.donor_contact && (
                          <a
                            href={`tel:${request.food_items.donor_contact}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Phone size={16} />
                            <span>Call Donor</span>
                          </a>
                        )}
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="text-sm text-gray-500">
                        Waiting for donor response...
                      </div>
                    )}

                    {request.status === 'completed' && (
                      <div className="text-sm text-green-600">
                        Thank you for completing this food sharing!
                      </div>
                    )}

                    {request.status === 'declined' && (
                      <div className="text-sm text-red-600">
                        This request was declined by the donor.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
