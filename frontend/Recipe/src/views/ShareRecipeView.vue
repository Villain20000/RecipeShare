<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-3xl">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-4xl font-bold mb-2 text-gray-800">Share Your Recipe</h1>
        <p class="text-gray-600 mb-8">Share your culinary masterpiece with our community</p>
        
        <form @submit.prevent="submitRecipe" class="space-y-6">
          <!-- Basic Info Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Recipe Title</label>
              <input
                v-model="recipe.title"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="E.g., Classic Chocolate Cake"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="recipe.category"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cooking Time</label>
              <input
                v-model="recipe.cookTime"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="E.g., 45 mins"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                v-model="recipe.difficulty"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Servings</label>
              <input
                v-model="recipe.servings"
                type="number"
                min="1"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Number of servings"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="recipe.description"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows="3"
              placeholder="Write a brief description of your recipe"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Recipe Image
              <span class="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
              <template v-if="imagePreview">
                <div class="w-full">
                  <img :src="imagePreview" alt="Recipe preview" class="max-h-64 mx-auto object-cover rounded-lg">
                  <button 
                    @click="removeImage" 
                    type="button"
                    class="mt-2 text-red-500 hover:text-red-600 text-sm font-medium flex items-center mx-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    Remove Image
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        type="file" 
                        class="sr-only" 
                        accept="image/*" 
                        @change="handleImageUpload"
                      >
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </template>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            <div class="space-y-2">
              <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex gap-2">
                <input
                  v-model="recipe.ingredients[index]"
                  type="text"
                  class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="E.g., 2 cups flour"
                >
                <button 
                  @click="removeIngredient(index)" 
                  type="button"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <button 
              @click="addIngredient" 
              type="button"
              class="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Ingredient
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <div class="space-y-2">
              <div v-for="(step, index) in recipe.instructions" :key="index" class="flex gap-2">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-medium">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <textarea
                    v-model="recipe.instructions[index]"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    rows="2"
                    :placeholder="`Step ${index + 1}`"
                  ></textarea>
                </div>
                <button 
                  @click="removeInstruction(index)" 
                  type="button"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <button 
              @click="addInstruction" 
              type="button"
              class="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Step
            </button>
          </div>

          <div class="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              @click="$router.push('/')"
              class="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back to Home
            </button>
            
            <button
              type="submit"
              class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 font-medium transition-all flex items-center"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Sharing Recipe...' : 'Share Recipe' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { recipeService } from '@/services/recipe';
import { useToastStore } from '@/stores/toastStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'ShareRecipeView',
  setup() {
    const router = useRouter();
    const toastStore = useToastStore();
    const userStore = useUserStore();
    const imagePreview = ref(null);

    return { router, toastStore, userStore, imagePreview };
  },
  data() {
    return {
      isSubmitting: false,
      categories: [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Dessert',
        'Snack',
        'Appetizer',
        'Vegetarian',
        'Vegan',
        'Main Course',
        'Side Dish'
      ],
      difficulties: ['Easy', 'Medium', 'Hard'],
      recipe: {
        title: '',
        category: '',
        description: '',
        cookTime: '',
        difficulty: '',
        servings: '',
        image: null,
        ingredients: [''],
        instructions: ['']
      }
    };
  },
  methods: {
    addIngredient() {
      this.recipe.ingredients.push('');
    },
    removeIngredient(index) {
      this.recipe.ingredients.splice(index, 1);
      if (this.recipe.ingredients.length === 0) {
        this.recipe.ingredients.push('');
      }
    },
    addInstruction() {
      this.recipe.instructions.push('');
    },
    removeInstruction(index) {
      this.recipe.instructions.splice(index, 1);
      if (this.recipe.instructions.length === 0) {
        this.recipe.instructions.push('');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastStore.error('Please upload an image file (PNG, JPG, GIF)');
        event.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        this.toastStore.error('Image size should be less than 10MB');
        event.target.value = ''; // Clear the input
        return;
      }

      // Set the file for form submission
      this.recipe.image = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
        console.log('Image preview updated:', this.imagePreview ? 'Preview created' : 'No preview');
      };
      reader.onerror = (e) => {
        console.error('Error creating image preview:', e);
        this.toastStore.error('Failed to preview image. Please try again.');
      };
      reader.readAsDataURL(file);
    },

    removeImage() {
      this.recipe.image = null;
      this.imagePreview = null;
      // Clear the file input if it exists
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    },

    async submitRecipe() {
      if (!this.userStore.isAuthenticated) {
        console.log('User not authenticated');
        this.toastStore.error('Please log in to share a recipe');
        this.router.push('/login');
        return;
      }

      this.isSubmitting = true;
      try {
        console.log('Starting recipe submission...', {
          userInfo: {
            isAuthenticated: this.userStore.isAuthenticated,
            userId: this.userStore.currentUser?._id
          }
        });
        
        // Filter out empty ingredients and instructions
        const recipeData = {
          title: this.recipe.title.trim(),
          description: this.recipe.description.trim(),
          category: this.recipe.category,
          cookTime: this.recipe.cookTime.trim(),
          difficulty: this.recipe.difficulty,
          servings: parseInt(this.recipe.servings),
          ingredients: this.recipe.ingredients.filter(i => i.trim()),
          instructions: this.recipe.instructions.filter(i => i.trim()),
          image: this.recipe.image
        };

        // Validate required fields
        const requiredFields = ['title', 'category', 'description', 'cookTime', 'difficulty', 'servings'];
        const missingFields = requiredFields.filter(field => !recipeData[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }

        if (recipeData.ingredients.length === 0) {
          throw new Error('Please add at least one ingredient');
        }

        if (recipeData.instructions.length === 0) {
          throw new Error('Please add at least one instruction');
        }

        const response = await recipeService.createRecipe(recipeData);
        
        this.toastStore.success('Recipe shared successfully!');
        // Navigate to the new recipe page
        await this.router.push(`/recipe/${response._id}`);
      } catch (error) {
        console.error('Error submitting recipe:', {
          message: error.message,
          response: {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
          },
          user: {
            isAuthenticated: this.userStore.isAuthenticated,
            userId: this.userStore.currentUser?._id
          }
        });
        
        let errorMessage = 'Failed to share recipe. Please try again.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors);
          errorMessage = errors.join(', ');
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.toastStore.error(errorMessage);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
