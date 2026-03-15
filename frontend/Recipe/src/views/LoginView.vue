<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/5 rounded-full blur-[120px]"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <div class="bg-white rounded-[2.5rem] border border-surface-200 shadow-soft overflow-hidden">
        <div class="px-8 pt-12 pb-8 text-center">
          <router-link to="/" class="inline-flex items-center gap-2.5 group mb-8">
            <div class="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-elevation-2 group-hover:shadow-elevation-3 transition-all duration-300">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-2xl font-display font-black tracking-tight text-surface-900">RecipeShare</span>
          </router-link>
          
          <h2 class="text-3xl font-display font-black text-surface-900 mb-2">Welcome Back</h2>
          <p class="text-surface-500 font-medium">Log in to your account to continue your culinary journey.</p>
        </div>
        
        <form class="px-8 pb-12 space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-4">
            <Input 
              v-model="email" 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com" 
              required
              hasIcon
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </template>
            </Input>

            <div class="space-y-1">
              <Input 
                v-model="password" 
                label="Password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
                hasIcon
              >
                <template #icon>
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </template>
              </Input>
              <div class="flex items-center justify-between px-1">
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="text-xs font-bold text-surface-400 hover:text-brand-600 transition-colors"
                >
                  {{ showPassword ? 'Hide' : 'Show' }} Password
                </button>
                <a href="#" class="text-xs font-bold text-brand-600 hover:text-brand-700">Forgot Password?</a>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg" 
            class="rounded-2xl py-4 font-bold shadow-elevation-2"
            :loading="isLoading"
          >
            Sign In
          </Button>

          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-surface-100"></div></div>
            <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-4 text-surface-400 font-bold tracking-widest">Or continue with</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button type="button" class="flex justify-center items-center py-3 border border-surface-200 rounded-xl hover:bg-surface-50 transition-all font-bold text-sm text-surface-700">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              Google
            </button>
            <button type="button" class="flex justify-center items-center py-3 border border-surface-200 rounded-xl hover:bg-surface-50 transition-all font-bold text-sm text-surface-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              Facebook
            </button>
          </div>
        </form>
      </div>
      
      <p class="mt-8 text-center text-sm font-medium text-surface-500">
        New to RecipeShare?
        <router-link to="/signup" class="text-brand-600 font-bold hover:text-brand-700 underline-offset-4 hover:underline transition-all">
          Create an account
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useRoute } from 'vue-router';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = computed(() => authStore.loading);

const handleLogin = async () => {
  try {
    await authStore.signIn({ email: email.value, password: password.value });
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (err) {
    // Error is handled by store and displayed via toast or field
  }
};
</script>
