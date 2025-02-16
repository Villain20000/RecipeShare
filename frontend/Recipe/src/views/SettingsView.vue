<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-3xl">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold text-gray-800">Settings</h1>
            <p class="text-gray-600">Manage your account settings and preferences</p>
          </div>
          <button
            @click="$router.push('/profile')"
            class="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back to Profile
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 rounded-lg p-6">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="ml-3 text-red-800">{{ error }}</p>
          </div>
        </div>

        <!-- Settings Form -->
        <form v-else @submit.prevent="saveSettings" class="space-y-8">
          <!-- Profile Section -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
            <div class="space-y-4">
              <!-- Avatar -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div class="flex items-center space-x-6">
                  <div class="relative">
                    <ProfilePicture 
                      :src="avatarPreview || user?.avatar"
                      :alt="user?.username"
                      size="xl"
                    >
                      <button 
                        type="button"
                        @click="triggerAvatarUpload"
                        class="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </ProfilePicture>
                  </div>
                  <input 
                    ref="avatarInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarUpload"
                  >
                  <div class="text-sm text-gray-600">
                    <p>Upload a new profile picture</p>
                    <p class="mt-1">JPG, PNG or GIF (max. 2MB)</p>
                  </div>
                </div>
              </div>

              <!-- Username -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Your username"
                >
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Your email"
                >
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  v-model="form.bio"
                  rows="3"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Password Section -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  v-model="form.currentPassword"
                  type="password"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your current password"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  v-model="form.newPassword"
                  type="password"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter new password"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Confirm new password"
                >
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="form.emailNotifications"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-3 text-gray-700">
                  Email notifications
                  <p class="text-sm text-gray-500">Receive email notifications about your recipes and followers</p>
                </label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="form.newsletterSubscription"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-3 text-gray-700">
                  Newsletter subscription
                  <p class="text-sm text-gray-500">Receive our weekly newsletter with featured recipes and cooking tips</p>
                </label>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="pt-6 border-t">
            <button
              type="submit"
              class="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 font-medium transition-all flex items-center justify-center"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Saving Changes...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useToastStore } from '@/stores/toastStore';
import { userService } from '@/services/user';
import ProfilePicture from '@/components/ProfilePicture.vue';

const BASE_URL = 'http://localhost:5000';
const DEFAULT_AVATAR = '/default-avatar.png'; // This should be placed in your public folder

export default {
  name: 'SettingsView',
  components: {
    ProfilePicture
  },
  setup() {
    const userStore = useUserStore();
    const toastStore = useToastStore();
    const avatarInput = ref(null);

    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const error = ref(null);
    const user = ref(userStore.currentUser);
    const avatarPreview = ref(null);
    const newAvatar = ref(null);

    const form = ref({
      username: '',
      email: '',
      bio: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailNotifications: false,
      newsletterSubscription: false
    });

    const triggerAvatarUpload = () => {
      avatarInput.value.click();
    };

    const handleAvatarUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toastStore.error('Image size should be less than 2MB');
          return;
        }
        newAvatar.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const getAvatarUrl = (avatarPath) => {
      if (!avatarPath) return DEFAULT_AVATAR;
      if (avatarPath.startsWith('data:')) return avatarPath;
      if (avatarPath.startsWith('http')) return avatarPath;
      // Clean the path by removing any 'uploads/' prefix and leading slashes
      const cleanPath = avatarPath.replace(/^uploads[\/\\]/, '').replace(/^[\/\\]/, '');
      return `${BASE_URL}/uploads/${cleanPath}`;
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
        console.error('Error loading user settings:', err);
        error.value = 'Failed to load settings';
      } finally {
        isLoading.value = false;
      }
    };

    const saveSettings = async () => {
      isSubmitting.value = true;
      try {
        // Validate password change
        if (form.value.newPassword || form.value.confirmPassword || form.value.currentPassword) {
          if (!form.value.currentPassword) {
            throw new Error('Please enter your current password');
          }
          if (form.value.newPassword !== form.value.confirmPassword) {
            throw new Error('New passwords do not match');
          }
          if (form.value.newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
          }
        }

        const formData = new FormData();
        formData.append('username', form.value.username);
        formData.append('email', form.value.email);
        formData.append('bio', form.value.bio || '');
        
        // Convert settings object to JSON string
        const settings = {
          emailNotifications: form.value.emailNotifications,
          newsletterSubscription: form.value.newsletterSubscription
        };
        formData.append('settings', JSON.stringify(settings));

        // Only append avatar if a new one is selected
        if (newAvatar.value) {
          formData.append('avatar', newAvatar.value);
        }

        // Handle password change first if needed
        if (form.value.newPassword) {
          await userService.changePassword(form.value.currentPassword, form.value.newPassword);
        }

        // Update user settings
        const updatedUser = await userService.updateUserSettings(formData);
        
        // Update the local user state
        userStore.setUser({
          ...userStore.user,
          ...updatedUser
        });
        
        // Reset password fields and avatar
        form.value.currentPassword = '';
        form.value.newPassword = '';
        form.value.confirmPassword = '';
        newAvatar.value = null;
        avatarPreview.value = null;
        
        toastStore.success('Settings updated successfully');
      } catch (err) {
        console.error('Error saving settings:', err);
        toastStore.error(err.response?.data?.message || err.message || 'Failed to update settings');
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      loadUserSettings();
    });

    return {
      user,
      form,
      isLoading,
      isSubmitting,
      error,
      avatarInput,
      avatarPreview,
      triggerAvatarUpload,
      handleAvatarUpload,
      saveSettings,
      getAvatarUrl
    };
  }
};
</script> 