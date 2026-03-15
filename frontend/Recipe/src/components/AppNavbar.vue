<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-350 ease-smooth"
    :class="[
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-soft py-2 border-b border-surface-200/50' 
        : 'bg-transparent py-4'
    ]"
  >
    <div class="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-12">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="flex items-center gap-2.5 group">
            <div 
              class="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-elevation-2 group-hover:shadow-elevation-3 transition-all duration-300 group-hover:-translate-y-0.5"
              :class="{'bg-brand-500': isScrolled}"
            >
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span 
              class="text-xl font-display font-bold tracking-tight transition-colors duration-300"
              :class="isScrolled ? 'text-surface-900' : 'text-surface-900'"
            >
              RecipeShare
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1 lg:space-x-2">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path" 
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
            :class="[
              $route.path === item.path 
                ? 'bg-brand-50 text-brand-700' 
                : 'text-surface-600 hover:text-brand-600 hover:bg-brand-50/50'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.name }}
          </router-link>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Search Toggle -->
          <button 
            @click="$emit('open-search')"
            class="p-2.5 rounded-full text-surface-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            aria-label="Search"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <template v-if="isAuthenticated">
            <!-- Notifications -->
            <button 
              class="relative p-2.5 rounded-full text-surface-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              aria-label="Notifications"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-white"></span>
            </button>

            <!-- User Menu -->
            <div class="relative ml-2">
              <button 
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-surface-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                id="user-menu-button"
              >
                <div class="w-8 h-8 rounded-full overflow-hidden border border-surface-100 shadow-soft">
                  <img 
                    :src="userAvatar" 
                    :alt="user?.username"
                    class="w-full h-full object-cover"
                  >
                </div>
                <svg 
                  class="w-4 h-4 text-surface-400 transition-transform duration-300"
                  :class="{'rotate-180': isProfileOpen}"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Profile Dropdown -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-2"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 -translate-y-2"
              >
                <div 
                  v-show="isProfileOpen"
                  class="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white shadow-elevation-4 ring-1 ring-black/5 py-2 z-[60]"
                >
                  <div class="px-4 py-3 border-b border-surface-100">
                    <p class="text-sm font-semibold text-surface-900 truncate">{{ user?.name || user?.username }}</p>
                    <p class="text-xs text-surface-500 truncate">{{ user?.email }}</p>
                  </div>
                  <div class="py-1">
                    <router-link 
                      v-for="link in profileLinks" 
                      :key="link.path"
                      :to="link.path"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      @click="isProfileOpen = false"
                    >
                      <component :is="link.icon" class="w-4 h-4" />
                      {{ link.name }}
                    </router-link>
                  </div>
                  <div class="border-t border-surface-100 mt-1 pt-1">
                    <button 
                      @click="handleLogout"
                      class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-accent-600 hover:bg-accent-50 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <template v-else>
            <div class="hidden sm:flex items-center gap-3">
              <router-link 
                to="/login"
                class="px-5 py-2 text-sm font-semibold text-surface-700 hover:text-brand-600 transition-colors"
              >
                Sign in
              </router-link>
              <router-link 
                to="/signup"
                class="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 active:scale-95"
              >
                Sign up
              </router-link>
            </div>
            <!-- Mobile Auth Trigger -->
            <router-link 
              to="/login"
              class="sm:hidden p-2.5 rounded-full text-surface-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </router-link>
          </template>

          <!-- Mobile Menu Toggle -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2.5 rounded-full text-surface-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            aria-label="Menu"
          >
            <svg 
              class="w-6 h-6 transition-transform duration-300"
              :class="{'rotate-90': isMobileMenuOpen}"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition duration-300 ease-smooth"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-show="isMobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-white shadow-elevation-5 border-t border-surface-100 px-4 py-6 z-[55] max-h-[calc(100vh-4rem)] overflow-y-auto"
      >
        <div class="space-y-2">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path" 
            class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium transition-all duration-200"
            :class="[
              $route.path === item.path 
                ? 'bg-brand-50 text-brand-700' 
                : 'text-surface-700 hover:bg-surface-50'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <div class="p-2 rounded-xl" :class="[$route.path === item.path ? 'bg-brand-100' : 'bg-surface-100']">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            {{ item.name }}
          </router-link>
        </div>
        
        <div v-if="!isAuthenticated" class="mt-8 space-y-3 px-4">
          <router-link 
            to="/signup"
            class="flex w-full items-center justify-center px-6 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 shadow-elevation-2"
            @click="isMobileMenuOpen = false"
          >
            Create Account
          </router-link>
          <router-link 
            to="/login"
            class="flex w-full items-center justify-center px-6 py-4 bg-surface-100 text-surface-900 font-bold rounded-2xl hover:bg-surface-200"
            @click="isMobileMenuOpen = false"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useRoute } from 'vue-router';
import ProfilePicture from './ProfilePicture.vue';

// Icons
const HomeIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
};
const ExploreIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`
};
const ShareIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`
};
const ProfileIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
};
const SettingsIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
};

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isProfileOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const userAvatar = computed(() => user.value?.avatar || 'https://via.placeholder.com/40');

const navItems = [
  { name: 'Home', path: '/', icon: markRaw(HomeIcon) },
  { name: 'Explore', path: '/explore', icon: markRaw(ExploreIcon) },
  { name: 'Share', path: '/share-recipe', icon: markRaw(ShareIcon) },
];

const profileLinks = [
  { name: 'My Profile', path: '/profile', icon: markRaw(ProfileIcon) },
  { name: 'Settings', path: '/settings', icon: markRaw(SettingsIcon) },
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleClickOutside = (event) => {
  if (isProfileOpen.value && !event.target.closest('#user-menu-button')) {
    isProfileOpen.value = false;
  }
};

const handleLogout = async () => {
  await authStore.logout();
  isProfileOpen.value = false;
  isMobileMenuOpen.value = false;
  router.push('/login');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.ease-smooth {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>


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
