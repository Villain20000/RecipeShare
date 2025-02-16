<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-200"
    :class="{'shadow-md': isScrolled}"
  >
    <div class="w-full px-8 flex justify-around h-16 items-center">
      <!-- Left section with logo -->
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
            Recipe Share
          </router-link>
        </div>
      </div>

      <!-- Center section with navigation -->
      <div class="hidden sm:flex items-center space-x-8">
        <router-link 
          to="/" 
          class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 transition-all duration-200"
          :class="[$route.path === '/' ? 'border-blue-500' : 'border-transparent hover:border-gray-300']"
        >
          Home
        </router-link>
        
        <router-link 
          to="/explore" 
          class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 transition-all duration-200"
          :class="[$route.path === '/explore' ? 'border-blue-500' : 'border-transparent hover:border-gray-300']"
        >
          Explore
        </router-link>
      </div>

      <!-- Right section with actions -->
      <div class="flex items-center">
        <div class="hidden sm:flex sm:items-center">
          <!-- Share Recipe Button (for authenticated users) -->
          <router-link
            v-if="isAuthenticated"
            to="/share-recipe"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Share Recipe
          </router-link>

          <!-- Profile Dropdown -->
          <div v-if="isAuthenticated" class="ml-3 relative">
            <div>
              <button 
                @click="isProfileOpen = !isProfileOpen"
                class="flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ProfilePicture 
                  :src="user?.avatar"
                  :alt="user?.username"
                  size="sm"
                  hover
                />
              </button>
            </div>

            <!-- Dropdown Menu -->
            <div 
              v-show="isProfileOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200"
              :class="{'opacity-100 scale-100': isProfileOpen, 'opacity-0 scale-95': !isProfileOpen}"
            >
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                @click="isProfileOpen = false"
              >
                Your Profile
              </router-link>
              <router-link 
                to="/settings" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                @click="isProfileOpen = false"
              >
                Settings
              </router-link>
              <button 
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>

          <!-- Login/Signup Buttons (for guests) -->
          <template v-else>
            <router-link
              to="/login"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Sign in
            </router-link>
            <router-link
              to="/signup"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
            >
              Sign up
            </router-link>
          </template>
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="flex items-center sm:hidden">
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
        >
          <svg 
            class="h-6 w-6 transition-opacity duration-200" 
            :class="{'opacity-0': isMobileMenuOpen, 'opacity-100': !isMobileMenuOpen}"
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg 
            class="h-6 w-6 absolute transition-opacity duration-200" 
            :class="{'opacity-100': isMobileMenuOpen, 'opacity-0': !isMobileMenuOpen}"
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

    <!-- Mobile menu -->
    <div 
      class="sm:hidden transition-all duration-300 ease-in-out"
      :class="{'max-h-screen opacity-100': isMobileMenuOpen, 'max-h-0 opacity-0': !isMobileMenuOpen}"
    >
      <div class="pt-2 pb-3 space-y-1">
        <router-link 
          to="/" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
          :class="[$route.path === '/' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300']"
          @click="isMobileMenuOpen = false"
        >
          Home
        </router-link>
        
        <router-link 
          to="/explore" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
          :class="[$route.path === '/explore' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300']"
          @click="isMobileMenuOpen = false"
        >
          Explore
        </router-link>

        <template v-if="isAuthenticated">
          <router-link 
            to="/share-recipe" 
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Share Recipe
          </router-link>
          
          <router-link 
            to="/profile" 
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Your Profile
          </router-link>
          
          <router-link 
            to="/settings" 
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Settings
          </router-link>
          
          <button 
            @click="logout"
            class="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
          >
            Sign out
          </button>
        </template>
        
        <template v-else>
          <router-link 
            to="/login" 
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Sign in
          </router-link>
          
          <router-link 
            to="/signup" 
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Sign up
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import ProfilePicture from './ProfilePicture.vue';

export default {
  name: 'AppNavbar',
  components: {
    ProfilePicture
  },
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const isProfileOpen = ref(false);
    const isMobileMenuOpen = ref(false);
    const isScrolled = ref(false);

    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const user = computed(() => userStore.currentUser);

    // Handle scroll events for navbar shadow
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 0;
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isProfileOpen.value && !event.target.closest('.relative')) {
        isProfileOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    });

    const logout = async () => {
      userStore.logout();
      isProfileOpen.value = false;
      isMobileMenuOpen.value = false;
      router.push('/login');
    };

    return {
      isAuthenticated,
      user,
      isProfileOpen,
      isMobileMenuOpen,
      isScrolled,
      logout
    };
  }
};
</script>

<style scoped>
/* Add padding to body to account for fixed navbar */
:root {
  margin-top: 4rem;
}

/* Ensure content below navbar is not hidden */
body {
  padding-top: 4rem;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile menu animation */
.max-h-0 {
  max-height: 0;
  overflow: hidden;
}

.max-h-screen {
  max-height: calc(100vh - 4rem);
  overflow: hidden;
}
</style>
