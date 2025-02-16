const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename and add timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Optional auth middleware for GET routes
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};

// Get all recipes
router.get('/', optionalAuth, async (req, res) => {
  try {
    console.log('Fetching all recipes');
    const recipes = await Recipe.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    
    // If user is logged in, check which recipes are bookmarked
    if (req.user) {
      recipes.forEach(recipe => {
        recipe.isBookmarked = recipe.bookmarkedBy.includes(req.user.userId);
      });
    }
    
    console.log(`Found ${recipes.length} recipes`);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to load recipes. Please try again later.' });
  }
});

// Get a single recipe
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatar');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if recipe is bookmarked by current user
    if (req.user) {
      recipe.isBookmarked = recipe.bookmarkedBy.includes(req.user.userId);
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Failed to load recipe. Please try again later.' });
  }
});

// Create a new recipe
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Create recipe request received:', {
      body: req.body,
      file: req.file,
      userId: req.user.id
    });

    const recipeData = {
      ...req.body,
      author: req.user.id
    };

    // Handle arrays sent as form-data
    if (req.body['ingredients[]']) {
      recipeData.ingredients = Array.isArray(req.body['ingredients[]']) 
        ? req.body['ingredients[]'] 
        : [req.body['ingredients[]']];
    }
    if (req.body['instructions[]']) {
      recipeData.instructions = Array.isArray(req.body['instructions[]'])
        ? req.body['instructions[]']
        : [req.body['instructions[]']];
    }

    // Add image path if an image was uploaded
    if (req.file) {
      recipeData.image = `/uploads/${req.file.filename}`;
    }

    const recipe = new Recipe(recipeData);
    await recipe.save();
    await recipe.populate('author', 'username avatar');
    
    console.log('Recipe created successfully:', recipe);
    
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid recipe data',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(500).json({ 
      message: 'Failed to create recipe. Please try again later.',
      error: error.message
    });
  }
});

// Update a recipe
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Update request received:', {
      recipeId: req.params.id,
      body: req.body,
      file: req.file
    });

    let recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user is the author
    if (recipe.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    // Create a clean recipe data object
    const recipeData = {};
    
    // Handle basic fields
    const fields = ['title', 'description', 'category', 'cookTime', 'difficulty', 'servings'];
    fields.forEach(field => {
      if (req.body[field]) {
        recipeData[field] = field === 'servings' ? parseInt(req.body[field]) : req.body[field];
      }
    });

    // Handle arrays
    ['ingredients', 'instructions'].forEach(field => {
      const arrayField = `${field}[]`;
      if (req.body[arrayField]) {
        recipeData[field] = Array.isArray(req.body[arrayField])
          ? req.body[arrayField]
          : [req.body[arrayField]];
      }
    });

    // Handle image
    if (req.file) {
      // New image uploaded
      const newImagePath = `/uploads/${req.file.filename}`;
      recipeData.image = newImagePath;
      
      // Delete old image if it exists
      if (recipe.image && recipe.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', recipe.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Old image deleted successfully:', oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    } else if (req.body.image && req.body.image.startsWith('/uploads/')) {
      // Keep existing image
      recipeData.image = req.body.image;
    }

    console.log('Final recipe data for update:', recipeData);

    // Update the recipe
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: recipeData },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found after update' });
    }

    // Verify the update was successful
    const verifiedRecipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatar');
    
    console.log('Updated recipe image path:', verifiedRecipe.image);
    
    res.json(verifiedRecipe);
  } catch (error) {
    console.error('Detailed error in recipe update:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      file: req.file
    });
    res.status(500).json({ 
      message: 'Failed to update recipe. Please try again later.', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete a recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Delete request received:', {
      recipeId: req.params.id,
      userId: req.user.id
    });

    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    console.log('Recipe author check:', {
      recipeAuthor: recipe.author.toString(),
      requestUser: req.user.id,
      isMatch: recipe.author.toString() === req.user.id
    });

    // Check if user is the author
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    
    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Failed to delete recipe. Please try again later.' });
  }
});

// Toggle bookmark
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const userIndex = recipe.bookmarkedBy.indexOf(req.user.userId);
    if (userIndex === -1) {
      recipe.bookmarkedBy.push(req.user.userId);
    } else {
      recipe.bookmarkedBy.splice(userIndex, 1);
    }
    
    await recipe.save();
    res.json({ isBookmarked: userIndex === -1 });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Failed to update bookmark. Please try again later.' });
  }
});

module.exports = router; 