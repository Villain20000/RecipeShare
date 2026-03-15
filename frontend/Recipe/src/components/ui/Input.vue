<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number | null
  type?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  autocomplete?: string
  min?: string | number
  max?: string | number
  hasIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  hasIcon: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-1.5 w-full group">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-bold text-surface-700 transition-colors group-focus-within:text-brand-600"
    >
      {{ label }}
      <span v-if="required" class="text-accent-500 ml-0.5">*</span>
    </label>
    
    <div class="relative flex items-center">
      <div 
        v-if="hasIcon" 
        class="absolute left-4 text-surface-400 pointer-events-none transition-colors group-focus-within:text-brand-500"
      >
        <slot name="icon"></slot>
      </div>
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :name="name"
        :autocomplete="autocomplete"
        :min="min"
        :max="max"
        @input="handleInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        :class="[
          'input',
          hasIcon ? 'pl-11' : '',
          error ? 'input-error ring-1 ring-red-500/20' : '',
          'hover:border-surface-300 focus:shadow-elevation-1',
          $attrs.class
        ]"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
      />
      
      <div v-if="error" class="absolute right-4 text-red-500 pointer-events-none animate-shake">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-1 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
    >
      <p
        v-if="error"
        :id="`${inputId}-error`"
        class="text-xs font-medium text-red-500 flex items-center gap-1.5 px-1"
        role="alert"
      >
        {{ error }}
      </p>
      <p
        v-else-if="hint"
        :id="`${inputId}-hint`"
        class="text-xs text-surface-500 px-1"
      >
        {{ hint }}
      </p>
    </transition>
  </div>
</template>
