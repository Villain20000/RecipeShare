<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-[2.5rem] border border-surface-200 shadow-soft overflow-hidden">
      <!-- Form Header -->
      <div class="px-8 py-10 bg-surface-50 border-b border-surface-100 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-display font-black text-surface-900 mb-2">
            {{ isEdit ? 'Refine Masterpiece' : 'Share Your Creation' }}
          </h1>
          <p class="text-surface-500 font-medium">Fill in the details below to {{ isEdit ? 'update' : 'publish' }} your recipe.</p>
        </div>
        <div class="hidden sm:block">
          <div class="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitForm" class="p-8 lg:p-12 space-y-10">
        <!-- Basic Info Section -->
        <section class="space-y-6">
          <h2 class="text-xs font-black text-surface-400 uppercase tracking-widest mb-8 flex items-center gap-3">
            <span class="w-6 h-px bg-surface-200"></span>
            Basic Information
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              v-model="form.title" 
              label="Recipe Title" 
              placeholder="e.g. Grandma's Secret Pasta" 
              required
              hasIcon
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </template>
            </Input>

            <div class="space-y-1.5">
              <label class="block text-sm font-bold text-surface-700">Category</label>
              <select 
                v-model="form.category" 
                class="w-full px-4 py-2.5 bg-white border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-surface-900 transition-all outline-none"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input v-model="form.prepTime" label="Prep Time" placeholder="e.g. 15 mins" />
            <Input v-model="form.cookTime" label="Cook Time" placeholder="e.g. 45 mins" />
            <Input v-model="form.servings" label="Servings" placeholder="e.g. 4 people" />
          </div>

          <Input 
            v-model="form.description" 
            label="Short Description" 
            placeholder="Tell us a bit about this dish..." 
            class="md:col-span-2"
          />
        </section>

        <!-- Media Section -->
        <section class="space-y-6">
          <h2 class="text-xs font-black text-surface-400 uppercase tracking-widest mb-8 flex items-center gap-3">
            <span class="w-6 h-px bg-surface-200"></span>
            Visuals & Style
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input 
              v-model="form.image" 
              label="Cover Image URL" 
              placeholder="https://images.unsplash.com/..." 
              hasIcon
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </template>
            </Input>

            <div class="space-y-1.5">
              <label class="block text-sm font-bold text-surface-700">Difficulty Level</label>
              <div class="flex gap-2">
                <button 
                  v-for="level in ['Easy', 'Medium', 'Hard']" 
                  :key="level"
                  type="button"
                  @click="form.difficulty = level"
                  :class="['flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all', form.difficulty === level ? 'bg-brand-600 border-brand-600 text-white shadow-elevation-2' : 'bg-white border-surface-200 text-surface-600 hover:border-brand-200']"
                >
                  {{ level }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Image Preview -->
          <div v-if="form.image" class="relative aspect-video rounded-3xl overflow-hidden border border-surface-200 group bg-surface-100">
            <img :src="form.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" @error="handleImageError">
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-white font-bold">Image Preview</span>
            </div>
          </div>
        </section>

        <!-- Detailed Content Section -->
        <section class="space-y-10">
          <h2 class="text-xs font-black text-surface-400 uppercase tracking-widest mb-8 flex items-center gap-3">
            <span class="w-6 h-px bg-surface-200"></span>
            Recipe Content
          </h2>

          <div class="space-y-4">
            <label class="block text-sm font-bold text-surface-700">Ingredients</label>
            <p class="text-xs text-surface-400 mb-2">Add each ingredient on a new line or separate by commas.</p>
            <textarea 
              v-model="ingredientsText" 
              rows="6"
              placeholder="2 cups flour&#10;1 tsp salt&#10;..."
              class="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 text-surface-900 transition-all resize-none font-medium leading-relaxed"
            ></textarea>
          </div>

          <div class="space-y-4">
            <label class="block text-sm font-bold text-surface-700">Step-by-Step Instructions</label>
            <p class="text-xs text-surface-400 mb-2">Describe the process clearly. Use a new line for each step.</p>
            <textarea 
              v-model="instructionsText" 
              rows="8"
              placeholder="Step 1: Preheat oven to 350°F...&#10;Step 2: Mix dry ingredients..."
              class="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 text-surface-900 transition-all resize-none font-medium leading-relaxed"
            ></textarea>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="pt-10 border-t border-surface-100 flex flex-col sm:flex-row gap-4">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            class="flex-1 rounded-2xl py-4 font-bold shadow-elevation-2"
            :loading="isSubmitting"
          >
            {{ isEdit ? 'Save Changes' : 'Publish Recipe' }}
          </Button>
          <Button 
            type="button"
            variant="secondary" 
            size="lg" 
            class="flex-1 rounded-2xl py-4 font-bold"
            @click="$router.back()"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toastStore';
import { recipeService } from '@/services/recipe';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const props = defineProps({
  recipe: {
    type: Object,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const toastStore = useToastStore();
const isSubmitting = ref(false);

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Vegetarian', 'Vegan'];

const form = reactive({
  title: props.recipe.title || '',
  description: props.recipe.description || '',
  category: props.recipe.category || '',
  prepTime: props.recipe.prepTime || '',
  cookTime: props.recipe.cookTime || '',
  servings: props.recipe.servings || '',
  difficulty: props.recipe.difficulty || 'Medium',
  image: props.recipe.image || '',
  ingredients: props.recipe.ingredients || [],
  instructions: props.recipe.instructions || [],
});

const ingredientsText = ref(form.ingredients.join('\n'));
const instructionsText = ref(form.instructions.join('\n'));

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/800x450?text=Invalid+Image+URL';
};

const submitForm = async () => {
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  // Process text areas into arrays
  form.ingredients = ingredientsText.value
    .split(/\n|,/)
    .map(i => i.trim())
    .filter(i => i !== '');
    
  form.instructions = instructionsText.value
    .split('\n')
    .map(i => i.trim())
    .filter(i => i !== '');

  try {
    if (props.isEdit) {
      await recipeService.updateRecipe(props.recipe._id, form);
      toastStore.success('Recipe Updated', 'Your changes have been saved successfully.');
    } else {
      await recipeService.addRecipe(form);
      toastStore.success('Recipe Published!', 'Your culinary masterpiece is now live!');
    }
    router.push('/');
  } catch (error) {
    console.error(error);
    toastStore.error('Save Failed', 'We couldn\'t save your recipe. Please check all fields.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
