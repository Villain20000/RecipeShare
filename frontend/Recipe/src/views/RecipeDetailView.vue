<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading recipe...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto bg-red-50 rounded-lg p-6">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="ml-3 text-red-800">{{ error }}</p>
        </div>
        <button 
          @click="$router.push('/')"
          class="mt-4 text-blue-600 hover:text-blue-500 font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Return to Home
        </button>
      </div>
    </div>

    <!-- Recipe Content -->
    <div v-else class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Navigation and Actions -->
        <div class="flex items-center justify-between mb-8">
          <button 
            @click="$router.push('/')"
            class="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back to Recipes
          </button>
          
          <!-- Edit and Delete buttons (only visible to recipe author) -->
          <div v-if="isAuthor" class="flex gap-4">
            <button
              @click="editRecipe"
              class="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Recipe
            </button>
            <button
              @click="confirmDelete"
              class="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Delete Recipe
            </button>
          </div>
          
          <div class="flex items-center space-x-4">
            <button 
              @click="toggleBookmark"
              class="text-gray-600 hover:text-gray-800 flex items-center transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6" 
                :class="isBookmarked ? 'text-yellow-500' : 'text-gray-400'"
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 20V4z" />
              </svg>
              <span class="ml-2">{{ isBookmarked ? 'Saved' : 'Save Recipe' }}</span>
            </button>
            
            <button 
              @click="printRecipe"
              class="text-gray-600 hover:text-gray-800 flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span class="ml-2">Print</span>
            </button>
          </div>
        </div>

        <!-- Recipe Header -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div class="relative h-96">
            <img 
              :src="recipe.image || 'https://via.placeholder.com/800x400'" 
              :alt="recipe.title"
              class="w-full h-full object-cover"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div class="flex items-center space-x-4 mb-4">
                <span class="px-3 py-1 bg-blue-500 rounded-full text-sm font-medium">
                  {{ recipe.category }}
                </span>
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ recipe.rating || '4.5' }}
                </span>
              </div>
              <h1 class="text-4xl font-bold mb-2">{{ recipe.title }}</h1>
              <p class="text-lg opacity-90">{{ recipe.description }}</p>
            </div>
          </div>

          <!-- Recipe Meta Info -->
          <div class="p-6 border-b">
            <div class="grid grid-cols-4 gap-4">
              <div class="text-center">
                <span class="block text-gray-500 text-sm">Prep Time</span>
                <span class="text-lg font-medium">{{ recipe.prepTime || '20 mins' }}</span>
              </div>
              <div class="text-center">
                <span class="block text-gray-500 text-sm">Cook Time</span>
                <span class="text-lg font-medium">{{ recipe.cookTime }}</span>
              </div>
              <div class="text-center">
                <span class="block text-gray-500 text-sm">Servings</span>
                <span class="text-lg font-medium">{{ recipe.servings }}</span>
              </div>
              <div class="text-center">
                <span class="block text-gray-500 text-sm">Difficulty</span>
                <span class="text-lg font-medium">{{ recipe.difficulty }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Ingredients -->
          <div class="md:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-4">Ingredients</h2>
              <ul class="space-y-3">
                <li 
                  v-for="(ingredient, index) in recipe.ingredients" 
                  :key="index"
                  class="flex items-start"
                >
                  <input
                    :id="'ingredient-' + index"
                    type="checkbox"
                    class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label
                    :for="'ingredient-' + index"
                    class="ml-3 text-gray-700 cursor-pointer"
                  >
                    {{ ingredient }}
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <!-- Instructions -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-4">Instructions</h2>
              <div class="space-y-6">
                <div 
                  v-for="(instruction, index) in recipe.instructions" 
                  :key="index"
                  class="flex"
                >
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-medium mr-4">
                    {{ index + 1 }}
                  </div>
                  <p class="text-gray-700">{{ instruction }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Author and Notes Section -->
        <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-4">
            <ProfilePicture 
              :src="recipe.author?.avatar"
              :alt="recipe.author?.username"
              size="md"
              hover
            />
            <div class="ml-3">
              <p class="font-medium">{{ recipe.author?.username || 'Recipe Author' }}</p>
              <p class="text-sm text-gray-500">Published {{ formatDate(recipe.createdAt) }}</p>
            </div>
          </div>
          <div v-if="recipe.notes" class="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-medium text-yellow-800 mb-2">Chef's Notes</h3>
            <p class="text-yellow-700">{{ recipe.notes }}</p>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">Comments</h2>
          <div class="mb-6">
            <!-- Rating Input -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <div class="flex items-center space-x-1">
                <template v-for="star in 5" :key="star">
                  <button 
                    @click="newRating = star"
                    @mouseover="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                    class="focus:outline-none"
                  >
                    <svg 
                      class="w-8 h-8 transition-colors duration-200"
                      :class="(hoverRating || newRating) >= star ? 'text-yellow-400' : 'text-gray-300'"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </template>
                <span class="ml-2 text-sm text-gray-600">
                  {{ newRating ? `${newRating} star${newRating > 1 ? 's' : ''}` : 'Select a rating' }}
                </span>
              </div>
            </div>

            <textarea
              v-model="newComment"
              rows="3"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your experience with this recipe..."
            ></textarea>
            <button
              @click="submitComment"
              :disabled="!newRating"
              class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
          
          <div class="space-y-6">
            <div v-for="comment in comments" :key="comment.id" class="border-b pb-6">
              <div class="flex items-center mb-2">
                <img :src="comment.author.avatar" alt="" class="w-8 h-8 rounded-full">
                <div class="ml-3">
                  <p class="font-medium">{{ comment.author.name }}</p>
                  <div class="flex items-center space-x-2">
                    <div class="flex items-center">
                      <template v-for="star in 5" :key="star">
                        <svg 
                          class="w-4 h-4"
                          :class="comment.rating >= star ? 'text-yellow-400' : 'text-gray-300'"
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </template>
                    </div>
                    <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                </div>
              </div>
              <p class="text-gray-700">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useToastStore } from '@/stores/toastStore';
import { recipeService } from '@/services/recipe';
import ProfilePicture from '@/components/ProfilePicture.vue';

export default {
  name: 'RecipeDetailView',
  components: {
    ProfilePicture
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const toastStore = useToastStore();

    const recipe = ref({});
    const isLoading = ref(true);
    const error = ref(null);
    const isBookmarked = ref(false);
    const newComment = ref('');
    const newRating = ref(0);
    const hoverRating = ref(0);
    const comments = ref([]);

    // Check if current user is the recipe author
    const isAuthor = computed(() => {
      return userStore.isAuthenticated && recipe.value.author?._id === userStore.user?._id;
    });

    return {
      recipe,
      isLoading,
      error,
      isBookmarked,
      newComment,
      newRating,
      hoverRating,
      comments,
      isAuthor,
      router,
      toastStore
    };
  },
  methods: {
    async fetchRecipe() {
      const recipeId = this.$route.params.id;
      try {
        const response = await recipeService.getRecipeById(recipeId);
        this.recipe = response;
      } catch (error) {
        console.error('Error fetching recipe:', error);
        this.error = 'Failed to load recipe. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },
    editRecipe() {
      this.router.push(`/recipe/${this.recipe._id}/edit`);
    },
    async confirmDelete() {
      if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
        try {
          await recipeService.deleteRecipe(this.recipe._id);
          this.toastStore.success('Recipe deleted successfully');
          this.router.push('/');
        } catch (error) {
          console.error('Error deleting recipe:', error);
          this.toastStore.error('Failed to delete recipe. Please try again.');
        }
      }
    },
    toggleBookmark() {
      this.isBookmarked = !this.isBookmarked;
      // TODO: Implement bookmark functionality with backend
    },
    printRecipe() {
      window.print();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    async submitComment() {
      if (!this.newComment.trim() || !this.newRating) return;
      
      // TODO: Implement comment submission with rating
      this.comments.unshift({
        id: Date.now(),
        author: {
          name: 'Current User',
          avatar: 'https://via.placeholder.com/32'
        },
        content: this.newComment,
        rating: this.newRating,
        createdAt: new Date()
      });
      
      this.newComment = '';
      this.newRating = 0;
      this.hoverRating = 0;
    }
  },
  created() {
    this.fetchRecipe();
  }
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
}
</style>
