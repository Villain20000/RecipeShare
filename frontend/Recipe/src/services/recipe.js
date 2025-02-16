import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300;
};

// Add auth header to requests
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to format image URL
const formatImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  // Clean the path by removing any leading slashes and 'uploads' prefix
  const cleanPath = imagePath
    .replace(/^\/+/, '')
    .replace(/^uploads\//, '');
    
  const formattedUrl = `${BASE_URL}/uploads/${cleanPath}`;
  console.log('Formatting image URL:', {
    original: imagePath,
    cleaned: cleanPath,
    formatted: formattedUrl
  });
  return formattedUrl;
};

export const recipeService = {
  async getAllRecipes() {
    try {
      console.log('Fetching all recipes from:', `${API_URL}/recipes`);
      console.log('Auth headers:', authHeader());
      
      const response = await axios.get(`${API_URL}/recipes`, {
        headers: authHeader(),
        withCredentials: true,
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Accept only success status codes
        }
      });
      
      console.log('Raw response status:', response.status);
      console.log('Raw response data:', JSON.stringify(response.data, null, 2));
      
      // Validate response data
      if (!response.data) {
        console.error('No data received from server');
        throw new Error('No data received from server');
      }
      
      if (!Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      // Format image URLs in the response
      const recipes = response.data.map(recipe => {
        console.log('Processing recipe:', {
          id: recipe._id,
          title: recipe.title,
          image: recipe.image
        });
        
        const formattedRecipe = {
          ...recipe,
          image: formatImageUrl(recipe.image)
        };
        
        console.log('Formatted recipe:', {
          id: formattedRecipe._id,
          title: formattedRecipe.title,
          formattedImage: formattedRecipe.image
        });
        
        return formattedRecipe;
      });
      
      console.log('Successfully processed recipes. Total count:', recipes.length);
      return recipes;
    } catch (error) {
      console.error('Error fetching recipes:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          baseURL: error.config?.baseURL
        }
      });
      
      if (error.response?.status === 404) {
        throw new Error('Recipe service not available. Please ensure the server is running.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access. Please log in again.');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes. Please try again.');
    }
  },

  async getRecipeById(id) {
    try {
      const response = await axios.get(`${API_URL}/recipes/${id}`, {
        headers: authHeader()
      });
      
      if (!response.data) {
        throw new Error('Recipe not found');
      }
      
      // Format image URL in the response
      return {
        ...response.data,
        image: formatImageUrl(response.data.image)
      };
    } catch (error) {
      console.error('Error fetching recipe:', {
        id,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      
      if (error.response?.status === 404) {
        throw new Error('Recipe not found');
      }
      throw error;
    }
  },

  async createRecipe(recipeData) {
    try {
      console.log('Creating recipe:', {
        title: recipeData.title,
        category: recipeData.category,
        hasImage: !!recipeData.image
      });

      const formData = new FormData();
      
      // Handle basic fields
      const basicFields = ['title', 'description', 'category', 'cookTime', 'difficulty', 'servings'];
      basicFields.forEach(field => {
        if (recipeData[field] !== null && recipeData[field] !== undefined) {
          const value = typeof recipeData[field] === 'number' ? recipeData[field].toString() : recipeData[field];
          formData.append(field, value);
          console.log(`Appending ${field}:`, value);
        }
      });

      // Handle arrays - ensure they are properly formatted
      if (Array.isArray(recipeData.ingredients)) {
        const filteredIngredients = recipeData.ingredients.filter(ingredient => ingredient && ingredient.trim());
        filteredIngredients.forEach((ingredient, index) => {
          formData.append('ingredients[]', ingredient.trim());
          console.log(`Appending ingredient ${index + 1}:`, ingredient.trim());
        });
      }

      if (Array.isArray(recipeData.instructions)) {
        const filteredInstructions = recipeData.instructions.filter(instruction => instruction && instruction.trim());
        filteredInstructions.forEach((instruction, index) => {
          formData.append('instructions[]', instruction.trim());
          console.log(`Appending instruction ${index + 1}:`, instruction.trim());
        });
      }

      // Handle image if present
      if (recipeData.image instanceof File) {
        formData.append('image', recipeData.image);
        console.log('Appending image file:', recipeData.image.name);
      }

      // Get auth token and validate
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        throw new Error('Authentication required');
      }

      // Log complete form data for debugging
      console.log('Form data contents:', {
        fields: Array.from(formData.entries()).map(([key, value]) => {
          return key === 'image' ? `${key}: [File]` : `${key}: ${value}`;
        })
      });

      const response = await axios.post(`${API_URL}/recipes`, formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Recipe creation successful:', {
        status: response.status,
        id: response.data._id,
        title: response.data.title,
        author: response.data.author?._id
      });

      // Format and return the response
      const formattedRecipe = {
        ...response.data,
        image: formatImageUrl(response.data.image)
      };

      console.log('Returning formatted recipe:', {
        id: formattedRecipe._id,
        title: formattedRecipe.title,
        hasImage: !!formattedRecipe.image
      });

      return formattedRecipe;
    } catch (error) {
      console.error('Recipe creation error:', {
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          url: error.config?.url,
          method: error.config?.method
        }
      });
      throw error;
    }
  },

  async updateRecipe(id, recipeData) {
    const formData = new FormData();
    
    try {
      // Handle arrays and other fields
      Object.keys(recipeData).forEach(key => {
        if (key === 'image') {
          // Handle image field
          if (recipeData.image instanceof File) {
            // New image file upload
            formData.append('image', recipeData.image);
            console.log('Appending new image file:', recipeData.image.name);
          } else if (typeof recipeData.image === 'string' && recipeData.image.startsWith('/uploads/')) {
            // Keep existing image path
            formData.append('image', recipeData.image);
            console.log('Keeping existing image path:', recipeData.image);
          }
        } else if (Array.isArray(recipeData[key])) {
          // Handle arrays (ingredients and instructions)
          const filteredArray = recipeData[key].filter(item => item && item.trim());
          filteredArray.forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else if (recipeData[key] !== null && recipeData[key] !== undefined) {
          // Handle other fields
          formData.append(key, recipeData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/recipes/${id}`, formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });

      // Format image URL in the response
      const updatedRecipe = await this.getRecipeById(id);
      return updatedRecipe;
    } catch (error) {
      console.error('Recipe update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async deleteRecipe(id) {
    try {
      console.log('Attempting to delete recipe:', id);
      const response = await axios.delete(`${API_URL}/recipes/${id}`, {
        headers: authHeader()
      });
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting recipe:', {
        recipeId: id,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        isAuthError: error.response?.status === 403
      });
      
      if (error.response?.status === 403) {
        throw new Error('You are not authorized to delete this recipe');
      }
      throw error;
    }
  },

  async toggleBookmark(id) {
    const response = await axios.post(`${API_URL}/recipes/${id}/bookmark`, {}, {
      headers: authHeader()
    });
    return response.data;
  },

  async searchRecipes(query) {
    const response = await axios.get(`${API_URL}/recipes/search`, {
      headers: authHeader(),
      params: { query }
    });
    return response.data;
  },

  async getRecipesByCategory(category) {
    const response = await axios.get(`${API_URL}/recipes`, {
      headers: authHeader(),
      params: { category }
    });
    return response.data;
  },

  async getUserRecipes() {
    try {
      const response = await axios.get(`${API_URL}/users/recipes`, {
        headers: authHeader()
      });
      // Format image URLs in the response
      return response.data.map(recipe => ({
        ...recipe,
        image: formatImageUrl(recipe.image)
      }));
    } catch (error) {
      console.error('Error getting user recipes:', error);
      throw error;
    }
  },

  async getSavedRecipes() {
    try {
      const response = await axios.get(`${API_URL}/users/saved-recipes`, {
        headers: authHeader()
      });
      // Format image URLs in the response
      return response.data.map(recipe => ({
        ...recipe,
        image: formatImageUrl(recipe.image)
      }));
    } catch (error) {
      console.error('Error getting saved recipes:', error);
      throw error;
    }
  }
}; 