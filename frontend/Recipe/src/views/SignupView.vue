<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-500/5 rounded-full blur-[120px]"></div>
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
          
          <h2 class="text-3xl font-display font-black text-surface-900 mb-2">Create Account</h2>
          <p class="text-surface-500 font-medium">Join our global community of food lovers and start sharing.</p>
        </div>
        
        <form class="px-8 pb-12 space-y-6" @submit.prevent="handleSignup">
          <div class="space-y-4">
            <Input 
              v-model="username" 
              label="Username" 
              placeholder="ChefGordon" 
              required
              hasIcon
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </template>
            </Input>

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

            <div class="grid grid-cols-1 gap-4">
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
              <Input 
                v-model="confirmPassword" 
                label="Confirm Password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
              />
            </div>

            <div class="flex items-center gap-3 px-1">
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="text-xs font-bold text-surface-400 hover:text-brand-600 transition-colors"
              >
                {{ showPassword ? 'Hide' : 'Show' }} Password
              </button>
            </div>

            <div class="flex items-start gap-3 px-1 pt-2">
              <input 
                id="terms" 
                v-model="acceptTerms" 
                type="checkbox" 
                required
                class="mt-1 w-5 h-5 rounded-lg border-2 border-surface-200 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer"
              >
              <label for="terms" class="text-xs text-surface-500 leading-relaxed font-medium">
                I agree to the <a href="#" class="text-brand-600 font-bold hover:underline">Terms of Service</a> and <a href="#" class="text-brand-600 font-bold hover:underline">Privacy Policy</a>.
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg" 
            class="rounded-2xl py-4 font-bold shadow-elevation-2"
            :loading="isLoading"
            :disabled="!isFormValid"
          >
            Create Account
          </Button>
        </form>
      </div>
      
      <p class="mt-8 text-center text-sm font-medium text-surface-500">
        Already have an account?
        <router-link to="/login" class="text-brand-600 font-bold hover:text-brand-700 underline-offset-4 hover:underline transition-all">
          Sign in here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const acceptTerms = ref(false);
const isLoading = computed(() => authStore.loading);

const isFormValid = computed(() => {
  return (
    username.value.length >= 3 &&
    email.value.includes('@') &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value &&
    acceptTerms.value
  );
});

const handleSignup = async () => {
  if (!isFormValid.value) return;
  
  try {
    await authStore.signUp({
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    });
    router.push('/');
  } catch (err) {
    // Error is handled by store
  }
};
</script>
