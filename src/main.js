import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import MyHttpServer from './plugins/http'
import Moment from 'moment'
// 将面包屑组件用于全局
import MyBread from './components/custom/Bread'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

// 全局过滤器
// 处理时间格式
Vue.filter('fmtDate', (val) => {
  // return new Date(val).toLocaleDateString()
  return Moment(val).format('YYYY-MM-DD')
})

// 处理权限层级
Vue.filter('fmtLevel', (val) => {
  return '一二三四五六七八九十'[parseInt(val)] + '级'
})

Vue.component(MyBread.name , MyBread)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
