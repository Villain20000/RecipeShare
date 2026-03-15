import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { User, Session, Recipe, Bookmark, SavedRecipe } from '@/types'

// Environment variables - using import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key: string) => {
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : null
      },
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value)
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key)
      }
    }
  }
})

// Auth helpers
export const auth = {
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // User operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data as User
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data as User
  },

  // Recipe operations
  async getRecipes(filters?: {
    category?: string
    difficulty?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('recipes')
      .select(`
        *,
        author:profiles(*)
      `, { count: 'exact' })
      .eq('is_published', true)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error, count } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return { data: data as Recipe[], count }
  },

  async getRecipeById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Recipe
  },

  async getUserRecipes(userId: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Recipe[]
  },

  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single()
    if (error) throw error
    return data as Recipe
  },

  async updateRecipe(id: string, updates: Partial<Recipe>) {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Recipe
  },

  async deleteRecipe(id: string) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Bookmark operations
  async getBookmarks(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        recipe:recipes(*, author:profiles(*))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as (Bookmark & { recipe: Recipe })[]
  },

  async addBookmark(userId: string, recipeId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: userId, recipe_id: recipeId })
      .select()
      .single()
    if (error) throw error
    return data as Bookmark
  },

  async removeBookmark(userId: string, recipeId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
    if (error) throw error
  },

  async isBookmarked(userId: string, recipeId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  },

  // Storage operations
  async uploadImage(file: File, folder: string = 'recipes') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath)

    return publicUrl
  },

  async deleteImage(imagePath: string) {
    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([imagePath])
    if (error) throw error
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToRecipes(callback: (payload: any) => void) {
    return supabase
      .channel('recipes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, callback)
      .subscribe()
  },

  subscribeToUserBookmarks(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`bookmarks:${userId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` }, 
        callback
      )
      .subscribe()
  }
}

export default supabase
