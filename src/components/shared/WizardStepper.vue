<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

const props = defineProps({
  steps: { type: Array, required: true }, // [{ label: String }]
  currentStep: { type: Number, required: true },
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center">
      <template v-for="(step, idx) in steps" :key="idx">
        <!-- Step circle -->
        <div class="flex flex-col items-center">
          <div
            :class="[
              'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
              idx + 1 < currentStep
                ? 'bg-primary text-primary-foreground'
                : idx + 1 === currentStep
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground',
            ]"
          >
            <Check v-if="idx + 1 < currentStep" class="h-4 w-4" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span
            :class="[
              'mt-1 text-xs font-medium whitespace-nowrap hidden sm:block',
              idx + 1 === currentStep ? 'text-primary' : 'text-muted-foreground',
            ]"
          >{{ step.label }}</span>
        </div>

        <!-- Connector -->
        <div
          v-if="idx < steps.length - 1"
          :class="[
            'flex-1 h-0.5 mx-2 transition-all duration-300',
            idx + 1 < currentStep ? 'bg-primary' : 'bg-border',
          ]"
        />
      </template>
    </div>
  </div>
</template>
