<template>
  <a-table
    class="base_table"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    bordered
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <slot name="bodyCell" :column="column" :record="record"></slot>
    </template>
  </a-table>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  dataSource: any[]
  columns: any[]
}>()
</script>

<style scoped>
:deep(.table-striped) {
  background-color: #fafafa;
}
</style>
