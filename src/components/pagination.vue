<template>
  <div class="flex justify-between mt-20">
    <div class="text-[14px]"></div>
    <a-pagination
      v-model:current="pageInfo.currentPage"
      v-model:pageSize="pageInfo.pageSize"
      :total="pageInfo.totalSize"
      :showQuickJumper="true"
      :showSizeChanger="true"
      :showLessItems="true"
      :pageSizeOptions="['20', '30', '40']"
      @change="(page:number) => search(page)"
      :show-total="(total:number,) => `本页有${pageInfo.thePageSize}条数据，共 ${total} 条记录`"
    >
      <template #buildOptionText="props">
        <span>{{ props.value }}条/页</span>
      </template>
    </a-pagination>
  </div>
</template>

<script setup lang="ts">
import type { tablePageType } from '@/modules/hook/useTable'
defineProps<{
  pageInfo: tablePageType
  search: (page: number) => void
}>()
</script>

<style lang="less" scoped>
:deep(.ant-pagination-options-size-changer) {
  display: none !important;
  :deep(.ant-pagination-options-quick-jumper) {
    margin-left: 0px;
  }
}
</style>
