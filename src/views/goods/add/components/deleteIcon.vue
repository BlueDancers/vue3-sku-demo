<template>
  <div class="w-[16px] h-[16px] bg-red-500 rounded-[16px] flex justify-center items-center cursor-pointer">
    <svgIcon class="w-[10px] h-[10px]" name="delete" color="#fff"></svgIcon>
  </div>
</template>

<script setup lang="ts">
import svgIcon from '@/components/svgIcon.vue'
const emit = defineEmits(['deleteItem'])
</script>

<style scoped></style>
