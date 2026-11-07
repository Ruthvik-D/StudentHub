import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch student profile from public.profiles
  const fetchProfile = useCallback(async (userId, userMetadata = null) => {
    if (!isSupabaseConfigured || !userId) {
      setProfile(null)
      return null
    }

    try {
      setProfileLoading(true)
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (fetchError) {
        console.error('Error fetching student profile:', fetchError.message)
      }

      if (data) {
        setProfile(data)
        return data
      } else {
        // If trigger has not run yet or profile row doesn't exist, try creating/upserting it
        const fallbackName = userMetadata?.full_name || ''
        const fallbackDept = userMetadata?.department || ''
        const newProfile = {
          id: userId,
          full_name: fallbackName,
          department: fallbackDept,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: upsertData, error: upsertError } = await supabase
          .from('profiles')
          .upsert(newProfile, { onConflict: 'id' })
          .select()
          .maybeSingle()

        if (!upsertError && upsertData) {
          setProfile(upsertData)
          return upsertData
        }

        // Local fallback from user metadata so UI is not empty
        const localFallback = {
          id: userId,
          full_name: fallbackName,
          department: fallbackDept,
          created_at: user?.created_at || new Date().toISOString(),
        }
        setProfile(localFallback)
        return localFallback
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      return null
    } finally {
      setProfileLoading(false)
    }
  }, [user?.created_at])

  // Initialize auth session
  useEffect(() => {
    let mounted = true

    async function initSession() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError.message)
          setError(sessionError.message)
        }

        if (mounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id, initialSession.user.user_metadata)
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err)
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return
        setSession(newSession)
        const currentUser = newSession?.user ?? null
        setUser(currentUser)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (currentUser) {
            await fetchProfile(currentUser.id, currentUser.user_metadata)
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
          setUser(null)
          setSession(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [fetchProfile])

  // Register new student
  const signUp = async ({ email, password, fullName, department = '' }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.')
    }

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = fullName.trim()
    const trimmedDept = department.trim()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
          department: trimmedDept,
        },
      },
    })

    if (signUpError) {
      throw signUpError
    }

    // If an authenticated session is immediately returned (e.g. email confirm disabled)
    if (data?.user) {
      await fetchProfile(data.user.id, { full_name: trimmedName, department: trimmedDept })
    }

    return data
  }

  // Sign in existing student
  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.')
    }

    const trimmedEmail = email.trim().toLowerCase()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (signInError) {
      throw signInError
    }

    if (data?.user) {
      await fetchProfile(data.user.id, data.user.user_metadata)
    }

    return data
  }

  // Sign out student
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      setSession(null)
      setProfile(null)
      return
    }

    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      console.error('Error signing out:', signOutError.message)
      throw signOutError
    }

    setUser(null)
    setSession(null)
    setProfile(null)
  }

  // Send password reset email
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.')
    }

    const trimmedEmail = email.trim().toLowerCase()
    const redirectUrl = `${window.location.origin}/login`

    const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(
      trimmedEmail,
      { redirectTo: redirectUrl }
    )

    if (resetError) {
      throw resetError
    }

    return data
  }

  // Update student profile
  const updateProfile = async ({ fullName, department }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.')
    }

    if (!user) {
      throw new Error('No authenticated student found.')
    }

    const trimmedName = fullName.trim()
    const trimmedDept = department ? department.trim() : ''

    // 1. Update public.profiles in PostgreSQL
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: trimmedName,
        department: trimmedDept,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (profileError) {
      console.warn('Direct profile table update failed, attempting upsert:', profileError.message)
      // Attempt upsert in case the record was not yet created
      const { data: upsertedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: trimmedName,
          department: trimmedDept,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (upsertError) {
        throw new Error(upsertError.message || profileError.message)
      }
      setProfile(upsertedProfile)
    } else {
      setProfile(updatedProfile)
    }

    // 2. Also update Supabase auth metadata to stay in sync
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: trimmedName,
          department: trimmedDept,
        },
      })
    } catch (metaErr) {
      console.warn('Notice: Updating auth user metadata had an error:', metaErr)
    }

    return updatedProfile
  }

  const value = {
    session,
    user,
    profile,
    loading,
    profileLoading,
    error,
    isConfigured: isSupabaseConfigured,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id, user.user_metadata),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
