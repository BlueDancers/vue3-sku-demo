<template>
  <div class="header_router">
    <a-popover placement="bottom" v-model:visible="routerVisible" :getPopupContainer="getPopupContainer" trigger="click">
      <template #content>
        <p
          @click="gotoRouter(citem)"
          class="mb-0 py-[6px] text-center cursor-pointer hover:bg-[#eaeaea] px-[16px]"
          v-for="citem in routeItem.children"
        >
          {{ citem.meta!.title }}
        </p>
      </template>
      <span :class="routerList.length != index + 1 ? '' : 'text-[#909090]'">
        {{ routeItem.meta!.title }}
      </span>
    </a-popover>
    <span class="px-[6px] text-[#929292]">
      {{ routerList.length != index + 1 ? '/ ' : '' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, type RouteRecordRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    routerList: RouteRecordRaw[]
    routeItem: RouteRecordRaw
    index: number
  }>(),
  {}
)

const routerVisible = ref(false)

const router = useRouter()

function gotoRouter(route: RouteRecordRaw) {
  router.push({
    name: route.name,
  })
  routerVisible.value = false
}

function getPopupContainer() {
  return document.querySelector('.layout_header')
}
</script>
