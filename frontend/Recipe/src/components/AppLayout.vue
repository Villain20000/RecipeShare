<template>
  <div class="min-h-screen flex flex-col bg-surface-50">
    <AppNavbar @open-search="isSearchOpen = true" />

    <!-- Main Content Area -->
    <main 
      id="main-content" 
      class="flex-1 w-full pt-20 pb-12 transition-all duration-350"
    >
      <slot></slot>
    </main>

    <AppFooter />

    <!-- Global Search Overlay -->
    <transition
      enter-active-class="transition duration-300 ease-smooth"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSearchOpen"
        class="fixed inset-0 z-[100] bg-surface-900/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
        @click.self="isSearchOpen = false"
      >
        <div 
          class="w-full max-w-2xl bg-white rounded-3xl shadow-elevation-5 overflow-hidden transform transition-all"
          enter-active-class="duration-300 ease-smooth"
          enter-from-class="scale-95 translate-y-4"
          enter-to-class="scale-100 translate-y-0"
        >
          <div class="p-6">
            <div class="relative flex items-center">
              <svg class="absolute left-4 w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search recipes, ingredients, or cuisines..." 
                class="w-full pl-12 pr-4 py-4 bg-surface-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 text-lg text-surface-900 placeholder-surface-400 transition-all"
                autoFocus
                @keyup.enter="handleSearch"
                @keyup.esc="isSearchOpen = false"
              >
              <button 
                @click="isSearchOpen = false"
                class="ml-4 p-2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Quick Suggestions -->
            <div class="mt-8">
              <h4 class="text-xs font-bold text-surface-400 uppercase tracking-wider mb-4 px-1">Popular Categories</h4>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="cat in ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Healthy', 'Vegan']" 
                  :key="cat"
                  @click="quickSearch(cat)"
                  class="px-4 py-2 bg-surface-50 hover:bg-brand-50 hover:text-brand-600 text-surface-600 rounded-xl text-sm font-medium transition-all"
                >
                  {{ cat }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppNavbar from './AppNavbar.vue';
import AppFooter from './AppFooter.vue';

const router = useRouter();
const isSearchOpen = ref(false);
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/explore',
      query: { search: searchQuery.value }
    });
    isSearchOpen.value = false;
    searchQuery.value = '';
  }
};

const quickSearch = (term) => {
  searchQuery.value = term;
  handleSearch();
};
</script>

<style scoped>
.ease-smooth {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
