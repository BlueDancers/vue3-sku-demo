import request from '@/modules/request'

/**
 * 登录相关api
 */
export const loginApi = {
  login(username: string, password: string) {
    return request({
      url: '/user/login',
      data: {
        username,
        password,
      },
    })
  },
}
