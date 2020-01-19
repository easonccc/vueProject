<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/fishes_active.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button class="outBtn" type="warning" @click="logout">退出</el-button></el-header
    >
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="tooggleCollapse">|||</div>
        <!-- 导航菜单 -->
        <el-menu background-color="#ebb563" text-color="#fff" active-text-color="#e03939" unique-opened :collapse-transition="false" :collapse="isCollapse" router>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-sugar"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="v.path" v-for="v in item.children" :key="v.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-star-off"></i>
                <span>{{ v.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 大内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 定义菜单列表
      menuList: [],
      // 定义菜单的折叠状态
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      // 将token清空
      window.sessionStorage.clear()
      //   重定向到登录页面
      this.$router.push('/login')
    },
    // 获取菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      this.menuList = res.data
    },
    // 当点击折叠按钮时
    tooggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #ffdc00;
  display: flex;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 50px;
    margin-right: 20px;
  }
  align-items: center;
  font-size: 20px;
  color: #e03939;
}
.el-aside {
  background-color: #ffc132;
}
.el-main {
  background-color: #eee;
}
.el-menu {
  border: none;
}
.toggle-button {
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
