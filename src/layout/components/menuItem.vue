<template>
  <!-- 存在子类 -->
  <a-popover
    placement="rightTop"
    :visible="popStatus"
    color="#041527"
    @visibleChange="popVisibleChange($event, menu)"
    :getPopupContainer="getPopupContainer"
  >
    <template #content>
      <div v-for="it in menu.children" :key="it.name" @click="clickChild(it.name)">
        <div class="pop_menu_item">
          <span class="menu_title"> {{ it.meta!.title }}</span>
        </div>
      </div>
    </template>
    <div class="menu_item" :class="selectedKey == menu.name && 'active_menu'" @click="clickChild(menu.name)">
      <div class="menu_icon">
        <SvgIcon
          class="w-[18px] h-[18px] relative top-[3px]"
          :name="(menu.meta!.icon as string)"
          :color="selectedKey == menu.name ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.8) '"
        />
      </div>
      <!-- -->
      <div class="menu_title">{{ menu.meta!.title }}</div>
    </div>
  </a-popover>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svgIcon.vue'
import { ref } from 'vue'
import { useRouter, type RouteRecordRaw } from 'vue-router'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    menu: RouteRecordRaw
    selectedKey: string
    showChildMenu: boolean
  }>(),
  {}
)
const popStatus = ref(false) // pop气泡框的显示状态

/**
 * 当菜单弹框状态改变时触发
 */
function popVisibleChange(visible, item) {
  if ((item.name != props.selectedKey || !props.showChildMenu) && item.children && visible) {
    popStatus.value = true
  } else {
    popStatus.value = false
  }
}

function clickChild(name) {
  popStatus.value = false
  router.push({
    name,
  })
}

function getPopupContainer() {
  return document.querySelector('.layout_menu')
}
</script>

<style lang="less" scoped>
.pop_menu_item {
  width: 160px;
  &:nth-child(1) {
    margin-top: 0;
  }
  &:nth-last-child(1) {
    margin-bottom: 0;
  }
}
.menu_item,
.pop_menu_item {
  margin: 4px 0 8px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  color: rgba(255, 255, 255, 0.65);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s, color 0.3s;
  cursor: pointer;
  .menu_title {
    margin-left: 10px;
  }
  &:hover {
    .menu_title {
      color: white;
    }
  }
}
.active_menu {
  background-color: #1677FF;
  color: white;
}
</style>
