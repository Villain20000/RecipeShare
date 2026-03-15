<template>
  <div class="min-h-screen bg-surface-50 pb-24">
    <!-- Loading State -->
    <div v-if="isLoading" class="container-app py-12">
      <div class="max-w-5xl mx-auto space-y-8">
        <Skeleton height="400px" class="rounded-[2.5rem]" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2 space-y-6">
            <Skeleton width="60%" height="48px" />
            <Skeleton width="100%" height="100px" />
            <Skeleton width="100%" height="300px" />
          </div>
          <div class="space-y-6">
            <Skeleton width="100%" height="200px" />
            <Skeleton width="100%" height="150px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container-app py-20">
      <div class="max-w-2xl mx-auto text-center bg-white p-12 rounded-[3rem] border border-surface-200 shadow-soft">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-2xl font-display font-bold text-surface-900 mb-2">Recipe Not Found</h3>
        <p class="text-surface-500 mb-8">{{ error }}</p>
        <Button variant="primary" to="/" class="rounded-2xl px-8">Back to Home</Button>
      </div>
    </div>

    <!-- Recipe Content -->
    <div v-else class="animate-fade-in">
      <!-- Hero Header -->
      <header class="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          :src="recipe.image || 'https://via.placeholder.com/1200x800'" 
          :alt="recipe.title"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-surface-900/20 to-transparent"></div>
        
        <div class="absolute inset-0 flex items-end">
          <div class="container-app pb-12">
            <div class="max-w-5xl mx-auto">
              <div class="flex flex-wrap items-center gap-3 mb-6">
                <span class="px-4 py-1.5 bg-brand-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-elevation-2">
                  {{ recipe.category }}
                </span>
                <div class="flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/20">
                  <svg class="w-4 h-4 text-accent-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {{ recipe.rating || '4.8' }}
                </div>
              </div>
              
              <h1 class="text-4xl md:text-6xl font-display font-black text-white mb-4 tracking-tight leading-tight">
                {{ recipe.title }}
              </h1>
              
              <div class="flex flex-wrap items-center gap-6 text-white/80 font-medium">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden">
                    <img :src="recipe.author?.avatar || 'https://via.placeholder.com/32'" class="w-full h-full object-cover">
                  </div>
                  <span>By {{ recipe.author?.username || 'Chef' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(recipe.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Actions -->
        <div class="absolute top-8 right-8 flex gap-3">
          <button 
            @click="toggleBookmark"
            class="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-elevation-3 text-surface-600 hover:text-accent-500 transition-all hover:scale-105 active:scale-95"
          >
            <svg class="w-6 h-6" :class="isBookmarked ? 'fill-accent-500 text-accent-500' : 'fill-none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button 
            @click="printRecipe"
            class="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-elevation-3 text-surface-600 hover:text-brand-600 transition-all hover:scale-105 active:scale-95"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </header>

      <div class="container-app -mt-10 relative z-10">
        <div class="max-w-5xl mx-auto">
          <!-- Quick Info Bar -->
          <div class="bg-white rounded-[2rem] shadow-elevation-3 border border-surface-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div class="text-center md:border-r border-surface-100">
              <p class="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Prep Time</p>
              <p class="text-xl font-black text-surface-900">{{ recipe.prepTime || '15 min' }}</p>
            </div>
            <div class="text-center md:border-r border-surface-100">
              <p class="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Cook Time</p>
              <p class="text-xl font-black text-surface-900">{{ recipe.cookTime }}</p>
            </div>
            <div class="text-center md:border-r border-surface-100">
              <p class="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Servings</p>
              <p class="text-xl font-black text-surface-900">{{ recipe.servings }}</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Difficulty</p>
              <p class="text-xl font-black text-surface-900 capitalize">{{ recipe.difficulty }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Left Column: Description & Instructions -->
            <div class="lg:col-span-2 space-y-12">
              <section>
                <h2 class="text-2xl font-display font-black text-surface-900 mb-6 flex items-center gap-3">
                  <span class="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  About this recipe
                </h2>
                <p class="text-lg text-surface-600 leading-relaxed italic">
                  "{{ recipe.description }}"
                </p>
              </section>

              <section>
                <h2 class="text-2xl font-display font-black text-surface-900 mb-8 flex items-center gap-3">
                  <span class="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </span>
                  Step-by-Step Instructions
                </h2>
                <div class="space-y-8">
                  <div 
                    v-for="(step, index) in recipe.instructions" 
                    :key="index"
                    class="relative pl-12 group"
                  >
                    <div class="absolute left-0 top-0 w-8 h-8 rounded-xl bg-surface-100 text-surface-400 font-black flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                      {{ index + 1 }}
                    </div>
                    <div class="p-6 rounded-3xl bg-white border border-surface-100 shadow-soft group-hover:shadow-elevation-2 group-hover:border-brand-100 transition-all duration-300">
                      <p class="text-surface-700 leading-relaxed">{{ step }}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Column: Ingredients & Author -->
            <div class="space-y-8">
              <section class="bg-white rounded-[2.5rem] border border-surface-200 p-8 shadow-soft sticky top-24">
                <h2 class="text-xl font-display font-black text-surface-900 mb-6 flex items-center gap-3">
                  <span class="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </span>
                  Ingredients
                </h2>
                <ul class="space-y-4">
                  <li 
                    v-for="(ingredient, index) in recipe.ingredients" 
                    :key="index"
                    class="flex items-center gap-3 group"
                  >
                    <label class="relative flex items-center cursor-pointer">
                      <input type="checkbox" class="peer sr-only">
                      <div class="w-6 h-6 rounded-lg border-2 border-surface-200 peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-all"></div>
                      <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </label>
                    <span class="text-surface-600 group-hover:text-surface-900 transition-colors font-medium">
                      {{ ingredient }}
                    </span>
                  </li>
                </ul>

                <div v-if="recipe.notes" class="mt-10 pt-8 border-t border-surface-100">
                  <h3 class="text-sm font-black text-surface-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Chef's Notes
                  </h3>
                  <p class="text-sm text-surface-500 leading-relaxed bg-accent-50/50 p-4 rounded-2xl border border-accent-100">
                    {{ recipe.notes }}
                  </p>
                </div>
              </section>
            </div>
          </div>

          <!-- Comments Section -->
          <section class="mt-24">
            <div class="flex items-center justify-between mb-12">
              <h2 class="text-3xl font-display font-black text-surface-900">Community Reviews</h2>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-black text-surface-900">{{ recipe.rating || '4.8' }}</span>
                <div class="flex text-accent-500">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Comment Form -->
              <div class="bg-white rounded-[2.5rem] border border-surface-200 p-8 shadow-soft h-fit">
                <h3 class="text-xl font-display font-bold text-surface-900 mb-6">Leave a Review</h3>
                <div class="space-y-6">
                  <div>
                    <label class="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3">Your Rating</label>
                    <div class="flex gap-2">
                      <button 
                        v-for="star in 5" 
                        :key="star"
                        @click="newRating = star"
                        class="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <svg 
                          class="w-8 h-8"
                          :class="star <= (hoverRating || newRating) ? 'text-accent-500 fill-current' : 'text-surface-200 fill-none'"
                          @mouseover="hoverRating = star"
                          @mouseleave="hoverRating = 0"
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3">Your Experience</label>
                    <textarea 
                      v-model="newComment"
                      rows="4" 
                      placeholder="What did you think of this recipe? Any tips for others?"
                      class="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 text-surface-900 placeholder-surface-400 transition-all resize-none"
                    ></textarea>
                  </div>
                  <Button 
                    variant="primary" 
                    fullWidth 
                    class="rounded-2xl py-4 font-bold"
                    :disabled="!newRating || !newComment"
                    @click="submitComment"
                  >
                    Post Review
                  </Button>
                </div>
              </div>

              <!-- Comment List -->
              <div class="space-y-6">
                <div v-if="comments.length === 0" class="text-center py-12 bg-surface-50 rounded-[2.5rem] border-2 border-dashed border-surface-200">
                  <p class="text-surface-400 font-medium">No reviews yet. Be the first to try this recipe!</p>
                </div>
                <div 
                  v-for="comment in comments" 
                  :key="comment.id"
                  class="bg-white rounded-3xl border border-surface-100 p-6 shadow-soft"
                >
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <img :src="comment.author.avatar" class="w-10 h-10 rounded-full border border-surface-100">
                      <div>
                        <p class="text-sm font-bold text-surface-900">{{ comment.author.name }}</p>
                        <p class="text-[10px] text-surface-400 font-bold uppercase">{{ formatDate(comment.createdAt) }}</p>
                      </div>
                    </div>
                    <div class="flex text-accent-500">
                      <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5" :class="i <= comment.rating ? 'fill-current' : 'fill-none stroke-current'" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-surface-600 leading-relaxed">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Mobile Action -->
    <div class="md:hidden fixed bottom-6 left-6 right-6 z-40">
      <Button variant="primary" fullWidth class="rounded-2xl py-4 shadow-elevation-5 font-bold flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Save to Favorites
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { recipeService } from '@/services/recipe';
import Button from '@/components/ui/Button.vue';
import Skeleton from '@/components/ui/Skeleton.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const recipe = ref({});
const isLoading = ref(true);
const error = ref(null);
const isBookmarked = ref(false);
const newComment = ref('');
const newRating = ref(0);
const hoverRating = ref(0);
const comments = ref([]);

const isAuthor = computed(() => {
  return authStore.isAuthenticated && recipe.value.author?._id === authStore.user?._id;
});

const fetchRecipe = async () => {
  const recipeId = route.params.id;
  try {
    const response = await recipeService.getRecipeById(recipeId);
    recipe.value = response;
  } catch (err) {
    console.error('Error fetching recipe:', err);
    error.value = 'We couldn\'t find the recipe you\'re looking for.';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const toggleBookmark = () => {
  if (!authStore.isAuthenticated) {
    toastStore.info('Please sign in', 'You need to be logged in to save recipes.');
    return;
  }
  isBookmarked.value = !isBookmarked.value;
  toastStore.success(isBookmarked.value ? 'Recipe Saved' : 'Recipe Removed', isBookmarked.value ? 'Added to your favorites.' : 'Removed from your favorites.');
};

const printRecipe = () => {
  window.print();
};

const submitComment = async () => {
  if (!newComment.value.trim() || !newRating.value) return;
  
  const comment = {
    id: Date.now(),
    author: {
      name: authStore.user?.username || 'Guest User',
      avatar: authStore.user?.avatar || 'https://via.placeholder.com/40'
    },
    content: newComment.value,
    rating: newRating.value,
    createdAt: new Date()
  };
  
  comments.value.unshift(comment);
  newComment.value = '';
  newRating.value = 0;
  toastStore.success('Review Posted', 'Thank you for sharing your experience!');
};

onMounted(fetchRecipe);
</script>

<style scoped>
@media print {
  header, .floating-actions, .comment-form, .bottom-mobile-action {
    display: none !important;
  }
  .container-app {
    margin-top: 0 !important;
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
