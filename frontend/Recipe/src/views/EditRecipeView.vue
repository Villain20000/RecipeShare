<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 rounded-xl p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
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

      <!-- Edit Form -->
      <div v-else class="bg-white rounded-xl shadow-lg p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold text-gray-800">Edit Recipe</h1>
            <p class="text-gray-600">Update your recipe details</p>
          </div>
          <button 
            @click="$router.push(`/recipe/${recipe._id}`)"
            class="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back to Recipe
          </button>
        </div>
        
        <form @submit.prevent="updateRecipe" class="space-y-6">
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
                <option v-for="level in difficulties" :key="level" :value="level">
                  {{ level }}
                </option>
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
              <div class="space-y-1 text-center">
                <img 
                  v-if="recipe.image && !newImage" 
                  :src="recipe.image"
                  class="mx-auto h-32 w-32 object-cover rounded-lg"
                  alt="Current recipe image"
                >
                <img 
                  v-else-if="imagePreview" 
                  :src="imagePreview"
                  class="mx-auto h-32 w-32 object-cover rounded-lg"
                  alt="New recipe image preview"
                >
                <svg v-else class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a new image</span>
                    <input type="file" class="sr-only" accept="image/*" @change="handleImageUpload">
                  </label>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
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
              <div v-for="(instruction, index) in recipe.instructions" :key="index" class="flex gap-2">
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
              @click="$router.push(`/recipe/${recipe._id}`)"
              class="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Cancel
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
              <span>{{ isSubmitting ? 'Saving Changes...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToastStore } from '@/stores/toastStore';
import { recipeService } from '@/services/recipe';

export default {
  name: 'EditRecipeView',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const toastStore = useToastStore();

    const recipe = ref({
      title: '',
      category: '',
      description: '',
      cookTime: '',
      difficulty: '',
      servings: '',
      image: null,
      ingredients: [''],
      instructions: ['']
    });

    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const error = ref(null);
    const imagePreview = ref(null);
    const newImage = ref(null);

    const categories = [
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
    ];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getRecipeById(route.params.id);
        recipe.value = response;
        isLoading.value = false;
      } catch (err) {
        error.value = 'Failed to load recipe. Please try again.';
        isLoading.value = false;
        console.error('Error fetching recipe:', err);
      }
    };

    const addIngredient = () => {
      recipe.value.ingredients.push('');
    };

    const removeIngredient = (index) => {
      recipe.value.ingredients.splice(index, 1);
      if (recipe.value.ingredients.length === 0) {
        recipe.value.ingredients.push('');
      }
    };

    const addInstruction = () => {
      recipe.value.instructions.push('');
    };

    const removeInstruction = (index) => {
      recipe.value.instructions.splice(index, 1);
      if (recipe.value.instructions.length === 0) {
        recipe.value.instructions.push('');
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        newImage.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const updateRecipe = async () => {
      isSubmitting.value = true;
      try {
        // Filter out empty ingredients and instructions
        const recipeData = {
          ...recipe.value,
          ingredients: recipe.value.ingredients.filter(i => i.trim()),
          instructions: recipe.value.instructions.filter(i => i.trim()),
          servings: parseInt(recipe.value.servings)
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

        // If there's a new image, add it to the form data
        if (newImage.value) {
          recipeData.image = newImage.value;
        }

        await recipeService.updateRecipe(recipe.value._id, recipeData);
        toastStore.success('Recipe updated successfully!');
        router.push(`/recipe/${recipe.value._id}`);
      } catch (error) {
        console.error('Error updating recipe:', error);
        toastStore.error(error.response?.data?.message || error.message || 'Failed to update recipe. Please try again.');
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(fetchRecipe);

    return {
      recipe,
      isLoading,
      isSubmitting,
      error,
      imagePreview,
      categories,
      difficulties,
      newImage,
      addIngredient,
      removeIngredient,
      addInstruction,
      removeInstruction,
      handleImageUpload,
      updateRecipe
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 