import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import MyHttpServer from './plugins/http'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
