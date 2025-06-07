'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Plus, LogOut, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { NotificationBell } from '@/components/NotificationBell'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslations, useLocale } from 'next-intl'

export function Header() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()

  const handleLogout = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  }

  return (
    <header className="bg-gradient-to-r from-white/90 via-blue-50/90 to-green-50/90 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 group py-2">
            <div className="relative">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🌾</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              Barcha!
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href={`/${locale}/browse`} className="px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-green-200 hover:shadow-md">
              {t('nav.browse')}
            </Link>
            <Link href={`/${locale}/add-item`} className="px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 flex items-center space-x-2 font-medium backdrop-blur-sm border border-transparent hover:border-green-200 hover:shadow-md">
              <Plus size={18} />
              <span>{t('nav.addItem')}</span>
            </Link>
            <Link href={`/${locale}/faq`} className="px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 font-medium backdrop-blur-sm border border-transparent hover:border-green-200 hover:shadow-md">
              {t('nav.faq')}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            {user ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* Favorites */}
                <Link href={`/${locale}/favorites`} className="p-3 text-gray-700 hover:text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-red-200 hover:shadow-md">
                  <Heart size={22} />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-green-200 hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold">{getUserDisplayName()}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50">                    <div className="px-5 py-3 border-b border-gray-100/50">
                      <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-green-600 font-medium">{t('nav.communityMember')}</p>
                    </div>
                      <Link href={`/${locale}/profile`} className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-200">
                        {t('nav.profile')}
                      </Link>
                      <Link href={`/${locale}/my-items`} className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-200">
                        {t('nav.myItems')}
                      </Link>
                      <Link href={`/${locale}/favorites`} className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200">
                        {t('nav.favorites')}
                      </Link>
                      <Link href={`/${locale}/requests`} className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-200">
                        {t('nav.requests')}
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                      >
                        <LogOut size={16} className="inline mr-2" />
                        {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="secondary" asChild className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 rounded-xl px-6 py-3 font-semibold transition-all duration-300">
                  <Link href={`/${locale}/login`}>{t('nav.signIn')}</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 hover:from-green-700 hover:via-emerald-700 hover:to-blue-700 rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link href={`/${locale}/signup`}>{t('nav.signUp')}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-green-200 hover:shadow-md"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 border-t border-white/20 bg-gradient-to-r from-white/95 via-blue-50/95 to-green-50/95 backdrop-blur-xl">
            <div className="flex flex-col space-y-2">
              <Link 
                href={`/${locale}`}
                className="px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                href={`/${locale}/browse`}
                className="px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.browse')}
              </Link>
              <Link 
                href={`/${locale}/add-item`}
                className="px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 flex items-center space-x-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus size={18} />
                <span>{t('nav.addItem')}</span>
              </Link>
              <Link 
                href={`/${locale}/faq`}
                className="px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.faq')}
              </Link>
              
              {/* Language Switcher for Mobile */}
              <div className="px-4 py-3">
                <LanguageSwitcher />
              </div>
              
              {!user && (
                <div className="pt-6 border-t border-white/20 mt-6">
                  <div className="flex flex-col space-y-3">
                    <Button variant="ghost" asChild className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 rounded-xl font-semibold">
                      <Link href={`/${locale}/login`} onClick={() => setIsMenuOpen(false)}>
                        {t('nav.signIn')}
                      </Link>
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 hover:from-green-700 hover:via-emerald-700 hover:to-blue-700 rounded-xl font-semibold shadow-lg">
                      <Link href={`/${locale}/signup`} onClick={() => setIsMenuOpen(false)}>
                        {t('nav.signUp')}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              
              {user && (
                <div className="pt-6 border-t border-white/20 mt-6">
                  <div className="flex items-center space-x-4 px-4 py-4 mb-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-green-600 font-medium">{t('nav.communityMember')}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/${locale}/profile`}
                    className="block px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <Link 
                    href={`/${locale}/my-items`}
                    className="block px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.myItems')}
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 font-medium"
                  >
                    <LogOut size={18} className="inline mr-2" />
                    {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
