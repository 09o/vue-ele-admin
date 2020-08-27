import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      meta: { title: '首页' },
      component: () => import('../views/Home')
    },
    {
      path: '/login',
      meta: { title: '首页' },
      component: () => import('../views/Login')
    }
  ]
})

export default router