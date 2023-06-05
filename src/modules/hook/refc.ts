import { reactive, ref } from 'vue'
import { deepClone } from '@yipai-front-end/lib'

/**
 * 增加reset方法的ref
 * @param target 被代理对象
 * @returns
 */
export function refc<T extends object>(target: T) {
  const oldValue = deepClone(target)
  const data = reactive(target!)
  function reset() {
    for (const key in oldValue) {
      data[key] = oldValue[key]
    }
  }
  return {
    value: data,
    reset,
  }
}

export type Refc<T> = {
  value: T
  /**
   * 初始化变量
   */
  reset: Function
}
