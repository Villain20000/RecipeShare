const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');

app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Connect to MongoDB (update the connection string as needed)
// Check MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connect('mongodb://localhost:27017/recipe_sharing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
