import type { AxiosResponse } from 'axios'
import { ref, type Ref } from 'vue'

export type tablePageType = {
  /**
   * 当前页码
   */
  currentPage: number
  /**
   * 每页最大数量
   */
  pageSize: number
  /**
   * 当页数量
   */
  thePageSize: number
  /**
   * 一共多少页
   */
  totalPages: number
  /**
   * 总数据量
   */
  totalSize: number
}

export function useTable<T>(request: (data: any) => Promise<AxiosResponse<any, any>>, querys: T) {
  const loading = ref(false) // 是否请求中
  const query = ref(querys) // 搜索数据
  const pageInfo: Ref<tablePageType> = ref({
    currentPage: 1,
    // 页码信息
    pageSize: 30,
    thePageSize: 0,
    totalPages: 0,
    totalSize: 0,
  })
  const tableList: Ref<any[]> = ref([]) // 表格信息

  /**
   * 设置页码信息
   * @param cPage 请求页
   */
  function setPage(cPage: number) {
    if (cPage) {
      pageInfo.value.currentPage = cPage
    }
  }

  /**
   * 查询数据信息
   * @param params 附加参数
   */
  function searchApi(callback?: (data: T) => any) {
    loading.value = true
    let data = {
      ...(query.value as T),
      currentPage: pageInfo.value.currentPage,
    }
    if (typeof callback == 'function') {
      data = callback(data)
    }

    return request(data)
      .then((res) => {
        console.log(res)
        pageInfo.value.pageSize = res.data.pageSize
        pageInfo.value.thePageSize = res.data.thePageSize
        pageInfo.value.totalPages = res.data.totalPages
        pageInfo.value.totalSize = Number(res.data.totalSize)
        tableList.value = res.data.data
      })
      .finally(() => {
        loading.value = false
      })
  }

  return {
    loading,
    query,
    tableList,
    pageInfo,
    setPage,
    searchApi,
  }
}
