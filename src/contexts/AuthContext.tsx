'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { hasValidSupabaseConfig } from '@/lib/dev-config'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: unknown }>
  signUp: (email: string, password: string, userData: { name: string; whatsapp_number?: string }) => Promise<{ error: unknown }>
  signInWithGoogle: () => Promise<{ error: unknown }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Supabase is not properly configured
    if (!hasValidSupabaseConfig()) {
      console.warn('Supabase is not configured. Skipping auth initialization.')
      setLoading(false)
      return
    }
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Auth session error:', error)
        }
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Continue without auth if Supabase is not configured
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)

          // Create user profile if signing up
          if (event === 'SIGNED_UP' as AuthChangeEvent && session?.user) {
            await createUserProfile(session.user)
          }

          // Create user profile for Google OAuth if it doesn't exist
          if (event === 'SIGNED_IN' as AuthChangeEvent && session?.user) {
            // Check if this is a Google OAuth sign-in by looking at the provider
            if (session.user.app_metadata?.provider === 'google') {
              await createUserProfileIfNotExists(session.user)
            }
          }
        }
      )

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Auth subscription error:', error)
      return () => {} // Return empty cleanup function
    }
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || 'Anonymous User',
            whatsapp_number: user.user_metadata?.whatsapp_number || null,
            total_donations: 0,
          }
        ])
      
      if (error) {
        console.error('Error creating user profile:', error)
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  const createUserProfileIfNotExists = async (user: User) => {
    try {
      // Check if user profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "row not found" error, which is expected if profile doesn't exist
        console.error('Error checking user profile:', checkError)
        return
      }

      // If profile doesn't exist, create one
      if (!existingProfile) {
        const { error } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Google User',
              whatsapp_number: null,
              total_donations: 0,
            }
          ])
        
        if (error) {
          console.error('Error creating Google user profile:', error)
        }
      }
    } catch (error) {
      console.error('Error creating Google user profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData: { name: string; whatsapp_number?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
