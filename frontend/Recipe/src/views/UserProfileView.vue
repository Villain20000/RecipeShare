<template>
  <div class="min-h-screen bg-surface-50 pb-24">
    <!-- Profile Header -->
    <section class="relative h-[40vh] min-h-[350px] bg-surface-900 overflow-hidden">
      <!-- Animated Background Canvas (Simplified with CSS gradients) -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-surface-900 to-accent-600/20"></div>
        <div class="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div class="container-app relative z-10 h-full flex items-end pb-12">
        <div class="w-full flex flex-col md:flex-row items-center md:items-end gap-8 stagger-children">
          <div class="relative group">
            <div class="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] border-4 border-white/10 overflow-hidden shadow-elevation-4 bg-surface-800">
              <img 
                :src="user?.avatar || 'https://via.placeholder.com/200'" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              >
            </div>
            <router-link 
              to="/settings"
              class="absolute -bottom-2 -right-2 p-3 bg-white text-surface-900 rounded-2xl shadow-elevation-3 hover:bg-brand-600 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </router-link>
          </div>

          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-500/30 backdrop-blur-md">
                Master Chef
              </span>
              <span class="text-surface-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" /></svg>
                Joined {{ formatJoinedDate(user?.createdAt) }}
              </span>
            </div>
            <h1 class="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">{{ user?.username }}</h1>
            <p class="text-surface-400 max-w-xl leading-relaxed italic">
              "{{ user?.bio || 'No bio yet. Share your culinary philosophy in settings!' }}"
            </p>
          </div>

          <div class="flex gap-4 self-center md:self-end">
            <div class="px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl text-center">
              <div class="text-2xl font-black text-white leading-none mb-1">{{ userRecipes.length }}</div>
              <div class="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Recipes</div>
            </div>
            <div class="px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl text-center">
              <div class="text-2xl font-black text-white leading-none mb-1">{{ savedRecipes.length }}</div>
              <div class="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Navigation -->
    <div class="container-app mt-12">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-surface-200">
        <nav class="flex gap-8">
          <button 
            v-for="tab in tabs" 
            :key="tab.name"
            @click="currentTab = tab.name"
            :class="['pb-6 text-sm font-black uppercase tracking-widest transition-all relative', currentTab === tab.name ? 'text-brand-600' : 'text-surface-400 hover:text-surface-600']"
          >
            {{ tab.label }}
            <span v-if="currentTab === tab.name" class="absolute bottom-0 left-0 w-full h-1 bg-brand-600 rounded-t-full"></span>
          </button>
        </nav>
        
        <div v-if="currentTab === 'my-recipes'" class="pb-6">
          <Button to="/share-recipe" variant="primary" class="rounded-2xl shadow-elevation-2">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Post New Recipe
          </Button>
        </div>
      </div>

      <!-- Recipes Grid -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="n in 4" :key="n" class="space-y-4">
          <Skeleton height="240px" class="rounded-3xl" />
          <div class="space-y-2 px-2">
            <Skeleton width="40%" height="12px" />
            <Skeleton width="80%" height="24px" />
          </div>
        </div>
      </div>

      <div v-else class="animate-fade-in-up">
        <transition-group 
          v-if="activeRecipes.length > 0"
          tag="div"
          name="recipe-list"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <RecipeCard 
            v-for="recipe in activeRecipes" 
            :key="recipe._id || recipe.id" 
            :recipe="recipe"
          />
        </transition-group>

        <!-- Empty State -->
        <div v-else class="text-center py-24 bg-white rounded-[3rem] border border-surface-200 border-dashed">
          <div class="w-20 h-20 bg-surface-50 text-surface-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-xl font-display font-bold text-surface-900 mb-2">
            {{ currentTab === 'my-recipes' ? 'No Recipes Published' : 'No Recipes Saved' }}
          </h3>
          <p class="text-surface-500 mb-8 max-w-xs mx-auto">
            {{ currentTab === 'my-recipes' 
              ? 'Start sharing your culinary secrets with the world today!' 
              : 'Keep track of your favorite inspirations by saving them.' }}
          </p>
          <Button 
            :to="currentTab === 'my-recipes' ? '/share-recipe' : '/explore'" 
            variant="outline" 
            class="rounded-2xl"
          >
            {{ currentTab === 'my-recipes' ? 'Share My First Recipe' : 'Explore Trending Recipes' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { recipeService } from '@/services/recipe';
import { userService } from '@/services/user';
import RecipeCard from '@/components/RecipeCard.vue';
import Button from '@/components/ui/Button.vue';
import Skeleton from '@/components/ui/Skeleton.vue';

const authStore = useAuthStore();
const isLoading = ref(true);
const user = ref(authStore.user);
const userRecipes = ref([]);
const savedRecipes = ref([]);
const currentTab = ref('my-recipes');

const tabs = [
  { name: 'my-recipes', label: 'Published' },
  { name: 'saved-recipes', label: 'Favorites' }
];

const activeRecipes = computed(() => {
  return currentTab.value === 'my-recipes' ? userRecipes.value : savedRecipes.value;
});

const formatJoinedDate = (date) => {
  if (!date) return '2024';
  return new Date(date).getFullYear();
};

const fetchProfileData = async () => {
  isLoading.value = true;
  try {
    const [profile, recipes, saved] = await Promise.all([
      userService.getCurrentUser(),
      recipeService.getUserRecipes(),
      recipeService.getSavedRecipes()
    ]);
    user.value = profile;
    userRecipes.value = recipes;
    savedRecipes.value = saved;
  } catch (err) {
    console.error('Profile fetch failed:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProfileData);
</script>

<style scoped>
.recipe-list-enter-active,
.recipe-list-leave-active {
  transition: all 0.5s ease;
}
.recipe-list-enter-from,
.recipe-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.recipe-list-move {
  transition: transform 0.5s ease;
}
</style>
