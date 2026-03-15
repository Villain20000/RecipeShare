<template>
  <div class="min-h-screen bg-surface-50 pb-24">
    <!-- Modern Hero Slider -->
    <section class="relative h-[50vh] min-h-[450px] overflow-hidden bg-surface-900 pt-16">
      <div 
        v-for="(slide, index) in heroSlides" 
        :key="index"
        class="absolute inset-0 transition-all duration-1000 ease-smooth"
        :class="currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'"
      >
        <img :src="slide.image" class="w-full h-full object-cover opacity-40">
        <div class="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/40 to-transparent"></div>
        
        <div class="container-app relative h-full flex flex-col justify-center">
          <div class="max-w-2xl stagger-children">
            <span class="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              Featured Selection
            </span>
            <h1 class="text-fluid-h1 font-display font-black text-white mb-6 leading-tight">
              {{ slide.title }}
            </h1>
            <p class="text-lg text-surface-300 mb-10 leading-relaxed max-w-lg">
              {{ slide.description }}
            </p>
            <div class="flex gap-4">
              <Button variant="primary" size="lg" class="rounded-2xl px-8" @click="quickSearch(slide.tag)">Explore Now</Button>
              <Button variant="ghost" size="lg" class="rounded-2xl px-8 text-white hover:bg-white/10" @click="nextSlide">Next Story</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Slider Controls -->
      <div class="absolute bottom-12 left-0 right-0">
        <div class="container-app flex items-center justify-between">
          <div class="flex gap-3">
            <button 
              v-for="(_, index) in heroSlides" 
              :key="index"
              @click="currentSlide = index"
              class="h-1.5 rounded-full transition-all duration-500"
              :class="currentSlide === index ? 'w-12 bg-brand-500' : 'w-6 bg-white/20 hover:bg-white/40'"
            ></button>
          </div>
          <div class="flex gap-2">
            <button @click="prevSlide" class="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button @click="nextSlide" class="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Sidebar & Content -->
    <div class="container-app py-16">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Modern Sidebar Filters -->
        <aside class="w-full lg:w-80 space-y-10">
          <div>
            <h3 class="text-xs font-black text-surface-400 uppercase tracking-widest mb-6">Search Recipes</h3>
            <div class="relative group">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="filters.search"
                type="text" 
                placeholder="Keywords..."
                class="w-full pl-12 pr-4 py-3.5 bg-white border border-surface-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent text-surface-900 transition-all outline-none"
              >
            </div>
          </div>

          <div>
            <h3 class="text-xs font-black text-surface-400 uppercase tracking-widest mb-6">Categories</h3>
            <div class="flex flex-wrap lg:flex-col gap-2">
              <button 
                @click="filters.category = ''"
                :class="['px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between', !filters.category ? 'bg-brand-600 text-white shadow-elevation-2' : 'bg-white text-surface-600 hover:bg-brand-50 hover:text-brand-600 border border-surface-100']"
              >
                All Categories
                <span v-if="!filters.category" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </button>
              <button 
                v-for="cat in categories" 
                :key="cat"
                @click="filters.category = cat"
                :class="['px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between', filters.category === cat ? 'bg-brand-600 text-white shadow-elevation-2' : 'bg-white text-surface-600 hover:bg-brand-50 hover:text-brand-600 border border-surface-100']"
              >
                {{ cat }}
                <span v-if="filters.category === cat" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-black text-surface-400 uppercase tracking-widest mb-6">Experience Level</h3>
            <div class="grid grid-cols-3 lg:grid-cols-1 gap-2">
              <button 
                v-for="level in difficulties" 
                :key="level"
                @click="filters.difficulty = filters.difficulty === level ? '' : level"
                :class="['px-4 py-3 rounded-xl text-sm font-bold transition-all border', filters.difficulty === level ? 'bg-accent-500 border-accent-500 text-white shadow-elevation-2' : 'bg-white border-surface-100 text-surface-600 hover:border-accent-200 hover:text-accent-600']"
              >
                {{ level }}
              </button>
            </div>
          </div>

          <Button variant="outline" fullWidth class="rounded-2xl py-4" @click="resetFilters">
            Clear All Filters
          </Button>
        </aside>

        <!-- Results Area -->
        <main class="flex-1">
          <div class="flex items-center justify-between mb-10">
            <div>
              <h2 class="text-2xl font-display font-black text-surface-900">
                {{ filteredRecipes.length }} Recipes Found
              </h2>
              <p class="text-sm text-surface-500 font-medium">Discovering the best of home cooking</p>
            </div>
            
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-surface-400 uppercase tracking-widest">Sort by</span>
              <select class="bg-white border-surface-200 rounded-xl text-sm font-bold text-surface-700 py-2.5 pl-4 pr-10 focus:ring-brand-500 focus:border-brand-500">
                <option>Newest First</option>
                <option>Highest Rated</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <!-- Loading Grid -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <div v-for="n in 6" :key="n" class="space-y-4">
              <Skeleton height="220px" class="rounded-3xl" />
              <div class="space-y-2">
                <Skeleton width="40%" height="12px" />
                <Skeleton width="90%" height="24px" />
                <Skeleton width="100%" height="40px" />
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-white rounded-[3rem] p-12 border border-surface-200 text-center">
            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="text-xl font-display font-bold text-surface-900 mb-2">Sync Error</h3>
            <p class="text-surface-500 mb-8">{{ error }}</p>
            <Button variant="primary" @click="fetchRecipes" class="rounded-2xl">Retry Connection</Button>
          </div>

          <!-- Content Grid -->
          <div v-else>
            <transition-group 
              v-if="filteredRecipes.length > 0"
              tag="div"
              name="recipe-list"
              class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              <RecipeCard 
                v-for="recipe in filteredRecipes" 
                :key="recipe._id || recipe.id" 
                :recipe="recipe"
              />
            </transition-group>

            <!-- Empty Results -->
            <div v-else class="py-24 text-center bg-white rounded-[3rem] border border-surface-200 border-dashed">
              <div class="w-20 h-20 bg-surface-50 text-surface-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 class="text-xl font-display font-bold text-surface-900 mb-2">No Match Found</h3>
              <p class="text-surface-500 mb-8 max-w-xs mx-auto">We couldn't find any recipes matching your current filters. Try broadening your search.</p>
              <Button variant="outline" @click="resetFilters" class="rounded-2xl">Reset All Filters</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { recipeService } from '@/services/recipe';
import { useToastStore } from '@/stores/toastStore';
import RecipeCard from '@/components/RecipeCard.vue';
import Button from '@/components/ui/Button.vue';
import Skeleton from '@/components/ui/Skeleton.vue';

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

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Healthy', 'Vegetarian', 'Vegan'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const heroSlides = [
  {
    title: "Seasonal Harvest Specials",
    description: "Discover the freshest flavors of the season with our community-curated collection of autumn-inspired dishes.",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=2062&q=80",
    tag: "Healthy"
  },
  {
    title: "Master the Art of Baking",
    description: "From sourdough starters to delicate pastries, elevate your baking game with tips from experienced home bakers.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2070&q=80",
    tag: "Dessert"
  },
  {
    title: "Global Street Food",
    description: "Take your tastebuds on a world tour with authentic street food recipes you can recreate in your own kitchen.",
    image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=1974&q=80",
    tag: "Lunch"
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
  autoplayInterval.value = setInterval(nextSlide, 6000);
};

const resetAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    startAutoplay();
  }
};

const filteredRecipes = computed(() => {
  return recipes.value.filter(recipe => {
    const matchesCategory = !filters.value.category || recipe.category.toLowerCase() === filters.value.category.toLowerCase();
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
    error.value = 'Unable to sync with the recipe server. Please check your connection.';
    toastStore.error('Connection Error', 'Failed to fetch recipes.');
  } finally {
    isLoading.value = false;
  }
};

const quickSearch = (tag) => {
  filters.value.category = tag;
  // Scroll to results
  window.scrollTo({ top: window.innerHeight * 0.45, behavior: 'smooth' });
};

const resetFilters = () => {
  filters.value = { category: '', difficulty: '', search: '' };
};

onMounted(() => {
  fetchRecipes();
  startAutoplay();
});

onUnmounted(() => {
  if (autoplayInterval.value) clearInterval(autoplayInterval.value);
});
</script>

<style scoped>
.recipe-list-enter-active,
.recipe-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.recipe-list-enter-from,
.recipe-list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
.recipe-list-move {
  transition: transform 0.5s ease;
}

.stagger-children > * {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}
.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
