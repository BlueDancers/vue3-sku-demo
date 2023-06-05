<template>
  <a-modal
    :keyboard="false"
    v-model:visible="visible"
    :confirmLoading="visibleLoad"
    :title="title"
    @ok="ok"
    @cancel="cancel"
  >
    <slot></slot>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const props = withDefaults(
  defineProps<{
    title: string
    ok: () => Promise<any>
  }>(),
  {
    title: '',
  }
)

const visible = ref(false)
const visibleLoad = ref(false)

function open() {
  visible.value = true
}

function close() {
  visible.value = false
}

/**
 * 点击确认
 */
function ok() {
  visibleLoad.value = true
  props
    .ok()
    .then(() => {
      visible.value = false
    })
    .finally(() => {
      visibleLoad.value = false
    })
}

function cancel() {
  emit('cancel')
}

defineExpose({ open, close })
</script>

<style scoped></style>
