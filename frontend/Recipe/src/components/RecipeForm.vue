<template>
  <div>
    <h1>{{ isEdit ? 'Edit Recipe' : 'Add Recipe' }}</h1>
    <form @submit.prevent="submitForm">
      <input type="text" v-model="title" placeholder="Recipe Title" required />
      <textarea v-model="ingredients" placeholder="Ingredients (comma separated)" required></textarea>
      <textarea v-model="instructions" placeholder="Instructions" required></textarea>
      <input type="text" v-model="image" placeholder="Image URL" />
      <input type="text" v-model="category" placeholder="Category" />
      <button type="submit">{{ isEdit ? 'Update Recipe' : 'Add Recipe' }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RecipeForm',
  props: {
    recipe: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: this.recipe.title || '',
      ingredients: this.recipe.ingredients ? this.recipe.ingredients.join(', ') : '',
      instructions: this.recipe.instructions || '',
      image: this.recipe.image || '',
      category: this.recipe.category || '',
    };
  },
  methods: {
    async submitForm() {
      try {
        if (this.isEdit) {
          // Logic for updating a recipe
          await axios.put(`http://localhost:5000/api/recipes/edit/${this.recipe._id}`, {
            title: this.title,
            ingredients: this.ingredients.split(','),
            instructions: this.instructions,
            image: this.image,
            category: this.category,
          });
          alert('Recipe updated successfully!');
        } else {
          // Logic for adding a new recipe
          await axios.post('http://localhost:5000/api/recipes/add', {
            title: this.title,
            ingredients: this.ingredients.split(','),
            instructions: this.instructions,
            image: this.image,
            category: this.category,
            creator: localStorage.getItem('userId'), // Assuming userId is stored in localStorage
          });
          alert('Recipe added successfully!');
        }
      } catch (error) {
        console.error(error);
        alert('Failed to save the recipe. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
/* Add styles for RecipeForm */
</style>
