<template>
  <div class="min-h-screen bg-surface-50 py-12">
    <div class="container-app max-w-4xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div class="stagger-children">
          <h1 class="text-fluid-h2 font-display font-black text-surface-900 mb-2">Account Settings</h1>
          <p class="text-surface-500 font-medium leading-relaxed">Manage your personal information, security, and interface preferences.</p>
        </div>
        <Button variant="secondary" to="/profile" class="rounded-2xl w-fit">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Profile
        </Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar Navigation -->
        <nav class="lg:col-span-1 space-y-2">
          <button 
            v-for="tab in ['General', 'Security', 'Preferences', 'Notifications']" 
            :key="tab"
            @click="activeTab = tab"
            :class="['w-full px-6 py-4 rounded-2xl text-sm font-bold transition-all text-left flex items-center justify-between group', activeTab === tab ? 'bg-white text-brand-600 shadow-elevation-2 border border-surface-100' : 'text-surface-500 hover:bg-white hover:text-surface-900']"
          >
            {{ tab }}
            <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </nav>

        <!-- Main Settings Form -->
        <main class="lg:col-span-2">
          <div class="bg-white rounded-[2.5rem] border border-surface-200 shadow-soft p-8 lg:p-12">
            <!-- Loading -->
            <div v-if="isLoading" class="py-20 text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
              <p class="text-surface-500 font-bold">Synchronizing...</p>
            </div>

            <form v-else @submit.prevent="saveSettings" class="space-y-12">
              <!-- General Section -->
              <section v-if="activeTab === 'General'" class="animate-fade-in space-y-8">
                <div class="flex items-center gap-6 pb-8 border-b border-surface-100">
                  <div class="relative group">
                    <div class="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-surface-50 shadow-soft">
                      <img :src="avatarPreview || userAvatar" class="w-full h-full object-cover">
                    </div>
                    <button 
                      type="button"
                      @click="triggerAvatarUpload"
                      class="absolute -bottom-2 -right-2 p-2.5 bg-brand-600 text-white rounded-xl shadow-elevation-3 hover:bg-brand-700 transition-all hover:scale-110 active:scale-95"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 011.664.89l.812 1.22A2 2 0 0010.07 10H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload">
                  </div>
                  <div>
                    <h3 class="text-lg font-display font-bold text-surface-900">Profile Image</h3>
                    <p class="text-sm text-surface-500">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div class="space-y-6">
                  <Input v-model="form.username" label="Display Name" placeholder="e.g. ChefGordon" required hasIcon>
                    <template #icon><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></template>
                  </Input>
                  <Input v-model="form.email" label="Email Address" type="email" placeholder="gordon@example.com" required hasIcon>
                    <template #icon><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></template>
                  </Input>
                  <div class="space-y-1.5">
                    <label class="block text-sm font-bold text-surface-700">Short Bio</label>
                    <textarea 
                      v-model="form.bio" 
                      rows="4" 
                      placeholder="Tell the community about your cooking style..."
                      class="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 text-surface-900 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </section>

              <!-- Security Section -->
              <section v-if="activeTab === 'Security'" class="animate-fade-in space-y-8">
                <div class="p-6 bg-accent-50 rounded-3xl border border-accent-100 flex gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-accent-500 shadow-soft">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-accent-900">Security Recommendation</h3>
                    <p class="text-xs text-accent-700 leading-relaxed mt-1">Use at least 12 characters with a mix of letters, numbers, and symbols for a strong password.</p>
                  </div>
                </div>

                <div class="space-y-6">
                  <Input v-model="form.currentPassword" label="Current Password" type="password" placeholder="••••••••" hasIcon>
                    <template #icon><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></template>
                  </Input>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input v-model="form.newPassword" label="New Password" type="password" placeholder="••••••••" />
                    <Input v-model="form.confirmPassword" label="Confirm New Password" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </section>

              <!-- Preferences Section -->
              <section v-if="activeTab === 'Preferences'" class="animate-fade-in space-y-10">
                <div class="flex items-center justify-between p-6 bg-surface-50 rounded-3xl border border-surface-100">
                  <div class="flex gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-600 shadow-soft">
                      <svg v-if="!isDarkMode" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 18v1m9-11h-1M4 11H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-surface-900">Dark Mode</h3>
                      <p class="text-xs text-surface-500 mt-1">Switch to a darker interface for low-light environments.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    @click="authStore.toggleDarkMode"
                    class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent group"
                    :class="isDarkMode ? 'bg-brand-600 ring-brand-500/20' : 'bg-surface-200'"
                  >
                    <span 
                      class="inline-block h-6 w-6 transform rounded-full bg-white shadow-elevation-2 transition-transform duration-300 ease-smooth"
                      :class="isDarkMode ? 'translate-x-7' : 'translate-x-1'"
                    />
                  </button>
                </div>

                <div class="space-y-6">
                  <h3 class="text-xs font-black text-surface-400 uppercase tracking-widest px-1">Display Units</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <button 
                      v-for="unit in ['Metric (g, ml)', 'US Imperial (oz, cup)']" 
                      :key="unit"
                      type="button"
                      class="px-6 py-4 rounded-2xl border-2 transition-all text-sm font-bold text-left"
                      :class="selectedUnit === unit ? 'bg-brand-50 border-brand-600 text-brand-700' : 'bg-white border-surface-100 text-surface-500 hover:border-brand-200'"
                      @click="selectedUnit = unit"
                    >
                      {{ unit }}
                    </button>
                  </div>
                </div>
              </section>

              <!-- Notifications Section -->
              <section v-if="activeTab === 'Notifications'" class="animate-fade-in space-y-6">
                <div 
                  v-for="(pref, key) in notificationPrefs" 
                  :key="key"
                  class="flex items-center justify-between p-6 hover:bg-surface-50 rounded-3xl transition-colors group"
                >
                  <div class="flex gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-surface-100 text-surface-400 flex items-center justify-center group-hover:bg-white group-hover:text-brand-600 transition-all shadow-soft">
                      <component :is="pref.icon" class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-surface-900">{{ pref.title }}</h3>
                      <p class="text-xs text-surface-500 mt-1 leading-relaxed">{{ pref.description }}</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="form[key]" 
                    class="w-6 h-6 rounded-lg border-2 border-surface-200 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer"
                  >
                </div>
              </section>

              <!-- Save Actions -->
              <div class="pt-10 border-t border-surface-100 flex items-center justify-end gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  class="rounded-xl px-6"
                  @click="resetForm"
                >
                  Discard Changes
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  class="rounded-xl px-10 py-3 shadow-elevation-2"
                  :loading="isSubmitting"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, markRaw } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { userService } from '@/services/user';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

const authStore = useAuthStore();
const toastStore = useToastStore();

const activeTab = ref('General');
const isLoading = ref(true);
const isSubmitting = ref(false);
const avatarInput = ref(null);
const avatarPreview = ref(null);
const newAvatar = ref(null);
const selectedUnit = ref('Metric (g, ml)');

const isDarkMode = computed(() => authStore.isDarkMode);
const userAvatar = computed(() => authStore.user?.avatar || 'https://via.placeholder.com/100');

const form = ref({
  username: '',
  email: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  emailNotifications: false,
  newsletterSubscription: false,
  followerAlerts: true
});

const notificationPrefs = {
  emailNotifications: {
    title: 'Recipe Updates',
    description: 'Get notified when someone comments on your shared recipes.',
    icon: markRaw({ template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>` })
  },
  newsletterSubscription: {
    title: 'Weekly Inspiration',
    description: 'Our hand-picked selection of the best recipes from the community.',
    icon: markRaw({ template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>` })
  },
  followerAlerts: {
    title: 'New Followers',
    description: 'Stay in the loop when food enthusiasts start following your kitchen.',
    icon: markRaw({ template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>` })
  }
};

const triggerAvatarUpload = () => avatarInput.value.click();

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      toastStore.error('Image too large', 'Profile picture must be under 2MB.');
      return;
    }
    newAvatar.value = file;
    const reader = new FileReader();
    reader.onload = (e) => avatarPreview.value = e.target.result;
    reader.readAsDataURL(file);
  }
};

const loadUserSettings = async () => {
  try {
    const settings = await userService.getUserSettings();
    form.value = {
      ...form.value,
      username: settings.username,
      email: settings.email,
      bio: settings.bio || '',
      emailNotifications: settings.emailNotifications || false,
      newsletterSubscription: settings.newsletterSubscription || false
    };
  } catch (err) {
    console.error('Error loading settings:', err);
    toastStore.error('Sync Error', 'Failed to load your latest settings.');
  } finally {
    isLoading.value = false;
  }
};

const saveSettings = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('username', form.value.username);
    formData.append('email', form.value.email);
    formData.append('bio', form.value.bio || '');
    formData.append('settings', JSON.stringify({
      emailNotifications: form.value.emailNotifications,
      newsletterSubscription: form.value.newsletterSubscription
    }));

    if (newAvatar.value) formData.append('avatar', newAvatar.value);

    // Simulated API call for password if needed
    if (form.value.newPassword) {
      if (form.value.newPassword !== form.value.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      await userService.changePassword(form.value.currentPassword, form.value.newPassword);
    }

    await userService.updateUserSettings(formData);
    toastStore.success('Success!', 'Your profile settings have been updated.');
    
    form.value.currentPassword = '';
    form.value.newPassword = '';
    form.value.confirmPassword = '';
    newAvatar.value = null;
    avatarPreview.value = null;
  } catch (err) {
    console.error(err);
    toastStore.error('Update Failed', err.message || 'We encountered an error while saving.');
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  loadUserSettings();
  avatarPreview.value = null;
  newAvatar.value = null;
};

onMounted(loadUserSettings);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
