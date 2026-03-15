// Database types for Supabase

export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  category: RecipeCategory
  cook_time: number // in minutes
  difficulty: DifficultyLevel
  servings: number
  image_url?: string
  ingredients: string[]
  instructions: string[]
  author_id: string
  author?: User
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface RecipeWithAuthor extends Recipe {
  author: User
}

export interface SavedRecipe {
  id: string
  user_id: string
  recipe_id: string
  recipe?: Recipe
  created_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

export type RecipeCategory = 
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snack'
  | 'appetizer'
  | 'beverage'
  | 'salad'
  | 'soup'
  | 'other'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

export interface RecipeFormData {
  title: string
  description: string
  category: RecipeCategory
  cook_time: number
  difficulty: DifficultyLevel
  servings: number
  image?: File | null
  ingredients: string[]
  instructions: string[]
}

export interface ProfileFormData {
  username?: string
  bio?: string
  avatar_url?: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Auth types
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

// Simple Session type (to be replaced with actual Supabase types after install)
export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
}

// Real-time types
export interface RealtimeRecipeUpdate {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Recipe | null
  old: Recipe | null
}

// UI State types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// Filter types
export interface RecipeFilters {
  category?: RecipeCategory
  difficulty?: DifficultyLevel
  cookTime?: number
  searchQuery?: string
  sortBy?: 'created_at' | 'cook_time' | 'title'
  sortOrder?: 'asc' | 'desc'
}
