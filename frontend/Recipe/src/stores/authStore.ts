import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, auth, db } from '@/lib/supabase'
import type { User, Session, LoginFormData, SignupFormData, ProfileFormData } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!session.value)
  const userId = computed(() => user.value?.id ?? null)

  // Initialize auth state
  async function initialize() {
    if (initialized.value) return
    
    try {
      loading.value = true
      
      // Get current session
      const currentSession = await auth.getSession()
      if (currentSession?.user) {
        session.value = currentSession as unknown as Session
        
        // Fetch user profile
        const profile = await db.getProfile(currentSession.user.id)
        user.value = profile
      }
    } catch (err: any) {
      console.error('Auth initialization error:', err)
      error.value = err.message
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  // Sign up
  async function signUp(formData: SignupFormData) {
    loading.value = true
    error.value = null
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      // Validate password strength
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      const { data, error: authError } = await auth.signUp(
        formData.email,
        formData.password,
        formData.username
      )
      
      if (authError) throw authError
      
      if (data.user) {
        session.value = data.session as unknown as Session
        
        // Fetch the created profile
        const profile = await db.getProfile(data.user.id)
        user.value = profile
      }
      
      return { success: true, message: 'Account created successfully!' }
    } catch (err: any) {
      error.value = err.message || 'Failed to create account'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Sign in
  async function signIn(formData: LoginFormData) {
    loading.value = true
    error.value = null
    
    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password')
      }
      
      const { data, error: authError } = await auth.signIn(
        formData.email,
        formData.password
      )
      
      if (authError) {
        if (authError.message.includes('Invalid login')) {
          throw new Error('Invalid email or password')
        }
        throw authError
      }
      
      if (data.session?.user) {
        session.value = data.session as unknown as Session
        
        // Fetch user profile
        const profile = await db.getProfile(data.session.user.id)
        user.value = profile
      }
      
      return { success: true, message: 'Welcome back!' }
    } catch (err: any) {
      error.value = err.message || 'Failed to sign in'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Sign out
  async function signOut() {
    loading.value = true
    error.value = null
    
    try {
      await auth.signOut()
      user.value = null
      session.value = null
      
      // Clear local storage
      localStorage.removeItem('supabase.session')
    } catch (err: any) {
      error.value = err.message || 'Failed to sign out'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update profile
  async function updateProfile(formData: ProfileFormData) {
    if (!user.value) {
      throw new Error('Not authenticated')
    }
    
    loading.value = true
    error.value = null
    
    try {
      const updatedProfile = await db.updateProfile(user.value.id, {
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      })
      
      user.value = updatedProfile
      return { success: true, message: 'Profile updated successfully!' }
    } catch (err: any) {
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  // Set up auth state listener
  function onAuthStateChange() {
    supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_OUT') {
        user.value = null
        session.value = null
      } else if (currentSession?.user) {
        session.value = currentSession as unknown as Session
        
        // Fetch user profile if not already set
        if (!user.value || user.value.id !== currentSession.user.id) {
          try {
            const profile = await db.getProfile(currentSession.user.id)
            user.value = profile
          } catch (err) {
            console.error('Error fetching profile:', err)
          }
        }
      }
    })
  }

  return {
    // State
    user,
    session,
    loading,
    error,
    initialized,
    
    // Computed
    isAuthenticated,
    userId,
    
    // Actions
    initialize,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError,
    onAuthStateChange
  }
})
