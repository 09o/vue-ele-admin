import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      meta: { title: '首页' },
      component: () => import('../views/Home'),
      children: [
        {
          path: 'users',
          component: () => import('../components/users/User')
        },
        {
          path: 'rights',
          component: () => import('../components/rights/Rights')
        },
        {
          path: 'roles',
          component: () => import('../components/rights/Roles')
        }
      ]
    },
    {
      path: '/login',
      meta: { title: '首页' },
      component: () => import('../views/Login')
    }
  ]
})

export default router