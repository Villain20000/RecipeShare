<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden group">
    <div class="relative">
      <img 
        :src="recipe.image" 
        :alt="recipe.title" 
        class="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
      >
      <div class="absolute top-2 right-2">
        <button 
          @click.stop="toggleBookmark"
          class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="isBookmarked ? 'text-yellow-500' : 'text-gray-400'"
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full text-gray-600">
          {{ recipe.category }}
        </span>
        <span class="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full text-gray-600">
          {{ recipe.difficulty }}
        </span>
      </div>
      
      <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ recipe.title }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ recipe.description }}</p>
      
      <div class="flex items-center justify-between border-t pt-4">
        <div class="flex items-center gap-4">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-700">{{ recipe.rating }}</span>
          </div>
          <div class="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
            <span class="ml-1 text-sm">{{ recipe.cookTime }}</span>
          </div>
        </div>
        
        <router-link 
          :to="`/recipe/${recipe.id}`" 
          class="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center transition-colors"
        >
          View Recipe
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBookmarked: false
    };
  },
  methods: {
    toggleBookmark() {
      this.isBookmarked = !this.isBookmarked;
      // TODO: Implement actual bookmark functionality with backend
    }
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
</style>
