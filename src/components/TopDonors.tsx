'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { User } from '@/types'

interface TopDonorsProps {
  users: User[]
  limit?: number
}

export default function TopDonors({ users, limit = 5 }: TopDonorsProps) {
  const topUsers = users
    .sort((a, b) => b.total_donations - a.total_donations)
    .slice(0, limit)

  const getIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="text-yellow-500" size={20} />
      case 1:
        return <Medal className="text-gray-400" size={20} />
      case 2:
        return <Award className="text-amber-600" size={20} />
      default:
        return <span className="text-gray-500 font-semibold">{position + 1}</span>
    }
  }

  const getBadgeColor = (position: number) => {
    switch (position) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg'
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-md'
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm'
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
          <Trophy className="text-white" size={20} />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">Top Donors This Week</h2>
      </div>
      
      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <div 
            key={user.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index < 3 ? 'bg-gray-50 border border-gray-200' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getBadgeColor(index)}`}>
                {getIcon(index)}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {user.total_donations} donation{user.total_donations !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {index === 0 && (
              <div className="flex items-center space-x-1 text-green-600">
                <span className="text-sm font-medium">Champion</span>
                <Trophy size={16} />
              </div>
            )}
          </div>
        ))}
        
        {topUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No donations yet this week.</p>
            <p className="text-sm">Be the first to share food!</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800 text-center">
          🌱 Every donation helps reduce food waste and supports our community!
        </p>
      </div>
    </div>
  )
}
