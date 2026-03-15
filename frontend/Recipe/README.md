# RecipeShare

A modern, minimal recipe sharing application built with Vue 3, TypeScript, Supabase, and Tailwind CSS.

## Features

- 🔐 **Authentication** - Secure user authentication with Supabase
- 📝 **Recipe Management** - Create, edit, and delete recipes
- 🔖 **Bookmarks** - Save favorite recipes
- 🔍 **Search & Filter** - Find recipes by category, difficulty, or search query
- 📱 **Responsive Design** - Works on all devices
- ✨ **Modern UI** - Clean, minimal design with smooth animations

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

## Getting Started

### 1. Clone and Install Dependencies

```bash
cd frontend/Recipe
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and run the contents of `supabase-schema.sql`
4. Go to Settings → API to find your project URL and anon key

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Supabase credentials:
# VITE_SUPABASE_URL=your-project-url
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── assets/           # Static assets and styles
├── components/       # Vue components
│   └── ui/          # Reusable UI components
├── lib/             # Third-party library configuration
│   └── supabase.ts  # Supabase client
├── middleware/      # Vue middleware
├── router/          # Vue Router configuration
├── services/        # API service functions
├── stores/          # Pinia stores
│   ├── authStore.ts
│   ├── recipeStore.ts
│   └── toastStore.ts
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── views/           # Page components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

## Supabase Database Schema

The database schema is defined in `supabase-schema.sql` and includes:

- **profiles** - User profiles linked to auth.users
- **recipes** - Recipe data with RLS policies
- **bookmarks** - User recipe bookmarks

## Design System

The app uses a custom Tailwind CSS design system with:

- Custom color palette (primary, accent, surface)
- Custom shadows for cards and hover states
- Custom animations (fade-in, slide-up, scale-in)
- Accessible focus states

## License

MIT
