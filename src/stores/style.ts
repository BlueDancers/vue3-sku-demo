import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStyleStore = defineStore(
  'style',
  () => {
    const theme = ref<'dark' | 'light'>('dark')
    const showChildMenu = ref(true) // 是否显示二级目录
    return {
      theme,
      showChildMenu,
    }
  },
  {
    persist: true,
  }
)
