import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录页面
import Login from '../components/Login.vue'
// 引入主页
import Home from '../components/Home.vue'
// 引入欢迎页面
import Welcome from '../components/Welcome.vue'
// 引入用户列表页面
import Users from '../components/Users.vue'
// 引入用户角色页面
import Roles from '../components/role/Roles.vue'
// 引入用户权限页面
import Rights from '../components/role/Rights.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 从哪个页面跳转来
  // next() 放行  next('/路径') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenValue = window.sessionStorage.getItem('token')
  if (!tokenValue) return next('/login')
  // 如果没有token  说明没有登录 则需强制跳转到登录页面
  next()
})

export default router
