import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import router from '@/router/index'
import { removeStorage } from '@yipai-front-end/lib'

const baseRouterName = ['dashboard']
export const useAuthStore = defineStore(
  'router',
  () => {
    const isLogin = ref(false) // 是否登录
    const asyncRouter: Ref<string[]> = ref([]) // 当前用户拥有的权限
    const userInfo = ref({
      name: 'admin', // 账户名称
    })
    function getAsyncRouer() {
      let asyncRouters = ['goods', 'goodsAdd']
      asyncRouter.value.push(...baseRouterName, ...asyncRouters)
    }

    function logout() {
      isLogin.value = false
      removeStorage('authorization')
      router.replace({
        name: 'login',
      })
    }

    return {
      isLogin,
      userInfo,
      asyncRouter,
      getAsyncRouer,
      logout,
    }
  },
  {
    persist: true,
  }
)
