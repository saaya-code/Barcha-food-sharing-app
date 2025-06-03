'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Plus, User, LogOut } from 'lucide-react'

interface HeaderProps {
  isAuthenticated?: boolean
  userName?: string
  onLogout?: () => void
}

export default function Header({ isAuthenticated = false, userName, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-gray-900">Barsha</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-gray-600 hover:text-green-600 transition-colors">
              Browse Food
            </Link>
            <Link href="/add-item" className="text-gray-600 hover:text-green-600 transition-colors">
              Add Item
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-green-600 transition-colors">
              FAQ
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <User size={20} />
                    {userName && <span>{userName}</span>}
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button 
                        onClick={() => {
                          onLogout?.()
                          setIsUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Sign In
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`md:hidden py-4 border-t border-gray-200 ${isMenuOpen ? 'block' : 'hidden'}`} role="navigation">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="text-gray-600 hover:text-green-600 px-2 py-1">
              Home
            </Link>
            <Link href="/browse" className="text-gray-600 hover:text-green-600 px-2 py-1">
              Browse
            </Link>
            <Link href="/add-item" className="text-gray-600 hover:text-green-600 px-2 py-1">
              Add Item
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-green-600 px-2 py-1">
              FAQ
            </Link>
            
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => {
                    onLogout?.()
                    setIsMenuOpen(false)
                  }}
                  className="text-gray-600 hover:text-red-600 px-2 py-1 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-green-600 px-2 py-1"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-green-600 text-white px-3 py-2 rounded-lg w-fit"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
