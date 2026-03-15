# RecipeShare 🍳

Elevate your culinary journey with RecipeShare, a modern, high-end full-stack web application designed for food enthusiasts to discover, share, and organize their favorite recipes in one beautiful place.

## ✨ 2024 Modernization Update

The platform has undergone a complete UI/UX overhaul to meet 2024-2025 design standards, focusing on high-impact visuals, seamless micro-interactions, and a robust architectural foundation.

### 🎨 Visual & UI Enhancements
- **Modern Design System**: A unified design language using a bespoke brand palette (`brand-600` emerald) and sophisticated `surface` neutrals.
- **Glassmorphism**: Sophisticated use of backdrop blurs and semi-transparent layers for a deep, modern aesthetic.
- **Fluid Typography**: Responsive font scaling using `clamp()` for perfect readability across all screen sizes.
- **Dark Mode**: Native dark theme support with local persistence and automatic system preference detection.
- **Elevation System**: A custom shadow system for depth and hierarchy.

### 🚀 UX & Performance
- **Skeleton Loading**: Replaced generic spinners with high-fidelity skeleton screens for a perceived performance boost.
- **Micro-interactions**: Refined hover effects, scale transitions, and spring-based animations.
- **Unified Layout**: Consolidated architectural layout using `AppLayout` and modernized navigation.
- **Global Search**: A rapid-access command-style search overlay accessible from anywhere.
- **State-Driven Theme**: Robust theme initialization and persistence managed via Pinia.

## 🛠 Features

- **Authentication**: Secure signup/login with modern form validation, custom input components, and persistent session handling.
- **Recipe Management**: Create, edit, and publish recipes with a rich, distraction-free interface and real-time image previews.
- **Smart Discovery**: Explore recipes with multi-criteria filtering (category, difficulty, keywords) and a modern hero slider.
- **Social Integration**: Review and rate recipes, follow chefs, and save favorites.
- **User Profiles**: Beautifully crafted chef profiles showcasing published works and favorites with a tabbed interface.
- **Settings & Preferences**: Comprehensive settings for profile management, security, and interface preferences (Dark Mode, Units).
- **Responsive Design**: Mobile-first approach ensuring a premium experience on everything from smartphones to ultrawide monitors.

## 💻 Tech Stack

- **Frontend**: 
  - [Vue.js 3](https://vuejs.org/) (Composition API & Script Setup)
  - [Pinia](https://pinia.vuejs.org/) (State Management)
  - [Tailwind CSS](https://tailwindcss.com/) (Styling)
  - [Vite](https://vitejs.dev/) (Build Tool)
- **Backend**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: JWT & Supabase integration foundation.

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB installed or a connection string
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=5000
   JWT_SECRET=your_secure_secret
   ```
4. Start the server:
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

## 📬 API Endpoints

### Recipes
- `GET /api/recipes` - Discover all recipes
- `GET /api/recipes/:id` - Detailed recipe view
- `POST /api/recipes` - Publish new masterpiece (Auth)
- `PUT /api/recipes/:id` - Refine your creation (Auth)
- `DELETE /api/recipes/:id` - Remove recipe (Auth)

### Users
- `POST /api/users/signup` - Create chef account
- `POST /api/users/login` - Authenticate

---
Developed with ❤️ by the RecipeShare Team.
