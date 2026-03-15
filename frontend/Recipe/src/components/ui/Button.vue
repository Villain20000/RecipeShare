<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  hoverLift?: boolean
  to?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  hoverLift: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-soft hover:shadow-md',
  accent: 'btn-accent'
}

const sizeClasses = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg'
}

const isLink = computed(() => props.to || props.href)

const component = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <component
    :is="component"
    v-if="isLink"
    :to="to"
    :href="href"
    :class="[
      'btn',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      hoverLift ? 'btn-hover-lift' : '',
      loading ? 'pointer-events-none' : ''
    ]"
    :aria-disabled="disabled || loading"
    :tabindex="disabled ? -1 : 0"
  >
    <LoadingSpinner v-if="loading" size="sm" :color="variant === 'secondary' || variant === 'ghost' ? 'gray' : 'white'" />
    <span v-else class="flex items-center justify-center gap-2">
      <slot />
    </span>
  </component>
  
  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
    :class="[
      'btn',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      hoverLift ? 'btn-hover-lift' : '',
      (disabled || loading) ? 'opacity-50 cursor-not-allowed shadow-none scale-100' : ''
    ]"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
  >
    <LoadingSpinner v-if="loading" size="sm" :color="variant === 'secondary' || variant === 'ghost' ? 'gray' : 'white'" />
    <span v-else class="flex items-center justify-center gap-2">
      <slot />
    </span>
  </button>
</template>
