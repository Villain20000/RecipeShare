const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false,
      default: null
    },
    category: {
      type: String,
      required: true,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Vegetarian', 'Vegan', 'Main Course', 'Side Dish']
    },
    cookTime: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard']
    },
    servings: {
      type: Number,
      required: true,
      min: 1
    },
    ingredients: [{
      type: String,
      required: true
    }],
    instructions: [{
      type: String,
      required: true
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    bookmarkedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Update the updatedAt timestamp before saving
recipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add virtual field for isBookmarked
recipeSchema.virtual('isBookmarked').get(function() {
  return this.bookmarkedBy && this.bookmarkedBy.length > 0;
});

// Ensure virtuals are included in JSON output
recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Recipe", recipeSchema);
