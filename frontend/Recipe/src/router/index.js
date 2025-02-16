// eslint-disable-next-line
import { createRouter, createWebHistory } from 'vue-router';
import { setupRouteGuards } from './guards';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import RecipeDetailView from '@/views/RecipeDetailView.vue';
import ShareRecipeView from '@/views/ShareRecipeView.vue';
import UserProfileView from '@/views/UserProfileView.vue';
import SettingsView from '@/views/SettingsView.vue';
import ErrorPages from '@/views/ErrorPages.vue';
import ExploreView from '@/views/ExploreView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/explore',
    name: 'explore',
    component: ExploreView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { requiresGuest: true }
  },
  {
    path: '/recipe/:id',
    name: 'recipe-detail',
    component: RecipeDetailView
  },
  {
    path: '/recipe/:id/edit',
    name: 'edit-recipe',
    component: () => import('@/views/EditRecipeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/share-recipe',
    name: 'share-recipe',
    component: ShareRecipeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/403',
    name: 'forbidden',
    component: ErrorPages,
    props: { error: '403' }
  },
  {
    path: '/404',
    name: 'not-found',
    component: ErrorPages,
    props: { error: '404' }
  },
  {
    path: '/500',
    name: 'server-error',
    component: ErrorPages,
    props: { error: '500' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Setup route guards
setupRouteGuards(router);

export default router;
