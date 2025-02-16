<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <!-- Hero Section -->
    <div class="w-full bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0">
        <img src="@/assets/images/cooking-background-b5hsww3u8a7hkfrd.jpg" alt="Recipe background" class="w-full h-full object-cover opacity-20">
      </div>
      
      <div class="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="text-center max-w-7xl mx-auto">
          <div class="mb-8 animate-fade-in">
            <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm">
              <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ recipes.length }}+ Recipes Available
            </span>
          </div>

          <h1 class="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight text-balance animate-fade-in">
            Discover & Share<br class="hidden sm:block">Amazing Recipes
          </h1>
          <p class="text-lg sm:text-xl text-blue-100 mb-12 animate-fade-in-delay">
            Join our community of food lovers and share your culinary masterpieces
          </p>

          <!-- Search Section -->
          <div class="max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
            <div class="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl">
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex-1 relative">
                  <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search recipes..." 
                    class="w-full pl-10 pr-4 py-3.5 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent border border-gray-200"
                    @keyup.enter="handleSearch"
                  >
                  <div v-if="searchQuery" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <button 
                      @click="searchQuery = ''"
                      class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <select 
                  v-model="selectedCategory"
                  class="w-full sm:w-auto px-4 py-3.5 bg-transparent text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <button 
                  @click="handleSearch"
                  class="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                  Search
                </button>
              </div>
              
              <!-- Popular Searches -->
              <div class="mt-3 flex items-center gap-2 px-1">
                <span class="text-sm text-gray-500">Popular:</span>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="tag in ['Quick & Easy', 'Vegetarian', 'Desserts', 'Healthy']" 
                    :key="tag"
                    @click="quickSearch(tag)"
                    class="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="w-full max-w-[2000px] mx-auto">
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

        <!-- Content (only show when not loading and no error) -->
        <div v-else>
          <!-- Stats Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-xl">
                  <svg class="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ recipes.length }}</div>
                  <div class="text-sm text-gray-500">Total Recipes</div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-50 rounded-xl">
                  <svg class="w-6 h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ bookmarkedCount }}</div>
                  <div class="text-sm text-gray-500">Bookmarked</div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-yellow-50 rounded-xl">
                  <svg class="w-6 h-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}</div>
                  <div class="text-sm text-gray-500">Avg Rating</div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-50 rounded-xl">
                  <svg class="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ totalReviews }}</div>
                  <div class="text-sm text-gray-500">Reviews</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Pills and View Toggle -->
          <div class="bg-white p-3 rounded-2xl shadow-sm mt-8">
            <div class="flex items-center justify-between">
              <div class="flex-1 flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
                <button 
                  type="button"
                  @click="selectedCategory = ''"
                  class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer"
                  :class="!selectedCategory ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'"
                >
                  All
                </button>
                <button 
                  v-for="category in categories" 
                  :key="category"
                  type="button"
                  @click="selectedCategory = category"
                  class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer"
                  :class="selectedCategory === category ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'"
                >
                  {{ category }}
                </button>
              </div>

              <div class="flex items-center gap-2 ml-4 flex-shrink-0 border-l pl-4">
                <button 
                  type="button"
                  @click="viewMode = 'grid'"
                  class="p-2 rounded-lg transition-colors cursor-pointer"
                  :class="[
                    viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  @click="viewMode = 'list'"
                  class="p-2 rounded-lg transition-colors cursor-pointer"
                  :class="[
                    viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Recipe Grid/List -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              v-for="recipe in filteredRecipes" 
              :key="recipe.id"
              class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <router-link :to="`/recipe/${recipe._id}`">
                <div class="relative">
                  <img 
                    :src="recipe.image" 
                    :alt="recipe.title"
                    class="w-full aspect-[4/3] object-cover rounded-t-2xl group-hover:brightness-105 transition-all duration-300"
                  >
                  <div class="absolute top-3 right-3">
                    <button 
                      @click.stop="toggleBookmark(recipe)"
                      class="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group/btn"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-5 w-5 transition-colors" 
                        :class="recipe.isBookmarked ? 'text-yellow-500' : 'text-gray-400 group-hover/btn:text-gray-600'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="p-5">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                      {{ recipe.category }}
                    </span>
                    <span class="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                      {{ recipe.difficulty }}
                    </span>
                  </div>
                  
                  <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{{ recipe.title }}</h3>
                  <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ recipe.description }}</p>
                  
                  <div class="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                    <div class="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      {{ recipe.cookTime }}
                    </div>
                    <div class="flex items-center text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {{ recipe.rating }}
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="recipe in filteredRecipes" 
              :key="recipe.id"
              class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <router-link :to="`/recipe/${recipe._id}`" class="flex flex-col sm:flex-row">
                <div class="relative w-full sm:w-48 h-48 flex-shrink-0">
                  <img 
                    :src="recipe.image" 
                    :alt="recipe.title"
                    class="w-full h-full object-cover sm:rounded-l-2xl group-hover:brightness-105 transition-all duration-300"
                  >
                  <div class="absolute top-3 right-3">
                    <button 
                      @click.stop="toggleBookmark(recipe)"
                      class="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group/btn"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-5 w-5 transition-colors" 
                        :class="recipe.isBookmarked ? 'text-yellow-500' : 'text-gray-400 group-hover/btn:text-gray-600'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="flex-1 p-5">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        {{ recipe.category }}
                      </span>
                      <span class="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                        {{ recipe.difficulty }}
                      </span>
                    </div>
                  </div>
                  
                  <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{{ recipe.title }}</h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">{{ recipe.description }}</p>
                  
                  <div class="flex items-center gap-6 text-sm">
                    <div class="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      {{ recipe.cookTime }}
                    </div>
                    <div class="flex items-center text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {{ recipe.rating }}
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredRecipes.length === 0" class="text-center py-16">
            <div class="bg-white rounded-2xl p-8 max-w-lg mx-auto shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p class="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                @click="() => { searchQuery = ''; selectedCategory = ''; }"
                class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { recipeService } from '@/services/recipe';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

export default {
  name: 'HomeView',
  setup() {
    const userStore = useUserStore();
    const { isLoggedIn } = storeToRefs(userStore);
    return { isLoggedIn };
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      viewMode: 'grid',
      categories: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Vegetarian', 'Vegan'],
      recipes: [],
      isLoading: true,
      error: null
    };
  },
  watch: {
    selectedCategory(newVal) {
      this.handleCategoryChange(newVal);
    },
    viewMode(newVal) {
      this.handleViewModeChange(newVal);
    }
  },
  computed: {
    filteredRecipes() {
      if (!this.recipes.length) return [];
      
      let filtered = [...this.recipes];
      
      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(recipe => 
          recipe.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(recipe => {
          if (!recipe.category) return false;
          return recipe.category.toLowerCase() === this.selectedCategory.toLowerCase();
        });
      }
      
      return filtered;
    },
    bookmarkedCount() {
      return this.recipes.filter(recipe => recipe.isBookmarked).length;
    },
    averageRating() {
      const ratings = this.recipes.map(recipe => recipe.rating);
      return ratings.length ? ratings.reduce((a, b) => a + b) / ratings.length : 0;
    },
    totalReviews() {
      return this.recipes.reduce((total, recipe) => total + (recipe.reviews?.length || 0), 0);
    }
  },
  methods: {
    handleCategoryChange(category) {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    handleViewModeChange(mode) {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    async fetchRecipes() {
      this.isLoading = true;
      this.error = null;
      
      try {
        console.log('HomeView: Starting to fetch recipes');
        const recipes = await recipeService.getAllRecipes();
        console.log('HomeView: Received recipes from service:', {
          count: recipes.length,
          sampleTitles: recipes.slice(0, 3).map(r => r.title)
        });
        
        if (!Array.isArray(recipes)) {
          console.error('HomeView: Invalid recipes format:', recipes);
          throw new Error('Invalid response format: expected an array of recipes');
        }
        
        this.recipes = recipes.map(recipe => {
          if (!recipe._id || !recipe.title) {
            console.warn('HomeView: Recipe missing required fields:', recipe);
          }
          
          console.log('HomeView: Processing recipe:', {
            id: recipe._id,
            title: recipe.title,
            hasImage: !!recipe.image,
            category: recipe.category
          });
          
          return {
            ...recipe,
            category: (recipe.category || 'Uncategorized').toLowerCase()
          };
        });
        
        console.log('HomeView: Recipe processing complete.', {
          totalRecipes: this.recipes.length,
          categories: [...new Set(this.recipes.map(r => r.category))]
        });
      } catch (error) {
        console.error('HomeView: Error fetching recipes:', {
          message: error.message,
          stack: error.stack,
          response: {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
          }
        });
        
        // Provide more specific error messages
        if (error.response?.status === 404) {
          this.error = 'The recipe service is currently unavailable. Please ensure the server is running at http://localhost:5000';
        } else if (error.response?.status === 401) {
          this.error = 'Your session has expired. Please log in again.';
        } else if (error.message.includes('Network Error')) {
          this.error = 'Unable to connect to the recipe service. Please check your internet connection and ensure the server is running.';
        } else {
          this.error = error.message || 'Failed to load recipes. Please try again later.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    async toggleBookmark(recipe) {
      if (!this.isLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirect: this.$route.fullPath }
        });
        return;
      }

      try {
        const response = await recipeService.toggleBookmark(recipe._id);
        recipe.isBookmarked = response.isBookmarked;
      } catch (error) {
        // Handle error silently
      }
    },
    async handleSearch() {
      await this.fetchRecipes();
    },
    quickSearch(tag) {
      this.searchQuery = tag;
      this.handleSearch();
    }
  },
  created() {
    this.fetchRecipes();
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
