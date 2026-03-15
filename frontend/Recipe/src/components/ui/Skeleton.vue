<script setup lang="ts">
interface Props {
  variant?: 'text' | 'rect' | 'circle'
  width?: string
  height?: string
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'rect',
  animated: true
})
</script>

<template>
  <div
    :class="[
      'bg-surface-200',
      variant === 'circle' ? 'rounded-full' : 'rounded-lg',
      animated ? 'animate-pulse' : '',
      'overflow-hidden'
    ]"
    :style="{ width, height }"
  >
    <div 
      v-if="animated" 
      class="w-full h-full bg-gradient-to-r from-transparent via-surface-100/50 to-transparent -translate-x-full animate-shimmer"
    ></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
