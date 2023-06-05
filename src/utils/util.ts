import dayjs from 'dayjs'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 获取可访问路由树
 * @param tree
 */
export function loopRouer(tree: RouteRecordRaw[], asyncRouter: string[]) {
  for (let i = 0, len = tree.length; i < len; i++) {
    if (asyncRouter.includes(tree[i].name as string)) {
      if (tree[i].children) {
        tree[i].children = loopRouer(tree[i].children!, asyncRouter)
      }
    } else {
      tree.splice(i, 1)
      len = tree.length
      // if (tree.length == 0) {
      //   break
      // }
      // 不是最后一个这后退一位,是最后一位则结束循环
      if (i < tree.length) {
        i--
      }
    }
  }
  return tree
}

/**
 * 获取指定天数内的 开始 结束 时间戳
 * @param type
 */
export function getTimeType(day: number) {
  let endTime = dayjs().set('h', 23).set('m', 59).set('s', 59)

  let oneDay = 86400000
  let endDay = endTime.valueOf() - day * oneDay
  let startTime = dayjs(endDay).set('h', 0).set('m', 0).set('s', 0)

  return {
    startTime,
    endTime,
  }
}
