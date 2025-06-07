'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle, user, loading } = useAuth()
  const t = useTranslations()
  const locale = useLocale()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((error as any).message || t('login.loginFailed'))
      } else {
        router.push(`/${locale}`)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(t('login.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      const { error } = await signInWithGoogle()
      
      if (error) {
        console.error('Google sign-in error:', error)
        setError(t('login.googleSignInFailed'))
      }
      // The redirect will be handled by the OAuth flow
    } catch (error) {
      console.error('Google sign-in error:', error)
      setError(t('login.googleUnexpectedError'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 via-emerald-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-2xl">🌾</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{t('login.title')}</h2>
              <p className="text-gray-600 mt-2">{t('login.subtitle')}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('login.emailLabel')}
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder={t('login.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('login.passwordLabel')}
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t('login.passwordPlaceholder')}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium">
                    {t('login.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                    {t('login.forgotPassword')}
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl shadow-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-emerald-600 via-green-500 to-blue-600 hover:from-emerald-700 hover:via-green-600 hover:to-blue-700 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('login.signingIn')}</span>
                  </div>
                ) : (
                  t('login.signIn')
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">{t('login.orContinueWith')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('login.signInWithGoogle')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <span className="text-gray-600">{t('login.noAccount')} </span>
              <Link href={`/${locale}/signup`} className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                {t('login.signUpHere')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


