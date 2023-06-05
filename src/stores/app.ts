import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    const showComponent = ref(true)

    /**
     * 刷新当前页面
     */
    function reset() {
      showComponent.value = false
      nextTick(() => {
        showComponent.value = true
      })
    }

    return {
      showComponent,
      reset,
    }
  },
  {
    persist: true,
  }
)
