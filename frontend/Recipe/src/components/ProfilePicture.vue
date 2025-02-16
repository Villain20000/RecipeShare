<template>
  <div 
    class="relative"
    :class="[sizeClasses[size]]"
  >
    <img 
      :src="getAvatarUrl(src)"
      :alt="alt"
      class="rounded-full object-cover w-full h-full ring-2 ring-gray-200"
      :class="{'hover:scale-105 transition-transform duration-200': hover}"
    >
    <slot></slot>
  </div>
</template>

<script>
const BASE_URL = 'http://localhost:5000';
const DEFAULT_AVATAR = '/default-avatar.png';

export default {
  name: 'ProfilePicture',
  props: {
    src: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: 'User avatar'
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    hover: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24'
    };

    const getAvatarUrl = (avatarPath) => {
      if (!avatarPath) return DEFAULT_AVATAR;
      if (avatarPath.startsWith('data:')) return avatarPath;
      if (avatarPath.startsWith('http')) return avatarPath;
      // Clean the path by removing any leading slashes and 'uploads' prefix
      const cleanPath = avatarPath
        .replace(/^\/+/, '')
        .replace(/^uploads\//, '');
      return `${BASE_URL}/uploads/${cleanPath}`;
    };

    return {
      sizeClasses,
      getAvatarUrl
    };
  }
};
</script> 