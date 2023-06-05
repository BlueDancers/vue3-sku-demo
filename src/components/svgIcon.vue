<template>
  <svg aria-hidden="true">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    prefix?: string
    name: string
    color?: string
  }>(),
  {
    prefix: 'icon',
    name: '',
    color: '#000',
  }
)
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style scoped></style>
