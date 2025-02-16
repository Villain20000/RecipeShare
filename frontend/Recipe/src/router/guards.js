import { authService } from '@/services/auth';

export function authGuard(to, from, next) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
}

export function setupRouteGuards(router) {
  router.beforeEach(authGuard);
} 