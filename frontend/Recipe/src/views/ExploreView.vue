<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative h-[300px] overflow-hidden">
      <!-- Carousel slides -->
      <div 
        v-for="(slide, index) in heroSlides" 
        :key="index"
        class="absolute inset-0 transition-all duration-700 ease-in-out transform"
        :class="{
          'translate-x-0 opacity-100': currentSlide === index,
          'translate-x-full opacity-0': currentSlide < index,
          '-translate-x-full opacity-0': currentSlide > index
        }"
      >
        <div 
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/75"></div>
        </div>
        <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 
            class="text-4xl sm:text-5xl font-bold text-white mb-4 transform transition-all duration-700 delay-100"
            :class="{ 'translate-y-0 opacity-100': currentSlide === index, 'translate-y-10 opacity-0': currentSlide !== index }"
          >
            {{ slide.title }}
          </h1>
          <p 
            class="text-xl text-blue-100 transform transition-all duration-700 delay-200"
            :class="{ 'translate-y-0 opacity-100': currentSlide === index, 'translate-y-10 opacity-0': currentSlide !== index }"
          >
            {{ slide.description }}
          </p>
        </div>
      </div>

      <!-- Arrow Controls -->
      <button 
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 focus:outline-none group"
      >
        <svg 
          class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 focus:outline-none group"
      >
        <svg 
          class="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Slide Indicators -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        <button
          v-for="(_, index) in heroSlides"
          :key="index"
          @click="currentSlide = index"
          class="w-2 h-2 rounded-full transition-all duration-200 focus:outline-none"
          :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'"
        ></button>
      </div>
    </div>

    <!-- Filters and Content -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="mb-8 bg-white rounded-2xl shadow-sm p-6 transform hover:shadow-md transition-all duration-300">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              id="category"
              v-model="filters.category"
              class="block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Difficulty Filter -->
          <div>
            <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              id="difficulty"
              v-model="filters.difficulty"
              class="block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              <option value="">All Difficulties</option>
              <option v-for="level in difficulties" :key="level" :value="level">
                {{ level }}
              </option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                v-model="filters.search"
                type="text"
                placeholder="Search recipes..."
                class="block w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600 font-medium">Loading recipes...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-red-50 rounded-2xl p-6 max-w-lg mx-auto">
          <div class="flex items-center justify-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-base font-medium text-red-800">{{ error }}</p>
            </div>
          </div>
          <button 
            @click="fetchRecipes"
            class="mt-6 text-blue-600 hover:text-blue-500 font-medium text-sm flex items-center mx-auto bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Try Again
          </button>
        </div>
      </div>

      <!-- Recipe Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="recipe in filteredRecipes" 
          :key="recipe._id"
          class="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <router-link :to="`/recipe/${recipe._id}`">
            <div class="relative h-52">
              <img 
                :src="recipe.image || 'https://via.placeholder.com/400x300'" 
                :alt="recipe.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {{ recipe.category }}
                  </span>
                  <span class="px-3 py-1 bg-gray-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {{ recipe.difficulty }}
                  </span>
                </div>
                <h3 class="font-bold text-xl text-white group-hover:text-blue-200 transition-colors">{{ recipe.title }}</h3>
                <p class="text-sm text-white/90 line-clamp-2 mt-2 group-hover:text-white transition-colors">{{ recipe.description }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="!isLoading && !error && filteredRecipes.length === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl p-8 max-w-lg mx-auto shadow-sm">
          <svg class="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-semibold text-gray-900">No recipes found</h3>
          <p class="mt-2 text-gray-600">Try adjusting your search or filters</p>
          <button 
            @click="() => { filters.category = ''; filters.difficulty = ''; filters.search = ''; }"
            class="mt-6 text-blue-600 hover:text-blue-500 font-medium text-sm flex items-center mx-auto bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { recipeService } from '@/services/recipe';
import { useToastStore } from '@/stores/toastStore';

export default {
  name: 'ExploreView',
  setup() {
    const recipes = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const toastStore = useToastStore();
    const currentSlide = ref(0);
    const autoplayInterval = ref(null);
    
    const filters = ref({
      category: '',
      difficulty: '',
      search: ''
    });

    const categories = [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Dessert',
      'Snack',
      'Vegetarian',
      'Vegan'
    ];

    const difficulties = [
      'Easy',
      'Medium',
      'Hard'
    ];

    const heroSlides = [
      {
        title: "Explore Amazing Recipes",
        description: "Discover delicious dishes from our community of home chefs",
        image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80"
      },
      {
        title: "Cook Like a Pro",
        description: "Learn new techniques and perfect your culinary skills",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Share Your Creations",
        description: "Join our community and showcase your favorite recipes",
        image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
      }
    ];

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % heroSlides.length;
      resetAutoplay();
    };

    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length;
      resetAutoplay();
    };

    const startAutoplay = () => {
      autoplayInterval.value = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    };

    const resetAutoplay = () => {
      if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
        startAutoplay();
      }
    };

    const filteredRecipes = computed(() => {
      return recipes.value.filter(recipe => {
        const matchesCategory = !filters.value.category || recipe.category === filters.value.category;
        const matchesDifficulty = !filters.value.difficulty || recipe.difficulty === filters.value.difficulty;
        const matchesSearch = !filters.value.search || 
          recipe.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          recipe.description.toLowerCase().includes(filters.value.search.toLowerCase());
        
        return matchesCategory && matchesDifficulty && matchesSearch;
      });
    });

    const fetchRecipes = async () => {
      isLoading.value = true;
      error.value = null;
      
      try {
        const data = await recipeService.getAllRecipes();
        recipes.value = data;
      } catch (err) {
        console.error('Error fetching recipes:', err);
        error.value = 'Failed to load recipes. Please try again.';
        toastStore.error('Failed to load recipes. Please try again.');
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchRecipes();
      startAutoplay();
    });

    onUnmounted(() => {
      if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
      }
    });

    return {
      recipes,
      isLoading,
      error,
      filters,
      categories,
      difficulties,
      filteredRecipes,
      fetchRecipes,
      heroSlides,
      currentSlide,
      nextSlide,
      prevSlide
    };
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth slide transitions */
.translate-x-full {
  transform: translateX(100%);
}

.-translate-x-full {
  transform: translateX(-100%);
}

/* Ensure images cover the full width */
.bg-cover {
  background-size: cover;
}
</style>
