<template>
  <a-config-provider :locale="zhCN">
    <RouterView v-slot="{ Component }">
      <component v-if="app.showComponent" :is="Component" />
    </RouterView>
  </a-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

import zhCN from 'ant-design-vue/es/locale/zh_CN'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const app = useAppStore()
onMounted(() => {})
</script>

<style scoped></style>
