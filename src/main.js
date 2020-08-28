import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import MyHttpServer from './plugins/http'
import Moment from 'moment'
Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

// 全局过滤器
// 处理时间格式
Vue.filter('fmtDate', (val) => {
  // return new Date(val).toLocaleDateString()
  return Moment(val).format('YYYY-MM-DD')
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
