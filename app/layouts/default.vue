<script setup lang="ts">
// Falling snow, with an on/off button. It starts off for people whose device asks
// for less motion; after that, each person's choice is remembered on their own device.
const SNOW_KEY = 'santa-snow'
const snowOn = ref(false)
const ready = ref(false) // don't show the button until we know which way it starts

onMounted(() => {
  let saved: string | null = null
  try {
    saved = localStorage.getItem(SNOW_KEY)
  }
  catch {
    // private browsing etc.: just use the default
  }
  snowOn.value = saved ? saved === 'on' : !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ready.value = true
})

function toggleSnow() {
  snowOn.value = !snowOn.value
  try {
    localStorage.setItem(SNOW_KEY, snowOn.value ? 'on' : 'off')
  }
  catch {
    // not saved; it still works until the page is closed
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <SnowFall v-if="snowOn" />
    <header class="relative z-10 px-4 pt-16 pb-6 text-center sm:pt-6">
      <UButton
        v-if="ready"
        class="absolute top-3 right-3"
        color="neutral"
        variant="soft"
        size="lg"
        :aria-pressed="snowOn"
        :label="snowOn ? '❄️ Snow: on' : '❄️ Snow: off'"
        @click="toggleSnow"
      />
      <NuxtLink
        to="/"
        class="inline-block rounded-xl px-2 text-4xl font-bold text-primary font-display focus-visible:outline-4 focus-visible:outline-primary sm:text-5xl"
      >
        🎅 Secret Santa 🎄
      </NuxtLink>
    </header>
    <main class="relative z-10 mx-auto w-full max-w-2xl px-4 pb-16">
      <slot />
    </main>
  </div>
</template>
