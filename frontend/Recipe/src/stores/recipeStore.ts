import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, realtime } from '@/lib/supabase'
import type { Recipe, RecipeFormData, RecipeFilters, Bookmark } from '@/types'

export const useRecipeStore = defineStore('recipe', () => {
  // State
  const recipes = ref<Recipe[]>([])
  const currentRecipe = ref<Recipe | null>(null)
  const userRecipes = ref<Recipe[]>([])
  const bookmarks = ref<(Bookmark & { recipe: Recipe })[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<RecipeFilters>({
    sortBy: 'created_at',
    sortOrder: 'desc'
  })
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(12)

  // Computed
  const hasMore = computed(() => recipes.value.length < totalCount.value)
  const isEmpty = computed(() => recipes.value.length === 0 && !loading.value)
  
  // Get filtered recipes
  async function fetchRecipes(append = false) {
    loading.value = true
    error.value = null
    
    try {
      const offset = append ? recipes.value.length : 0
      
      const result = await db.getRecipes({
        category: filters.value.category,
        difficulty: filters.value.difficulty,
        search: filters.value.searchQuery,
        limit: pageSize.value,
        offset
      })
      
      if (append) {
        recipes.value = [...recipes.value, ...result.data]
      } else {
        recipes.value = result.data
      }
      
      totalCount.value = result.count || 0
      currentPage.value = Math.ceil(recipes.value.length / pageSize.value) || 1
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch recipes'
      console.error('Error fetching recipes:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single recipe
  async function fetchRecipeById(id: string) {
    loading.value = true
    error.value = null
    
    try {
      currentRecipe.value = await db.getRecipeById(id)
      return currentRecipe.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch recipe'
      console.error('Error fetching recipe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get user's recipes
  async function fetchUserRecipes(userId: string) {
    loading.value = true
    error.value = null
    
    try {
      userRecipes.value = await db.getUserRecipes(userId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user recipes'
      console.error('Error fetching user recipes:', err)
    } finally {
      loading.value = false
    }
  }

  // Create recipe
  async function createRecipe(formData: RecipeFormData, authorId: string) {
    loading.value = true
    error.value = null
    
    try {
      // Upload image if present
      let imageUrl: string | undefined
      if (formData.image) {
        imageUrl = await db.uploadImage(formData.image)
      }
      
      const recipeData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        cook_time: formData.cook_time,
        difficulty: formData.difficulty,
        servings: formData.servings,
        image_url: imageUrl,
        ingredients: formData.ingredients.filter(i => i.trim()),
        instructions: formData.instructions.filter(i => i.trim()),
        author_id: authorId,
        is_published: true
      }
      
      const newRecipe = await db.createRecipe(recipeData)
      
      // Add to local state
      recipes.value = [newRecipe, ...recipes.value]
      userRecipes.value = [newRecipe, ...userRecipes.value]
      
      return newRecipe
    } catch (err: any) {
      error.value = err.message || 'Failed to create recipe'
      console.error('Error creating recipe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update recipe
  async function updateRecipe(id: string, formData: RecipeFormData) {
    loading.value = true
    error.value = null
    
    try {
      const updateData: Partial<Recipe> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        cook_time: formData.cook_time,
        difficulty: formData.difficulty,
        servings: formData.servings,
        ingredients: formData.ingredients.filter(i => i.trim()),
        instructions: formData.instructions.filter(i => i.trim())
      }
      
      // Upload new image if present
      if (formData.image instanceof File) {
        updateData.image_url = await db.uploadImage(formData.image)
      }
      
      const updatedRecipe = await db.updateRecipe(id, updateData)
      
      // Update local state
      const recipeIndex = recipes.value.findIndex(r => r.id === id)
      if (recipeIndex !== -1) {
        recipes.value[recipeIndex] = updatedRecipe
      }
      
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = updatedRecipe
      }
      
      const userRecipeIndex = userRecipes.value.findIndex(r => r.id === id)
      if (userRecipeIndex !== -1) {
        userRecipes.value[userRecipeIndex] = updatedRecipe
      }
      
      return updatedRecipe
    } catch (err: any) {
      error.value = err.message || 'Failed to update recipe'
      console.error('Error updating recipe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete recipe
  async function deleteRecipe(id: string) {
    loading.value = true
    error.value = null
    
    try {
      await db.deleteRecipe(id)
      
      // Remove from local state
      recipes.value = recipes.value.filter(r => r.id !== id)
      userRecipes.value = userRecipes.value.filter(r => r.id !== id)
      
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete recipe'
      console.error('Error deleting recipe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Bookmarks
  async function fetchBookmarks(userId: string) {
    loading.value = true
    error.value = null
    
    try {
      bookmarks.value = await db.getBookmarks(userId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookmarks'
      console.error('Error fetching bookmarks:', err)
    } finally {
      loading.value = false
    }
  }

  async function toggleBookmark(userId: string, recipeId: string) {
    try {
      const isBookmarked = await db.isBookmarked(userId, recipeId)
      
      if (isBookmarked) {
        await db.removeBookmark(userId, recipeId)
        bookmarks.value = bookmarks.value.filter(b => b.recipe_id !== recipeId)
      } else {
        await db.addBookmark(userId, recipeId)
        // Refresh bookmarks to get full recipe data
        await fetchBookmarks(userId)
      }
      
      return !isBookmarked
    } catch (err: any) {
      error.value = err.message || 'Failed to toggle bookmark'
      console.error('Error toggling bookmark:', err)
      throw err
    }
  }

  async function checkIsBookmarked(userId: string, recipeId: string): Promise<boolean> {
    try {
      return await db.isBookmarked(userId, recipeId)
    } catch {
      return false
    }
  }

  // Filters
  function setFilters(newFilters: Partial<RecipeFilters>) {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1
    fetchRecipes()
  }

  function clearFilters() {
    filters.value = {
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
    currentPage.value = 1
    fetchRecipes()
  }

  function loadMore() {
    if (hasMore.value && !loading.value) {
      fetchRecipes(true)
    }
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  // Subscribe to real-time updates
  function subscribeToRecipes(callback: (payload: any) => void) {
    return realtime.subscribeToRecipes(callback)
  }

  return {
    // State
    recipes,
    currentRecipe,
    userRecipes,
    bookmarks,
    loading,
    error,
    filters,
    totalCount,
    currentPage,
    pageSize,
    
    // Computed
    hasMore,
    isEmpty,
    
    // Actions
    fetchRecipes,
    fetchRecipeById,
    fetchUserRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    fetchBookmarks,
    toggleBookmark,
    checkIsBookmarked,
    setFilters,
    clearFilters,
    loadMore,
    clearError,
    subscribeToRecipes
  }
})
