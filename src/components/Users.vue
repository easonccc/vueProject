<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb slot1="用户管理" slot2="用户列表"></breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="7">
          <el-row>
            <el-col :span="20"><el-input placeholder="请输入搜索的内容" class="search-input"></el-input></el-col>
            <el-col :span="4"><el-button class="search-btn" type="warning" icon="el-icon-search"></el-button></el-col>
          </el-row>
        </el-col>
        <el-col :span="3">
          <el-button class="add-btn">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="page.pagenum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 10, 20]"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取到的列表数据
      userList: [],
      // 发送请求的页码参数
      // 默认当前页码
      // 默认每页显示条数
      page: {
        pagenum: 1,
        pagesize: 3
      },
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户的数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.page })
      if (res.meta.status !== 200) {
        this.$msg.error('获取列表失败')
      }
      this.userList = res.data.users
      console.log(this.userList)
      this.total = res.data.total
    },
    // 当每页条数发生改变时
    handleSizeChange(v) {
      this.page.pagesize = v
      this.getUserList()
    },
    // 当当前页面发生变化时
    handleCurrentChange(v) {
      this.page.pagenum = v
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
.search-input /deep/ .el-input__inner {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.search-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 40px;
  background-color: #ebb563;
}
.add-btn {
  display: inline-block;
  margin-left: 40px;
  background-color: #ffdc00;
  height: 40px;
  box-sizing: border-box;
  border: 0;
}
.el-table {
  margin-top: 10px;
}
</style>
