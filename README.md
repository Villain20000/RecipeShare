# Recipe Sharing App

A full-stack web application for sharing and discovering recipes.

## Features

- User authentication (signup/login)
- Create, read, update, and delete recipes
- Bookmark favorite recipes
- Search recipes by title or ingredients
- Filter recipes by category
- Responsive design for all devices

## Tech Stack

- Frontend: Vue.js 3 with Tailwind CSS
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/recipe_sharing
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend/Recipe
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## API Endpoints

### Recipes

- GET /api/recipes - Get all recipes
- GET /api/recipes/:id - Get a specific recipe
- POST /api/recipes - Create a new recipe (requires authentication)
- PUT /api/recipes/:id - Update a recipe (requires authentication)
- DELETE /api/recipes/:id - Delete a recipe (requires authentication)
- POST /api/recipes/:id/bookmark - Toggle recipe bookmark (requires authentication)

### Users

- POST /api/users/signup - Create a new user account
- POST /api/users/login - Login to existing account

## Contributing

Feel free to submit issues and enhancement requests!
