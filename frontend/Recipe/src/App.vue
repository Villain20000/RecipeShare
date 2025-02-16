console.log('Header component loaded');

<script>
import AppLayout from '@/components/AppLayout.vue';
import ToastNotification from '@/components/ToastNotification.vue';
import AppFooter from '@/components/AppFooter.vue';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref, computed, watch } from 'vue';
import { useToastStore } from '@/stores/toastStore';
import { useRouter } from 'vue-router';
import '@/assets/styles/animations.css';
import { useNotificationStore } from '@/stores/notificationStore';
import { RouterLink, RouterView } from 'vue-router';

const BASE_URL = 'http://localhost:5000';
const DEFAULT_AVATAR = '/default-avatar.png';

export default {
  name: 'App',
  components: {
    AppLayout,
    ToastNotification,
    AppFooter
  },
  setup() {
    const userStore = useUserStore();
    const toastStore = useToastStore();
    const router = useRouter();
    const toasts = ref([]);
    const isUserMenuOpen = ref(false);
    const notificationStore = useNotificationStore();
    const isSearchOpen = ref(false);
    const searchQuery = ref('');

    const getAvatarUrl = (avatar) => {
      if (!avatar) return DEFAULT_AVATAR;
      if (avatar.startsWith('data:')) return avatar;
      if (avatar.startsWith('http')) return avatar;
      // Clean the path and ensure it starts with uploads/
      const cleanPath = avatar.replace(/^uploads[\/\\]/, '').replace(/^[\/\\]/, '');
      return `${BASE_URL}/uploads/${cleanPath}`;
    };

    const userAvatar = computed(() => {
      if (!userStore.user) return DEFAULT_AVATAR;
      return getAvatarUrl(userStore.user.avatar);
    });

    // Watch for user changes to update the avatar
    watch(() => userStore.user, (newUser) => {
      if (newUser) {
        // Force a re-render of the avatar by triggering a reactivity update
        const avatarUrl = getAvatarUrl(newUser.avatar);
        console.log('Avatar URL updated:', avatarUrl);
      }
    }, { deep: true });

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: '/explore',
          query: { search: searchQuery.value }
        });
        isSearchOpen.value = false;
        searchQuery.value = '';
      }
    };

    // Close dropdown when clicking outside
    onMounted(() => {
      document.addEventListener('click', (event) => {
        const userMenuButton = document.querySelector('[data-user-menu-button]');
        const userMenu = document.querySelector('[data-user-menu]');
        const searchOverlay = document.querySelector('[data-search-overlay]');
        const searchButton = document.querySelector('[data-search-button]');
        
        // Don't close if clicking on the button or menu itself
        if (userMenuButton?.contains(event.target) || userMenu?.contains(event.target)) {
          return;
        }
        
        // Only close if clicking outside
        isUserMenuOpen.value = false;

        // Handle search overlay click outside
        if (!searchOverlay?.contains(event.target) && !searchButton?.contains(event.target)) {
          isSearchOpen.value = false;
        }
      });

      // Apply theme on app mount
      document.documentElement.classList.toggle('dark', userStore.isDarkMode);

      // Subscribe to toast events
      toastStore.$subscribe((mutation, state) => {
        if (mutation.type === 'addToast') {
          const toast = state.toasts[state.toasts.length - 1];
          toasts.value.push(toast);
          
          // Auto remove toast after duration
          setTimeout(() => {
            removeToast(toast.id);
          }, toast.duration || 5000);
        }
      });

      // Temporarily disable notification fetching until backend is ready
      // if (userStore.isAuthenticated) {
      //   notificationStore.fetchNotifications();
      // }
    });

    const removeToast = (id) => {
      toasts.value = toasts.value.filter(toast => toast.id !== id);
    };

    const handleLogout = async () => {
      try {
        await userStore.logout();
        toastStore.success('Successfully logged out');
        router.push('/login');
      } catch (error) {
        toastStore.error('Failed to log out');
      }
      isUserMenuOpen.value = false;
    };

    const handleNotificationClick = async (notification) => {
      if (!notification.read) {
        await notificationStore.markAsRead(notification.id);
      }
    };

    const handleMarkAllAsRead = async () => {
      await notificationStore.markAllAsRead();
    };

    const handleRecipeCreated = () => {
      // Emit event to parent components to refresh recipe list
      emitter.emit('refresh-recipes');
    };

    return {
      userStore,
      toasts,
      removeToast,
      isUserMenuOpen,
      handleLogout,
      userAvatar,
      notificationStore,
      handleNotificationClick,
      handleMarkAllAsRead,
      isSearchOpen,
      searchQuery,
      handleSearch,
      handleRecipeCreated
    };
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <!-- App Wrapper -->
    <div class="flex flex-col min-h-screen w-full">
      <nav class="w-full bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <router-link to="/" class="flex items-center group">
                <div class="relative w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span class="ml-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">RecipeShare</span>
              </router-link>
              
              <div class="hidden sm:ml-10 sm:flex sm:space-x-8">
                <router-link 
                  to="/" 
                  class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-all"
                  :class="[$route.path === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50']"
                >
                  <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </router-link>
                <router-link 
                  to="/explore" 
                  class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-all"
                  :class="[$route.path === '/explore' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50']"
                >
                  <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clip-rule="evenodd" />
                  </svg>
                  Explore
                </router-link>
                <router-link 
                  to="/share-recipe" 
                  class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-all"
                  :class="[$route.path === '/share-recipe' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50']"
                >
                  <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Share Recipe
                </router-link>
              </div>

              <div class="flex items-center space-x-4">
                <!-- Search Button -->
                <div class="relative">
                  <button 
                    data-search-button
                    @click="isSearchOpen = !isSearchOpen"
                    class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </button>

                  <div 
                    v-if="isSearchOpen"
                    data-search-overlay
                    class="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                  >
                    <form @submit.prevent="handleSearch">
                      <div class="relative">
                        <input 
                          v-model="searchQuery"
                          type="text" 
                          placeholder="Search recipes..." 
                          class="w-full pl-10 pr-4 py-3 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 border border-gray-200"
                          @keyup.esc="isSearchOpen = false"
                        >
                        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <div v-if="searchQuery" class="absolute inset-y-0 right-3 flex items-center">
                          <button 
                            type="button"
                            @click="searchQuery = ''"
                            class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <!-- Notifications -->
                <button class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
                  <span class="sr-only">View notifications</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <!-- Notification Badge -->
                  <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>

                <!-- User Menu -->
                <div class="relative">
                  <button 
                    @click="isUserMenuOpen = !isUserMenuOpen"
                    data-user-menu-button
                    class="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div class="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200">
                      <img 
                        :src="userAvatar" 
                        :alt="userStore.user?.username || 'User avatar'"
                        class="w-full h-full object-cover"
                      >
                    </div>
                    <span class="hidden sm:block text-sm font-medium text-gray-700">{{ userStore.user?.name || 'Guest' }}</span>
                    <svg 
                      class="w-5 h-5 text-gray-400 transition-transform duration-200"
                      :class="{ 'rotate-180': isUserMenuOpen }"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
      <transition 
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <div 
                      v-if="isUserMenuOpen"
                      data-user-menu
                      class="absolute right-0 mt-2 w-48 rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <!-- Authenticated User Menu -->
                      <template v-if="userStore.isAuthenticated">
                        <router-link 
                          to="/profile" 
                          class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          @click="isUserMenuOpen = false"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                          </svg>
                          Profile
                        </router-link>

                        <router-link 
                          to="/settings" 
                          class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          @click="isUserMenuOpen = false"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                          </svg>
                          Settings
                        </router-link>

                        <div class="border-t border-gray-100 my-1"></div>

                        <button 
                          @click="handleLogout"
                          class="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 00-1.414-1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                          </svg>
                          Sign out
                        </button>
                      </template>

                      <!-- Guest Menu -->
                      <template v-else>
                        <router-link 
                          to="/login" 
                          class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          @click="isUserMenuOpen = false"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                          </svg>
                          Sign in
                        </router-link>

                        <router-link 
                          to="/signup" 
                          class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          @click="isUserMenuOpen = false"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                          Sign up
                        </router-link>
                      </template>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main class="flex-1 w-full">
        <router-view v-slot="{ Component }" @recipe-created="handleRecipeCreated">
          <transition name="page" mode="out-in">
            <component 
              :is="Component" 
              class="w-full" 
              @recipe-created="handleRecipeCreated"
            ></component>
      </transition>
    </router-view>
      </main>

      <AppFooter />

      <!-- Toast Notifications -->
      <div class="fixed bottom-0 right-0 p-6 z-50">
        <transition-group name="list" tag="div" class="space-y-4">
          <div 
            v-for="toast in toasts" 
            :key="toast.id"
            class="bg-white rounded-xl shadow-lg p-4 max-w-md transform transition-all duration-300 hover:scale-102 animate-slide-in backdrop-blur-sm border border-gray-100"
            :class="{
              'border-l-4 border-green-500 bg-green-50/80': toast.type === 'success',
              'border-l-4 border-red-500 bg-red-50/80': toast.type === 'error',
              'border-l-4 border-blue-500 bg-blue-50/80': toast.type === 'info'
            }"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg 
                  v-if="toast.type === 'success'"
                  class="h-5 w-5 text-green-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg 
                  v-if="toast.type === 'error'"
                  class="h-5 w-5 text-red-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <svg 
                  v-if="toast.type === 'info'"
                  class="h-5 w-5 text-blue-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
                <p v-if="toast.message" class="mt-1 text-sm text-gray-600">{{ toast.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <button 
                  @click="removeToast(toast.id)"
                  class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

#app {
  display: block;
  width: 100%;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* List transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease-out;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Scale hover */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.notifications-container {
  position: relative;
  display: inline-block;
  margin-right: 1rem;
}

.notifications-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  max-height: 400px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.notifications-header h3 {
  margin: 0;
  font-size: 16px;
}

.mark-all-read {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 14px;
}

.notifications-list {
  overflow-y: auto;
  max-height: 350px;
}

.notification-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.notification-item:hover {
  background: #f5f5f5;
}

.notification-item.unread {
  background: #f0f7ff;
}

.notification-content {
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: #666;
}

.notifications-loading,
.notifications-error,
.no-notifications {
  padding: 12px;
  text-align: center;
  color: #666;
}

.notifications-error {
  color: #dc3545;
}
</style>
