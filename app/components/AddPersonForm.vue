<script setup lang="ts">
import { LIMITS } from '#shared/types'

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ add: [person: { name: string, email: string }] }>()

const name = ref('')
const email = ref('')
const nameInput = useTemplateRef('nameInput')

function submit() {
  if (!name.value.trim() || props.disabled) return
  emit('add', { name: name.value.trim(), email: email.value.trim() })
}

/** Called by the parent once the person has been added. */
function clear() {
  name.value = ''
  email.value = ''
  nameInput.value?.inputRef?.focus()
}
defineExpose({ clear })
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="submit"
  >
    <UFormField
      label="Their name"
      name="name"
      size="xl"
    >
      <UInput
        ref="nameInput"
        v-model="name"
        placeholder="e.g. Grandma"
        :maxlength="LIMITS.nameMax"
        autocomplete="off"
        class="w-full"
        size="xl"
      />
    </UFormField>
    <UFormField
      label="Their email"
      hint="Optional"
      name="email"
      size="xl"
    >
      <UInput
        v-model="email"
        type="email"
        placeholder="grandma@example.com"
        :maxlength="LIMITS.emailMax"
        autocomplete="off"
        class="w-full"
        size="xl"
      />
    </UFormField>
    <UButton
      type="submit"
      size="xl"
      color="secondary"
      icon="i-lucide-user-plus"
      label="Add a person"
      block
      :disabled="!name.trim() || disabled"
    />
  </form>
</template>
