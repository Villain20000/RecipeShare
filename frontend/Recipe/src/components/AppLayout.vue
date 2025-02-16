<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and primary navigation -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-[#2563EB] font-bold text-lg sm:text-xl flex items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 sm:w-8 sm:h-8">
                  <circle cx="16" cy="16" r="16" fill="#2563EB"/>
                  <circle cx="16" cy="16" r="12" fill="white" stroke="#2563EB" stroke-width="1"/>
                  <path d="M12 10V22M12 10L14 12M12 10L10 12" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M20 10V22M20 10L22 12M20 10L18 12" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span class="hidden sm:inline">RecipeShare</span>
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="[$route.path === '/' ? 'border-[#2563EB]' : 'border-transparent hover:border-gray-300']"
              >
                Home
              </router-link>
              <router-link 
                to="/explore" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="[$route.path === '/explore' ? 'border-[#2563EB]' : 'border-transparent hover:border-gray-300']"
              >
                Explore
              </router-link>
              <router-link 
                to="/share-recipe" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="[$route.path === '/share-recipe' ? 'border-[#2563EB]' : 'border-transparent hover:border-gray-300']"
              >
                Share Recipe
              </router-link>
            </div>
          </div>

          <!-- Secondary Navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <!-- Search -->
            <button 
              @click="showSearch = true"
              class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 rounded-full"
            >
              <span class="sr-only">Search</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Notifications -->
            <button 
              v-if="isLoggedIn"
              class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 rounded-full relative"
            >
              <span class="sr-only">View notifications</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span v-if="notificationCount > 0" class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white font-medium flex items-center justify-center transform -translate-y-1 translate-x-1">
                {{ notificationCount }}
              </span>
            </button>

            <!-- Profile dropdown -->
            <div v-if="isLoggedIn" class="relative">
              <button 
                @click="showProfileMenu = !showProfileMenu"
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="userAvatar" alt="">
              </button>

              <!-- Profile dropdown menu -->
              <div 
                v-if="showProfileMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </router-link>
                <router-link 
                  to="/settings" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </router-link>
                <button 
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>

            <!-- Login/Signup buttons -->
            <div v-else class="flex items-center space-x-4">
              <router-link 
                to="/login"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign in
              </router-link>
              <router-link 
                to="/signup"
                class="bg-[#2563EB] text-white hover:bg-blue-700 px-4 py-2 text-sm font-medium rounded-full"
              >
                Sign up
              </router-link>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button 
              @click="showMobileMenu = !showMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2563EB]"
            >
              <span class="sr-only">Open main menu</span>
              <svg 
                v-if="!showMobileMenu"
                class="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                v-else
                class="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            to="/"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="[$route.path === '/' ? 'border-[#2563EB] text-[#2563EB] bg-blue-50' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300']"
          >
            Home
          </router-link>
          <router-link 
            to="/explore"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="[$route.path === '/explore' ? 'border-[#2563EB] text-[#2563EB] bg-blue-50' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300']"
          >
            Explore
          </router-link>
          <router-link 
            to="/share-recipe"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="[$route.path === '/share-recipe' ? 'border-[#2563EB] text-[#2563EB] bg-blue-50' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300']"
          >
            Share Recipe
          </router-link>
        </div>
        <div v-if="isLoggedIn" class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full" :src="userAvatar" alt="">
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ userName }}</div>
              <div class="text-sm font-medium text-gray-500">{{ userEmail }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link 
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Your Profile
            </router-link>
            <router-link 
              to="/settings"
              class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Settings
            </router-link>
            <button 
              @click="logout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
        <div v-else class="pt-4 pb-3 border-t border-gray-200">
          <div class="space-y-1">
            <router-link 
              to="/login"
              class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign in
            </router-link>
            <router-link 
              to="/signup"
              class="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">About</h3>
            <ul class="space-y-4">
              <li>
                <router-link to="/about" class="text-base text-gray-600 hover:text-gray-900">
                  About Us
                </router-link>
              </li>
              <li>
                <router-link to="/blog" class="text-base text-gray-600 hover:text-gray-900">
                  Blog
                </router-link>
              </li>
              <li>
                <router-link to="/careers" class="text-base text-gray-600 hover:text-gray-900">
                  Careers
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Support</h3>
            <ul class="space-y-4">
              <li>
                <router-link to="/help" class="text-base text-gray-600 hover:text-gray-900">
                  Help Center
                </router-link>
              </li>
              <li>
                <router-link to="/safety" class="text-base text-gray-600 hover:text-gray-900">
                  Safety Center
                </router-link>
              </li>
              <li>
                <router-link to="/community" class="text-base text-gray-600 hover:text-gray-900">
                  Community Guidelines
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Legal</h3>
            <ul class="space-y-4">
              <li>
                <router-link to="/privacy" class="text-base text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </router-link>
              </li>
              <li>
                <router-link to="/terms" class="text-base text-gray-600 hover:text-gray-900">
                  Terms of Service
                </router-link>
              </li>
              <li>
                <router-link to="/cookies" class="text-base text-gray-600 hover:text-gray-900">
                  Cookie Policy
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Connect</h3>
            <div class="flex space-x-6">
              <a href="#" class="text-gray-500 hover:text-gray-900">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-900">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-900">
                <span class="sr-only">Twitter</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-200 pt-8">
          <p class="text-base text-gray-500 text-center">
            &copy; {{ new Date().getFullYear() }} RecipeShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <!-- Search Modal -->
    <div 
      v-if="showSearch"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="showSearch = false"
        ></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                  Search Recipes
                </h3>
                <div class="relative">
                  <input 
                    v-model="searchQuery"
                    type="text"
                    class="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="Search recipes..."
                    @keyup.enter="handleSearch"
                  >
                  <button
                    @click="handleSearch"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 rounded-full"
                  >
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

export default {
  name: 'AppLayout',
  setup() {
    const userStore = useUserStore();

    const isLoggedIn = computed(() => userStore.isAuthenticated);
    const userAvatar = computed(() => userStore.user?.avatar || 'https://via.placeholder.com/40');
    const userName = computed(() => userStore.user?.username || '');
    const userEmail = computed(() => userStore.user?.email || '');

    const logout = async () => {
      await userStore.logout();
      showProfileMenu.value = false;
    };

    return {
      isLoggedIn,
      userAvatar,
      userName,
      userEmail,
      logout
    };
  },
  data() {
    return {
      showMobileMenu: false,
      showProfileMenu: false,
      showSearch: false,
      searchQuery: '',
      notificationCount: 2 // TODO: Replace with actual notification count
    };
  },
  methods: {
    handleSearch() {
      this.showSearch = false;
      this.$router.push({
        path: '/search',
        query: { q: this.searchQuery }
      });
    }
  },
  watch: {
    '$route'() {
      this.showMobileMenu = false;
      this.showProfileMenu = false;
    }
  }
};
</script> 