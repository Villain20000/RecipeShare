<template>
  <div class="group h-full flex flex-col bg-white rounded-3xl border border-surface-200 overflow-hidden transition-all duration-350 hover:shadow-elevation-4 hover:-translate-y-1.5 interactive-card">
    <!-- Image Container -->
    <div class="relative aspect-recipe-card overflow-hidden">
      <img 
        :src="recipe.image" 
        :alt="recipe.title" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      >
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-surface-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Category & Difficulty Badges -->
      <div class="absolute top-4 left-4 flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-white/90 backdrop-blur-md text-surface-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-soft">
          {{ recipe.category }}
        </span>
      </div>

      <!-- Bookmark Button -->
      <button 
        @click.stop="toggleBookmark"
        class="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-soft text-surface-400 hover:text-accent-500 hover:scale-110 transition-all active:scale-95 group/btn"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5" 
          :class="isBookmarked ? 'text-accent-500 fill-current' : 'fill-none'"
          viewBox="0 0 24 24" 
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
    
    <!-- Content -->
    <div class="p-6 flex flex-col flex-1">
      <div class="flex items-center gap-1.5 mb-3">
        <div class="flex text-accent-500">
          <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5" :class="i <= Math.round(recipe.rating) ? 'fill-current' : 'fill-none stroke-current'" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <span class="text-xs font-bold text-surface-400">({{ recipe.rating }})</span>
      </div>

      <h3 class="text-lg font-display font-bold text-surface-900 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
        {{ recipe.title }}
      </h3>
      
      <p class="text-sm text-surface-500 line-clamp-2 mb-6 leading-relaxed">
        {{ recipe.description }}
      </p>
      
      <div class="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 text-surface-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs font-medium">{{ recipe.cookTime }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-surface-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-xs font-medium">{{ recipe.difficulty }}</span>
          </div>
        </div>
        
        <router-link 
          :to="`/recipe/${recipe._id || recipe.id}`" 
          class="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
});

const isBookmarked = ref(props.recipe.isBookmarked || false);

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  // TODO: Implement actual bookmark functionality
};
</script>
