import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入elementUI
import './element/index.js'
// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
