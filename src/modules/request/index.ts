import { baseUrl } from '@/config'
import { message } from 'ant-design-vue'
import Axios from 'axios'
import router from '@/router/index'
import { getStorage, setStorage } from '@yipai-front-end/lib'

const axios = Axios.create({
  baseURL: baseUrl,
  method: 'POST', // 默认值
})

axios.interceptors.request.use((config) => {
  config.headers.authorization = getStorage('authorization') || ''
  return config
})

axios.interceptors.response.use(
  (res) => {
    const { data } = res
    if (res.headers.authorization) {
      setStorage('authorization', res.headers.authorization)
    }
    if (data.code === 1) {
      return data
    } else if (data.code === 4) {
      router.push({
        name: 'login',
      })
      message.error('登录过期,请重新登录')
      return Promise.reject(data)
    } else {
      message.error(data.msg)
      return Promise.reject(data)
    }
  },
  (error) => {
    console.log('err', error)
    message.error(error.response.data.msg)
    return Promise.reject(error)
  }
)

export default axios.request
