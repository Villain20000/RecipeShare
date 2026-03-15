<template>
  <div class="space-y-0">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center overflow-hidden bg-surface-900 pt-16">
      <!-- Background with Parallax effect -->
      <div class="absolute inset-0 z-0">
        <img 
          src="@/assets/images/cooking-background-b5hsww3u8a7hkfrd.jpg" 
          alt="Recipe background" 
          class="w-full h-full object-cover opacity-30 scale-105"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-surface-900/60 via-surface-900/40 to-surface-50"></div>
      </div>
      
      <div class="container-app relative z-10 py-12 lg:py-24">
        <div class="max-w-4xl mx-auto text-center stagger-children">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 backdrop-blur-md mb-8">
            <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span class="text-brand-400 text-xs font-bold uppercase tracking-widest">{{ recipes.length }}+ Recipes to Discover</span>
          </div>

          <h1 class="text-fluid-h1 font-display font-black text-white mb-6 leading-[1.1] tracking-tight text-balance">
            Elevate Your <span class="text-gradient">Culinary</span> Journey
          </h1>
          <p class="text-fluid-body text-surface-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of food lovers sharing their best recipes. From quick weeknight dinners to gourmet masterpieces, find your next favorite dish here.
          </p>

          <!-- Modern Search Bar -->
          <div class="max-w-2xl mx-auto group">
            <div class="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-elevation-4 transition-all duration-300 group-focus-within:bg-white group-focus-within:shadow-elevation-5">
              <div class="flex flex-col sm:flex-row gap-2">
                <div class="flex-1 relative">
                  <svg class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search recipes, ingredients..." 
                    class="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 text-surface-900 placeholder-surface-400 font-medium"
                    @keyup.enter="handleSearch"
                  >
                </div>
                <Button 
                  variant="primary" 
                  size="lg" 
                  class="rounded-[1.5rem] px-8 py-4 font-bold"
                  @click="handleSearch"
                >
                  Search Now
                </Button>
              </div>
            </div>
            
            <!-- Quick Tags -->
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <button 
                v-for="tag in ['Quick Meals', 'Vegetarian', 'Healthy', 'Trending']" 
                :key="tag"
                @click="quickSearch(tag)"
                class="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/20 hover:text-white transition-all backdrop-blur-md"
              >
                #{{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container-app -mt-10 relative z-20 pb-24">
      <!-- Stats Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
        <div 
          v-for="(stat, index) in stats" 
          :key="stat.label"
          class="glass-card p-6 rounded-3xl flex items-center gap-4 transition-all duration-300 hover:shadow-elevation-3 animate-fade-in-up"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center', stat.bg]">
            <component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
          </div>
          <div>
            <div class="text-2xl font-black text-surface-900 leading-none mb-1">{{ stat.value }}</div>
            <div class="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Filters & Sorting -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          <button 
            @click="selectedCategory = ''"
            :class="['px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap', !selectedCategory ? 'bg-brand-600 text-white shadow-elevation-2' : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200']"
          >
            All Recipes
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="['px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap', selectedCategory === cat ? 'bg-brand-600 text-white shadow-elevation-2' : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200']"
          >
            {{ cat }}
          </button>
        </div>
        
        <div class="flex items-center gap-3 self-end md:self-auto">
          <span class="text-xs font-bold text-surface-400 uppercase tracking-widest mr-2">Layout</span>
          <div class="bg-white p-1 rounded-xl border border-surface-200 flex shadow-soft">
            <button 
              @click="viewMode = 'grid'"
              :class="['p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-surface-400 hover:text-surface-600']"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="['p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-surface-400 hover:text-surface-600']"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Recipes Content -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="n in 8" :key="n" class="space-y-4">
          <Skeleton height="240px" class="rounded-3xl" />
          <div class="space-y-2 px-2">
            <Skeleton width="40%" height="16px" />
            <Skeleton width="80%" height="24px" />
            <Skeleton width="100%" height="40px" />
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-20 bg-white rounded-[3rem] border border-surface-200 shadow-soft">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-2xl font-display font-bold text-surface-900 mb-2">Oops! Something went wrong</h3>
        <p class="text-surface-500 mb-8 max-w-sm mx-auto">{{ error }}</p>
        <Button variant="primary" @click="fetchRecipes" class="rounded-2xl px-8">Try Again</Button>
      </div>

      <div v-else>
        <transition-group 
          v-if="viewMode === 'grid'"
          tag="div"
          name="recipe-list"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <RecipeCard 
            v-for="recipe in filteredRecipes" 
            :key="recipe._id || recipe.id" 
            :recipe="recipe"
            @click-bookmark="toggleBookmark(recipe)"
          />
        </transition-group>
        
        <transition-group 
          v-else
          tag="div"
          name="recipe-list"
          class="space-y-6"
        >
          <div 
            v-for="recipe in filteredRecipes" 
            :key="recipe._id || recipe.id"
            class="group bg-white rounded-3xl border border-surface-200 overflow-hidden flex flex-col md:flex-row hover:shadow-elevation-3 transition-all interactive-card"
          >
            <div class="w-full md:w-72 h-64 md:h-auto overflow-hidden">
              <img :src="recipe.image" :alt="recipe.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            </div>
            <div class="flex-1 p-8 flex flex-col">
              <div class="flex items-center gap-3 mb-4">
                <span class="badge badge-primary">{{ recipe.category }}</span>
                <span class="badge badge-secondary">{{ recipe.difficulty }}</span>
                <div class="flex items-center gap-1.5 text-accent-500 ml-auto font-bold">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{{ recipe.rating }}</span>
                </div>
              </div>
              <h3 class="text-2xl font-display font-bold text-surface-900 mb-3 group-hover:text-brand-600 transition-colors">
                {{ recipe.title }}
              </h3>
              <p class="text-surface-500 line-clamp-2 mb-8 flex-1 leading-relaxed">
                {{ recipe.description }}
              </p>
              <div class="flex items-center justify-between mt-auto">
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-2 text-surface-400 font-medium">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ recipe.cookTime }}
                  </div>
                </div>
                <Button 
                  :to="`/recipe/${recipe._id || recipe.id}`" 
                  variant="primary" 
                  class="rounded-2xl"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- Empty State -->
        <div v-if="filteredRecipes.length === 0" class="text-center py-24 bg-white rounded-[3rem] border border-surface-200 shadow-soft">
          <EmptyState 
            title="No recipes found" 
            description="Try adjusting your filters or search terms to find what you're looking for."
          >
            <template #actions>
              <Button variant="outline" @click="resetFilters" class="rounded-2xl">Clear All Filters</Button>
            </template>
          </EmptyState>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue';
import { recipeService } from '@/services/recipe';
import { useAuthStore } from '@/stores/authStore';
import RecipeCard from '@/components/RecipeCard.vue';
import Button from '@/components/ui/Button.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import EmptyState from '@/components/ui/EmptyState.vue';

// Icons for stats
const RecipeIcon = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>` };
const UserIcon = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>` };
const StarIcon = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>` };
const HeartIcon = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>` };

const authStore = useAuthStore();
const recipes = ref([]);
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');
const viewMode = ref('grid');
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Healthy', 'Vegan'];

const stats = computed(() => [
  { label: 'Published Recipes', value: recipes.value.length, icon: markRaw(RecipeIcon), bg: 'bg-brand-50', color: 'text-brand-600' },
  { label: 'Active Creators', value: '1.2k', icon: markRaw(UserIcon), bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'Avg User Rating', value: '4.8', icon: markRaw(StarIcon), bg: 'bg-accent-50', color: 'text-accent-600' },
  { label: 'Recipe Saves', value: '15k', icon: markRaw(HeartIcon), bg: 'bg-red-50', color: 'text-red-600' },
]);

const filteredRecipes = computed(() => {
  let filtered = recipes.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(query) || 
      r.description.toLowerCase().includes(query)
    );
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(r => r.category === selectedCategory.value);
  }
  
  return filtered;
});

const fetchRecipes = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const data = await recipeService.getAllRecipes();
    recipes.value = data;
  } catch (err) {
    error.value = "Failed to load the latest recipes. Please try again later.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  // Filtering is handled by computed property
};

const quickSearch = (tag) => {
  searchQuery.value = tag;
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
};

const toggleBookmark = (recipe) => {
  // Logic already in RecipeCard, but we can sync with store here if needed
};

onMounted(fetchRecipes);
</script>

<style scoped>
.recipe-list-enter-active,
.recipe-list-leave-active {
  transition: all 0.5s ease;
}
.recipe-list-enter-from,
.recipe-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.recipe-list-move {
  transition: transform 0.5s ease;
}
</style>
