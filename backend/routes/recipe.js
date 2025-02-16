const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Add new recipe route
router.post('/add', async (req, res) => {
  const { title, ingredients, instructions, image, category } = req.body;

  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      image,
      category,
      author: req.user.id
    });

    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit recipe route
router.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions, image, category } = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
      title,
      ingredients,
      instructions,
      image,
      category,
    }, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete recipe route
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all recipes route
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
