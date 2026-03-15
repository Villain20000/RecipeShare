<template>
  <footer class="bg-white border-t border-surface-200 pt-16 pb-8">
    <div class="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        <!-- Brand Section -->
        <div class="space-y-6">
          <router-link to="/" class="flex items-center gap-2.5 group w-fit">
            <div class="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-elevation-2 group-hover:shadow-elevation-3 transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-xl font-display font-bold tracking-tight text-surface-900">RecipeShare</span>
          </router-link>
          <p class="text-surface-600 text-sm leading-relaxed max-w-xs">
            Join our global community of food enthusiasts. Discover, share, and organize your favorite recipes in one beautiful place.
          </p>
          <div class="flex items-center gap-4">
            <a v-for="social in socialLinks" :key="social.name" :href="social.href" class="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center text-surface-400 hover:bg-brand-50 hover:text-brand-600 transition-all duration-300 border border-surface-100">
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-bold text-surface-900 uppercase tracking-widest mb-6">Explore</h4>
          <ul class="space-y-4">
            <li v-for="link in quickLinks" :key="link.name">
              <router-link :to="link.path" class="text-surface-600 hover:text-brand-600 transition-colors flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-200 group-hover:bg-brand-500 transition-colors"></span>
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Popular Categories -->
        <div>
          <h4 class="text-sm font-bold text-surface-900 uppercase tracking-widest mb-6">Categories</h4>
          <div class="flex flex-wrap gap-2">
            <router-link 
              v-for="cat in categories" 
              :key="cat"
              :to="`/explore?category=${cat}`"
              class="px-4 py-2 bg-surface-50 hover:bg-brand-50 hover:text-brand-600 text-surface-600 rounded-xl text-sm font-medium transition-all border border-surface-100"
            >
              {{ cat }}
            </router-link>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="space-y-6">
          <h4 class="text-sm font-bold text-surface-900 uppercase tracking-widest mb-6">Stay Inspired</h4>
          <p class="text-surface-600 text-sm">Get the latest recipes and cooking tips delivered to your inbox.</p>
          <form @submit.prevent="subscribeNewsletter" class="space-y-3">
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                placeholder="Enter your email"
                class="w-full pl-4 pr-12 py-3 bg-surface-50 border border-surface-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              >
              <button 
                type="submit"
                :disabled="isSubscribing"
                class="absolute right-1.5 top-1.5 p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all disabled:opacity-50"
              >
                <svg v-if="!isSubscribing" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <p class="text-[10px] text-surface-400 px-1">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-6 text-sm text-surface-500">
          <p>© {{ new Date().getFullYear() }} RecipeShare. All rights reserved.</p>
        </div>
        <div class="flex items-center gap-8">
          <a v-for="link in legalLinks" :key="link.name" :href="link.href" class="text-sm text-surface-500 hover:text-surface-900 transition-colors">
            {{ link.name }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, markRaw } from 'vue';
import { useToastStore } from '@/stores/toastStore';

const toastStore = useToastStore();
const email = ref('');
const isSubscribing = ref(false);

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Healthy', 'Vegan'];

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Explore Recipes', path: '/explore' },
  { name: 'Share a Recipe', path: '/share-recipe' },
  { name: 'Your Profile', path: '/profile' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Cookie Policy', href: '#' },
];

// Icons
const FacebookIcon = { template: `<svg fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>` };
const InstagramIcon = { template: `<svg fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" /></svg>` };
const TwitterIcon = { template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>` };

const socialLinks = [
  { name: 'Facebook', href: '#', icon: markRaw(FacebookIcon) },
  { name: 'Instagram', href: '#', icon: markRaw(InstagramIcon) },
  { name: 'Twitter', href: '#', icon: markRaw(TwitterIcon) },
];

const subscribeNewsletter = async () => {
  if (!email.value) return;

  isSubscribing.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toastStore.success('Success!', 'You have been subscribed to our newsletter.');
    email.value = '';
  } catch (error) {
    toastStore.error('Subscription failed', 'Please try again later.');
  } finally {
    isSubscribing.value = false;
  }
};
</script>
