<template>
  <div 
    class="relative flex-shrink-0"
    :class="[sizeClasses[size]]"
  >
    <div 
      class="w-full h-full overflow-hidden border border-surface-100 shadow-soft"
      :class="[rounded ? 'rounded-[2rem]' : 'rounded-full', hover ? 'hover:scale-105 hover:shadow-elevation-2 transition-all duration-300' : '']"
    >
      <img 
        :src="avatarUrl"
        :alt="alt"
        class="w-full h-full object-cover"
        @error="handleError"
      >
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const BASE_URL = 'http://localhost:5000';
const DEFAULT_AVATAR = 'https://via.placeholder.com/150?text=User';

const props = defineProps({
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
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: false
  }
});

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32'
};

const avatarUrl = computed(() => {
  if (!props.src) return DEFAULT_AVATAR;
  if (props.src.startsWith('data:') || props.src.startsWith('http')) return props.src;
  const cleanPath = props.src.replace(/^\/+/, '').replace(/^uploads\//, '');
  return `${BASE_URL}/uploads/${cleanPath}`;
});

const handleError = (e) => {
  e.target.src = DEFAULT_AVATAR;
};
</script>
