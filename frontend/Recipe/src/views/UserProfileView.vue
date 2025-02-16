<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto bg-red-50 rounded-lg p-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="ml-3 text-red-800">{{ error }}</p>
        </div>
        <button @click="retryLoading" class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
          Retry
        </button>
      </div>

      <!-- Profile Content -->
      <div v-else class="max-w-7xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div class="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div class="absolute bottom-0 left-0 right-0 p-6 flex items-end">
              <div class="flex items-center space-x-6">
                <div class="relative">
                  <img 
                    :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.username || 'User')" 
                    :alt="user?.username"
                    class="w-32 h-32 rounded-full border-4 border-white object-cover"
                    @error="handleImageError"
                  >
                  <button 
                    @click="$router.push('/settings')"
                    class="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <div class="text-white">
                  <h1 class="text-3xl font-bold">{{ user?.username }}</h1>
                  <p class="text-blue-100">{{ user?.email }}</p>
                  <p v-if="user?.bio" class="mt-2 text-blue-50">{{ user?.bio }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white px-6 py-4">
            <div class="flex space-x-8">
              <div class="text-center">
                <span class="block text-2xl font-bold text-gray-900">{{ userRecipes.length }}</span>
                <span class="text-gray-500">Recipes</span>
              </div>
              <div class="text-center">
                <span class="block text-2xl font-bold text-gray-900">{{ savedRecipes.length }}</span>
                <span class="text-gray-500">Saved</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-8">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="currentTab = tab.name"
              :class="[
                currentTab === tab.name
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- My Recipes -->
        <div v-if="currentTab === 'my-recipes'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="userRecipes.length === 0" class="col-span-full text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No recipes yet</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new recipe.</p>
            <div class="mt-6">
              <router-link
                to="/share-recipe"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Create Recipe
              </router-link>
            </div>
          </div>
          <div
            v-else
            v-for="recipe in userRecipes"
            :key="recipe._id"
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <router-link :to="`/recipe/${recipe._id}`">
              <div class="relative h-48">
                <img 
                  :src="recipe.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipe.title)}&size=400&background=e2e8f0&color=64748b`" 
                  :alt="recipe.title"
                  class="w-full h-full object-cover"
                  @error="handleRecipeImageError"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-1 bg-blue-500/80 text-white text-xs font-medium rounded-full">
                      {{ recipe.category }}
                    </span>
                    <span class="px-2 py-1 bg-gray-600/80 text-white text-xs font-medium rounded-full">
                      {{ recipe.difficulty }}
                    </span>
                  </div>
                  <h3 class="font-bold text-lg text-white">{{ recipe.title }}</h3>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Saved Recipes -->
        <div v-else-if="currentTab === 'saved-recipes'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="savedRecipes.length === 0" class="col-span-full text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No saved recipes</h3>
            <p class="mt-1 text-sm text-gray-500">Start saving recipes you like.</p>
            <div class="mt-6">
              <router-link
                to="/explore"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Explore Recipes
              </router-link>
            </div>
          </div>
          <div
            v-else
            v-for="recipe in savedRecipes"
            :key="recipe._id"
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <router-link :to="`/recipe/${recipe._id}`">
              <div class="relative h-48">
                <img 
                  :src="recipe.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipe.title)}&size=400&background=e2e8f0&color=64748b`" 
                  :alt="recipe.title"
                  class="w-full h-full object-cover"
                  @error="handleRecipeImageError"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-1 bg-blue-500/80 text-white text-xs font-medium rounded-full">
                      {{ recipe.category }}
                    </span>
                    <span class="px-2 py-1 bg-gray-600/80 text-white text-xs font-medium rounded-full">
                      {{ recipe.difficulty }}
                    </span>
                  </div>
                  <h3 class="font-bold text-lg text-white">{{ recipe.title }}</h3>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { recipeService } from '@/services/recipe';
import { useToastStore } from '@/stores/toastStore';
import { userService } from '@/services/user';

export default {
  name: 'UserProfileView',
  setup() {
    const userStore = useUserStore();
    const toastStore = useToastStore();

    const isLoading = ref(true);
    const error = ref(null);
    const user = ref(userStore.currentUser);
    const userRecipes = ref([]);
    const savedRecipes = ref([]);
    const currentTab = ref('my-recipes');

    const tabs = [
      { name: 'my-recipes', label: 'My Recipes' },
      { name: 'saved-recipes', label: 'Saved Recipes' }
    ];

    const fetchUserRecipes = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        const recipes = await recipeService.getUserRecipes();
        userRecipes.value = recipes;
      } catch (err) {
        console.error('Error fetching user recipes:', err);
        error.value = 'Failed to load your recipes. Please try refreshing the page.';
        toastStore.error('Failed to load your recipes');
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const recipes = await recipeService.getSavedRecipes();
        savedRecipes.value = recipes;
      } catch (err) {
        console.error('Error fetching saved recipes:', err);
        toastStore.error('Failed to load saved recipes');
      }
    };

    const handleImageError = (event) => {
      event.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.value?.username || 'User');
    };

    const handleRecipeImageError = (event) => {
      const title = event.target.alt;
      event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=400&background=e2e8f0&color=64748b`;
    };

    const retryLoading = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        await Promise.all([
          fetchUserRecipes(),
          fetchSavedRecipes()
        ]);
      } catch (err) {
        console.error('Error retrying load:', err);
        error.value = 'Failed to load data. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        // Get current user data first
        const userData = await userService.getCurrentUser();
        user.value = userData;
        
        // Then fetch recipes
        await Promise.all([
          fetchUserRecipes(),
          fetchSavedRecipes()
        ]);
      } catch (err) {
        console.error('Error loading profile data:', err);
        error.value = 'Failed to load profile data. Please try refreshing the page.';
        toastStore.error('Failed to load profile data');
      } finally {
        isLoading.value = false;
      }
    });

    return {
      user,
      isLoading,
      error,
      userRecipes,
      savedRecipes,
      currentTab,
      tabs,
      handleImageError,
      handleRecipeImageError,
      retryLoading
    };
  }
};
</script>
