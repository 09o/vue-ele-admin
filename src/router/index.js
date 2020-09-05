import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home'),
      children: [
        {
          path: 'users',
          name: 'users',
          component: () => import('../components/users/User')
        },
        {
          path: 'rights',
          name: 'rights',
          component: () => import('../components/rights/Rights')
        },
        {
          path: 'roles',
          name: 'roles',
          component: () => import('../components/rights/Roles')
        },
        {
          path: 'goods',
          name: 'goods',
          component: () => import('../components/goods/goodslist/Goods'),
        },
        {
          path: 'addgoods',
          name: 'addgoods',
          component: () => import('../components/goods/goodslist/Add')
        },
        {
          path: 'params',
          name: 'goodsParams',
          component: () => import('../components/goods/Params')
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../components/goods/Categories')
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('../components/orders/Orders')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login')
    }
  ]
})

// 路由守卫
// 在路由配置生效之前执行，在这里用于统一判断token
router.beforeEach((to, from, next) => {
  // 如果to的是login，则next
  // 反之，判断token
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('未登录，请登录后再尝试')
      // this.$router.push("/login");
      router.push('/login')
      return
    }
  }
  next()
})

export default router