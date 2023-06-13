import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import layout from '@/layout/index.vue'
import { useAuthStore } from '@/stores/auth'

NProgress.configure({ showSpinner: false })

/**
 * 基础路由
 */
export const baseRouter: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      showMenu: true,
      title: '工作台',
      icon: 'home',
    },
    component: () => import('@/views/dashboard/index.vue'),
  },
]

/**
 * 动态路由
 */
export const asyncRouter: RouteRecordRaw[] = [
  {
    path: '/goods',
    name: 'goods',
    meta: {
      showMenu: true,
      title: '商品管理',
      icon: 'goods',
    },
    redirect: '/goods/add',
    children: [
      {
        path: '/goods/add',
        name: 'goodsAdd',
        meta: {
          showMenu: true,
          title: '添加商品',
          icon: 'goods',
        },
        component: () => import('@/views/goods/add/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
      },
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'baseDashboard',
      meta: {
        title: '根路径',
      },
      component: layout,
      children: [...baseRouter, ...asyncRouter],
    },
    {
      path: '/404',
      name: '404',
      meta: {
        title: '页面不存在..',
      },
      component: () => import('@/views/error/404.vue'),
    },
    {
      path: '/:pathMath(.*)',
      component: () => import('@/views/error/404.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  NProgress.start()
  // 登录后逻辑
  if (auth.isLogin) {
    if (to.name == '404') {
      next()
      return
    }

    if (to.name == 'login') {
      next({ name: 'dashboard' })
    } else {
      console.log(auth.asyncRouter);
      console.log(to);
      // 判断权限是否通过
      if (auth.asyncRouter.includes(String(to.name))) {
        document.title = String(to.meta.title)
        next()
      } else {
        next({ name: '404' })
      }
    }
    return
  } else {
    // 未登录逻辑
    if (to.name == 'login') {
      document.title = String(to.meta.title)
      next()
    } else {
      next({ name: 'login' })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

export default router
