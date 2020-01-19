import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入elementUI
import './element/element.js'
// 引入elementUI样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 引入公共的组件-- 面包屑导航
import Breadcrumb from './components/common/Breadcrumb.vue'
// 引入axios
import axios from 'axios'
// 配置请求的默认地址
axios.defaults.baseURL = 'http://127.0.1:8888/api/private/v1/'
// 在axios挂载在vue全局对象上之前 设置拦截器 将请求拦截 设置请求头
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})

// 注册全局组件 （写在路由页面更加简洁）
Vue.use(Breadcrumb)
Vue.component('breadcrumb', Breadcrumb)
// 将axios挂载在vue全局对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  Breadcrumb,
  render: h => h(App)
}).$mount('#app')
