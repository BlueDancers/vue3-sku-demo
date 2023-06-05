<template>
  <div class="layout_menu flex h-[100vh] relative">
    <div class="w-[130px]" :class="style.theme == 'dark' ? 'bg-[#041527]' : 'bg-white'">
      <div
        class="flex flex-col items-center justify-center py-[16px] border-b-[.5px] border-b-[rgba(255,255,255,0.2)] border-b-solid"
      >
        <SvgIcon class="w-[46px] h-[46px]" name="logo" />
      </div>
      <!-- 一级菜单以及二级菜单弹框  START -->
      <menuItem
        v-for="item in leftMenu"
        :key="item.name"
        :menu="item"
        :selectedKey="selectedKeys[1]"
        :showChildMenu="style.showChildMenu"
      >
      </menuItem>
      <!-- 一级菜单以及二级菜单弹框  END -->
    </div>
    <!-- 二级菜单 -->
    <div
      class="bg-white pt-[10px] base_child"
      :class="childMenu.length != 0 && style.showChildMenu ? 'w-[130px]' : 'w-[0px]'"
    >
      <template v-if="style.showChildMenu">
        <div
          v-for="item in childMenu"
          :key="item.name"
          @click="clickChild(item.name)"
          class="px-[6px] pb-[6px]"
        >
          <div
            :class="selectedKeys[2] == item.name ? 'text-[#4379EE] bg-[#EEF2FB] h-[40px] ' : ''"
            class="pl-[6px] text-left leading-[40px] text-[14px] cursor-pointer base_child_item"
          >
            {{ item.meta!.title }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { asyncRouter, baseRouter } from '@/router/index'
import { computed, effect, ref, toRaw } from 'vue'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
import { useStyleStore } from '@/stores/style'
import { useAuthStore } from '@/stores/auth'

import menuItem from './menuItem.vue'
import { loopRouer } from '@/utils/util'
import SvgIcon from '@/components/svgIcon.vue'
import { deepClone } from '@yipai-front-end/lib'

const router = useRouter()
const route = useRoute()
const style = useStyleStore()
const auth = useAuthStore()

const selectedKeys = ref<string[]>([])

/**
 * 侧边栏
 */
const leftMenu = computed(() => {
  let userRouter = loopRouer(deepClone(asyncRouter), toRaw(auth.asyncRouter))
  return [...baseRouter, ...userRouter]
})

/**
 * 二级菜单显示
 */
const childMenu = computed(() => {
  if (selectedKeys.value.length == 3 && leftMenu.value.length > 0) {
    let child = leftMenu.value.find((e) => e.name == selectedKeys.value[1])!
    if (child && child.children) {
      return child.children.filter(
        (item: RouteRecordRaw) => auth.asyncRouter.includes(item.name!) && item.meta!.showMenu
      )
    } else {
      return []
    }
  } else {
    return []
  }
})

// 监听当前路由
effect(() => {
  if (route.matched.length) {
    selectedKeys.value = route.matched.map((e) => e.name) as string[]
  }
})

function clickChild(name) {
  router.push({
    name,
  })
}
</script>

<style lang="less" scoped>
.layout_menu {
  // menuItem 组件
  :deep(.ant-popover-inner-content) {
    padding: 5px 0;
  }
}
.base_child {
  position: relative;
  z-index: 1;
  transition: all 0.2s;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  .base_child_item {
    white-space: nowrap;
  }
}
</style>
