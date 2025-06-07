'use client'

import { useState } from 'react'
import { FoodItem } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  foodItem: FoodItem | null
  onSubmit: (requestData: {
    foodItemId: string
    requesterId: string
    requesterName: string
    requesterContact: string
    message: string
  }) => Promise<void>
}

export default function RequestModal({ isOpen, onClose, foodItem, onSubmit }: RequestModalProps) {
  const { user } = useAuth()
  const t = useTranslations()
  const [formData, setFormData] = useState({
    requesterName: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    requesterContact: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !foodItem) {
      setError(t('request.mustBeLoggedIn'))
      return
    }

    if (!formData.requesterName.trim() || !formData.requesterContact.trim()) {
      setError(t('request.fillAllFields'))
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSubmit({
        foodItemId: foodItem.id,
        requesterId: user.id,
        requesterName: formData.requesterName.trim(),
        requesterContact: formData.requesterContact.trim(),
        message: formData.message.trim()
      })
      
      // Reset form and close modal
      setFormData({
        requesterName: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
        requesterContact: '',
        message: ''
      })
      onClose()
    } catch (err) {
      setError(t('request.submitError'))
      console.error('Error submitting food request:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('request.title')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          {/* Food Item Info */}
          {foodItem && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{foodItem.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{foodItem.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>📍 {foodItem.location}</span>
                <span>📅 {t('request.expires')}: {new Date(foodItem.expiry_date).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Auth Check */}
          {!user && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {t('request.pleaseLogin')}
            </div>
          )}

          {/* Form */}
          {user && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Requester Name */}
              <div>
                <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('request.yourName')} *
                </label>
                <input
                  type="text"
                  id="requesterName"
                  value={formData.requesterName}
                  onChange={(e) => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  required
                  disabled={loading}
                />
              </div>

              {/* Contact Info */}
              <div>
                <label htmlFor="requesterContact" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('request.contactInfo')} *
                </label>
                <input
                  type="text"
                  id="requesterContact"
                  value={formData.requesterContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, requesterContact: e.target.value }))}
                  placeholder={t('request.contactPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  required
                  disabled={loading}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('request.message')}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={t('request.messagePlaceholder')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  disabled={loading}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {t('request.submitting')}
                    </>
                  ) : (
                    t('request.submitRequest')
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login Prompt */}
          {!user && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/login"
                className="inline-block px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all"
              >
                {t('request.loginToRequest')}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
