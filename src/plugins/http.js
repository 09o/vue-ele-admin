// 插件模块
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    if (config.url !== 'login') {
      // 在请求发起之前设置请求头
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (err) {
    return Promise.reject(err)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    return response
  }, function (err) {
    return Promise.reject(err)
  })

  Vue.prototype.$http = axios
}

export default MyHttpServer