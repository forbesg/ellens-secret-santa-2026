<script setup lang="ts">
// "🎄 12 sleeps to go!" Hidden once the exchange date has passed.
import { countdownText } from '#shared/countdown'

const props = defineProps<{ date: string }>()
const text = computed(() => countdownText(props.date))
</script>

<template>
  <p
    v-if="text"
    class="inline-block rounded-full bg-secondary/15 px-5 py-2 text-xl font-bold text-secondary"
  >
    {{ text }}
  </p>
</template>
