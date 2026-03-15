<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  fullScreen: false
})

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3'
}

const colorClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  white: 'border-white/30 border-t-white',
  gray: 'border-gray-200 border-t-gray-600'
}
</script>

<template>
  <div
    v-if="fullScreen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
  >
    <div
      :class="[
        'rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color]
      ]"
      role="status"
      aria-label="Loading"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div
    v-else
    :class="[
      'rounded-full animate-spin',
      sizeClasses[size],
      colorClasses[color]
    ]"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
