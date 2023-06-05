<template>
  <div class="flex bg-[#f0f2f5] relative overflow-y-hidden">
    <commMenu />
    <div class="layout relative flex-1 overflow-y-scroll h-[100vh] min-w-[1200px]">
      <commHeader />
      <div class="mx-[10px]">
        <routerView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </routerView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import commHeader from './components/header.vue'
import commMenu from './components/menu.vue'
</script>

<style lang="less">
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease-out;
}
</style>
